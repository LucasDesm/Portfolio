use axum::{http::StatusCode, Json};
use rustfft::{num_complex::Complex, FftPlanner};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct SignalRequest {
    /// Raw signal samples (e.g. EMG, glycemia, Hall sensor)
    pub samples: Vec<f64>,
    /// Sampling rate in Hz — needed for frequency axis
    pub sampling_rate: f64,
}

#[derive(Serialize)]
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
    if req.samples.is_empty() || req.samples.len() < 2 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if req.sampling_rate <= 0.0 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }

    let n = req.samples.len();
    let samples = &req.samples;

    let mean = samples.iter().sum::<f64>() / n as f64;

    let variance = samples.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / n as f64;
    let std = variance.sqrt();

    let rms = (samples.iter().map(|x| x.powi(2)).sum::<f64>() / n as f64).sqrt();

    let min = samples.iter().cloned().fold(f64::INFINITY, f64::min);
    let max = samples.iter().cloned().fold(f64::NEG_INFINITY, f64::max);

    let (peak_freq_hz, low_freq_energy_ratio) = fft_analysis(samples, req.sampling_rate);

    Ok(Json(SignalStats {
        n_samples: n,
        mean: round4(mean),
        std: round4(std),
        rms: round4(rms),
        min: round4(min),
        max: round4(max),
        peak_freq_hz: round4(peak_freq_hz),
        low_freq_energy_ratio: round4(low_freq_energy_ratio),
    }))
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

    // Peak frequency — skip DC bin (index 0)
    let peak_bin = magnitudes[1..]
        .iter()
        .enumerate()
        .max_by(|a, b| a.1.partial_cmp(b.1).unwrap())
        .map(|(i, _)| i + 1)
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
