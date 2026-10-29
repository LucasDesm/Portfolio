import type { Project, ParcoursStep, Stage } from './data'

// URL vide = aucun backend déployé : le site sert uniquement le contenu local (data.ts)
const API = import.meta.env.VITE_API_URL ?? ''
export const API_ENABLED = API !== ''
const SIGNAL_API = import.meta.env.VITE_SIGNAL_API_URL ?? ''
export const SIGNAL_API_ENABLED = SIGNAL_API !== ''

async function get<T>(base: string, path: string): Promise<T> {
  const res = await fetch(`${base}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json() as Promise<T>
}

async function post<T>(base: string, path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json() as Promise<T>
}

// ─── Portfolio API (Java / Spring Boot) ───────────────────────────────────────

export const portfolioApi = {
  getProjects:  ()           => get<Project[]>     (API, '/api/v1/projects'),
  getProject:   (slug: string) => get<Project>     (API, `/api/v1/projects/${slug}`),
  getParcours:  ()           => get<ParcoursStep[]>(API, '/api/v1/parcours'),
  getStages:    ()           => get<Stage[]>       (API, '/api/v1/stages'),
  getStage:     (slug: string) => get<Stage>       (API, `/api/v1/stages/${slug}`),
  sendContact:  (payload: ContactPayload) =>
    post<{ id: number; sentAt: string }>(API, '/api/v1/contact', payload),
}

// ─── Signal API (Rust / Axum) ─────────────────────────────────────────────────

export interface SignalRequest {
  samples: number[]
  sampling_rate: number
}

export interface SignalStats {
  n_samples: number
  mean: number
  std: number
  rms: number
  min: number
  max: number
  peak_freq_hz: number
  low_freq_energy_ratio: number
}

export const signalApi = {
  analyze: (req: SignalRequest) =>
    post<SignalStats>(SIGNAL_API, '/api/signal/stats', req),
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string
  email: string
  message: string
}
