use axum::{http::StatusCode, Json};
use rustfft::{num_complex::Complex, FftPlanner};
use serde::{Deserialize, Serialize};

/// Taille maximale d'un signal accepté (≈ 100 s à 1 kHz)
const MAX_SAMPLES: usize = 100_000;

#[derive(Deserialize)]
pub struct SignalRequest {
    /// Raw signal samples (e.g. EMG, glycemia, Hall sensor)
    pub samples: Vec<f64>,
    /// Sampling rate in Hz — needed for frequency axis
    pub sampling_rate: f64,
}

#[derive(Serialize, Debug)]
pub struct SignalStats {
    pub n_samples: usize,
    pub mean: f64,
    pub std: f64,
    pub rms: f64,
    pub min: f64,
    pub max: f64,
    /// Dominant frequency in Hz (index of max FFT magnitude, excluding DC)
    pub peak_freq_hz: f64,
    /// Normalised spectral energy in the 0–5 Hz band (slow trends / baseline drift)
    pub low_freq_energy_ratio: f64,
}

pub async fn compute_stats(
    Json(req): Json<SignalRequest>,
) -> Result<Json<SignalStats>, StatusCode> {
    analyze(&req.samples, req.sampling_rate).map(Json)
}

/// Statistiques temporelles et spectrales d'un signal échantillonné.
pub fn analyze(samples: &[f64], sampling_rate: f64) -> Result<SignalStats, StatusCode> {
    if samples.len() < 2 || samples.len() > MAX_SAMPLES {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if !sampling_rate.is_finite() || sampling_rate <= 0.0 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    // Des valeurs extrêmes feraient déborder la FFT en infini puis en NaN
    if samples.iter().any(|x| !x.is_finite() || x.abs() > 1e12) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }

    let n = samples.len();
    let mean = samples.iter().sum::<f64>() / n as f64;
    let variance = samples.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / n as f64;
    let std = variance.sqrt();
    let rms = (samples.iter().map(|x| x.powi(2)).sum::<f64>() / n as f64).sqrt();
    let min = samples.iter().cloned().fold(f64::INFINITY, f64::min);
    let max = samples.iter().cloned().fold(f64::NEG_INFINITY, f64::max);

    let (peak_freq_hz, low_freq_energy_ratio) = fft_analysis(samples, sampling_rate);

    Ok(SignalStats {
        n_samples: n,
        mean: round4(mean),
        std: round4(std),
        rms: round4(rms),
        min: round4(min),
        max: round4(max),
        peak_freq_hz: round4(peak_freq_hz),
        low_freq_energy_ratio: round4(low_freq_energy_ratio),
    })
}

fn fft_analysis(samples: &[f64], sampling_rate: f64) -> (f64, f64) {
    let n = samples.len();
    let mut planner = FftPlanner::new();
    let fft = planner.plan_fft_forward(n);

    let mut buffer: Vec<Complex<f64>> = samples
        .iter()
        .map(|&x| Complex { re: x, im: 0.0 })
        .collect();

    fft.process(&mut buffer);

    // Only the first N/2 bins are meaningful (Nyquist)
    let half = n / 2;
    let magnitudes: Vec<f64> = buffer[..half].iter().map(|c| c.norm()).collect();
    let total_energy: f64 = magnitudes.iter().map(|m| m.powi(2)).sum();

    // Frequency resolution per bin
    let freq_res = sampling_rate / n as f64;

    // Peak frequency — skip DC bin (index 0). total_cmp ne panique jamais, même sur NaN
    let peak_bin = magnitudes
        .iter()
        .enumerate()
        .skip(1)
        .max_by(|a, b| a.1.total_cmp(b.1))
        .map(|(i, _)| i)
        .unwrap_or(0);
    let peak_freq_hz = peak_bin as f64 * freq_res;

    // Low-frequency energy ratio (0–5 Hz)
    let low_cutoff_bin = ((5.0 / freq_res).ceil() as usize).min(half);
    let low_energy: f64 = magnitudes[..low_cutoff_bin]
        .iter()
        .map(|m| m.powi(2))
        .sum();
    let low_freq_energy_ratio = if total_energy > 0.0 {
        low_energy / total_energy
    } else {
        0.0
    };

    (peak_freq_hz, low_freq_energy_ratio)
}

#[inline]
fn round4(x: f64) -> f64 {
    (x * 10_000.0).round() / 10_000.0
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::f64::consts::PI;

    fn sine(freq_hz: f64, fs: f64, n: usize) -> Vec<f64> {
        (0..n).map(|i| (2.0 * PI * freq_hz * i as f64 / fs).sin()).collect()
    }

    #[test]
    fn finds_the_frequency_of_a_pure_sine() {
        let stats = analyze(&sine(50.0, 1000.0, 1000), 1000.0).unwrap();
        assert!((stats.peak_freq_hz - 50.0).abs() < 1e-9);
        assert!(stats.mean.abs() < 1e-3);
        assert!((stats.rms - 1.0 / 2f64.sqrt()).abs() < 1e-3);
        assert!(stats.low_freq_energy_ratio < 0.01);
    }

    #[test]
    fn slow_drift_lands_in_the_low_frequency_band() {
        let stats = analyze(&sine(2.0, 1000.0, 2000), 1000.0).unwrap();
        assert!((stats.peak_freq_hz - 2.0).abs() < 1e-9);
        assert!(stats.low_freq_energy_ratio > 0.99);
    }

    #[test]
    fn constant_signal_has_no_spread() {
        let stats = analyze(&[3.0; 64], 100.0).unwrap();
        assert_eq!(stats.std, 0.0);
        assert_eq!(stats.min, 3.0);
        assert_eq!(stats.max, 3.0);
    }

    #[test]
    fn rejects_invalid_input() {
        assert!(analyze(&[], 100.0).is_err());
        assert!(analyze(&[1.0], 100.0).is_err());
        assert!(analyze(&[1.0, 2.0], 0.0).is_err());
        assert!(analyze(&[1.0, f64::NAN], 100.0).is_err());
        assert!(analyze(&[1.0, 1e300], 100.0).is_err());
        assert!(analyze(&vec![0.0; MAX_SAMPLES + 1], 100.0).is_err());
    }
}
