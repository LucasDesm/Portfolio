import { useEffect, useRef } from 'react'
import { colors, fonts } from '@/lib/tokens'

// Austral-Omics (stage INSERM) : du capteur au modèle, en schéma de principe.
// Un brin d'ADN traverse le nanopore et le courant mesuré défile ; chaque lecture
// passe par l'encodeur et se place dans l'espace appris, où la distance reflète
// la parenté. Une lecture sur quatre ne ressemble à rien de connu : elle est
// signalée comme nouveauté. Aucune donnée réelle n'est tracée.

type V3 = [number, number, number]
type Box = { x: number; y: number; w: number; h: number }

const BASE_RATE   = 7     // bases lues par seconde
const READ_LEN    = 24    // bases par lecture
const FLIGHT      = 1.8   // s, de la fin de lecture à l'espace appris
const TO_ENCODER  = 0.4   // part du trajet jusqu'à l'encodeur
const POINT_LIFE  = 18    // s, durée d'affichage d'une lecture placée
const NOVEL_EVERY = 4     // une lecture sur quatre est une nouveauté
const START_T     = 12    // s, la scène démarre déjà en mouvement, une nouveauté arrive vite
const STATIC_T    = 17    // s, image fixe si les animations sont réduites

const BASES          = 'ACGT'
const BASE_COLORS    = [colors.accent, colors.rust, colors.olive, colors.textLight]
const CLUSTER_COLORS = [colors.accent, colors.rust, colors.olive, colors.textLight, colors.wine]

// Groupes de séquences apparentées dans l'espace appris
const CENTERS: V3[] = [
  [-0.55, 0.3, 0.2], [0.5, 0.35, -0.3], [0.1, -0.45, 0.45], [-0.35, -0.35, -0.5], [0.6, -0.2, 0.4],
]
// Zones vides, loin de tout groupe connu
const NOVEL_SPOTS: V3[] = [
  [0, 0.78, -0.1], [-0.82, -0.05, -0.15], [0.05, 0.1, -0.82], [0.85, 0.55, 0.2],
]
const SIGMA = 0.11
const POINTS_PER_CLUSTER = 22

// Hachage déterministe : une base, une lecture gardent la même forme d'une image à l'autre
function hash(n: number): number {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b)
  x ^= x >>> 13
  x = Math.imul(x, 0xc2b2ae35)
  x ^= x >>> 16
  return (x >>> 0) / 4294967296
}

function gauss(seed: number): number {
  const u = Math.max(1e-6, hash(seed * 2))
  const v = hash(seed * 2 + 1)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const baseAt = (i: number) => Math.floor(hash(i * 7 + 3) * 4)
// Le courant dépend des bases présentes dans le pore (k-mer), pas d'une seule
const levelAt = (i: number) => 0.2 + 0.6 * hash(baseAt(i - 1) * 16 + baseAt(i) * 4 + baseAt(i + 1) + 101)

function around(c: V3, seed: number, spread = SIGMA): V3 {
  return [c[0] + gauss(seed) * spread, c[1] + gauss(seed + 1000) * spread, c[2] + gauss(seed + 2000) * spread]
}

const CLOUD = CENTERS.flatMap((c, ci) =>
  Array.from({ length: POINTS_PER_CLUSTER }, (_, k) => ({ p: around(c, ci * 97 + k * 13 + 5), color: CLUSTER_COLORS[ci] })),
)

function readTarget(r: number): { novel: boolean; color: string; p: V3 } {
  if (r % NOVEL_EVERY === NOVEL_EVERY - 1) {
    const spot = NOVEL_SPOTS[Math.floor(r / NOVEL_EVERY) % NOVEL_SPOTS.length]
    return { novel: true, color: colors.rust, p: around(spot, r * 31 + 7, SIGMA * 0.5) }
  }
  const c = Math.floor(hash(r * 13 + 11) * CENTERS.length)
  return { novel: false, color: CLUSTER_COLORS[c], p: around(CENTERS[c], r * 31 + 7) }
}

// Capteur à gauche et modèle à droite ; empilés quand la zone est plus haute que large
function layout(W: number, H: number, fs: number) {
  const padX = Math.max(16, W * 0.04)
  const padTop = 48
  const padBot = fs + 24
  if (W / H >= 1.1) {
    const S: Box = { x: padX, y: padTop, w: W * 0.32, h: H - padTop - padBot }
    const L: Box = { x: W * 0.5, y: padTop - 16, w: W * 0.5 - padX, h: H - padTop - padBot + 16 }
    return { S, L, enc: { x: (S.x + S.w + L.x) / 2, y: S.y + S.h * 0.74 } }
  }
  const S: Box = { x: padX, y: padTop, w: W - 2 * padX, h: H * 0.34 }
  const encY = S.y + S.h + fs + 30
  const L: Box = { x: padX, y: encY + 22, w: W - 2 * padX, h: H - encY - 22 - padBot }
  return { S, L, enc: { x: W / 2, y: encY } }
}

function draw(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const fs = Math.round(Math.max(9, Math.min(11, W * 0.016)))
  const mono = `${fs}px ${fonts.mono}`
  const { S, L, enc } = layout(W, H, fs)
  const pos = t * BASE_RATE

  ctx.globalAlpha = 1
  ctx.setLineDash([])
  ctx.fillStyle = colors.bgCard
  ctx.fillRect(0, 0, W, H)

  const dot = (x: number, y: number, r: number) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill() }
  const line = (x1: number, y1: number, x2: number, y2: number) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke() }

  // ── Capteur : membrane et nanopore ─────────────────────────────────────────
  const poreX = S.x + S.w / 2
  const memY  = S.y + S.h * 0.3
  const tailY = S.y + S.h * 0.5
  const gap   = 10

  ctx.lineWidth = 1
  for (let x = S.x; x <= S.x + S.w; x += 7) {
    if (Math.abs(x - poreX) < gap + 6) continue
    ctx.strokeStyle = colors.borderLight
    line(x, memY - 5, x, memY + 5)
    ctx.fillStyle = colors.textLight
    ctx.globalAlpha = 0.45
    dot(x, memY - 6, 2.6)
    dot(x, memY + 6, 2.6)
    ctx.globalAlpha = 1
  }
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.roundRect(poreX - gap - 6, memY - 12, 6, 24, 3)
  ctx.roundRect(poreX + gap, memY - 12, 6, 24, 3)
  ctx.fill()

  // Une mesure à chaque base qui traverse le pore
  ctx.strokeStyle = colors.accent
  ctx.globalAlpha = (1 - (pos % 1)) * 0.35
  ctx.beginPath(); ctx.arc(poreX, memY, gap + 2 + (pos % 1) * 8, 0, Math.PI * 2); ctx.stroke()
  ctx.globalAlpha = 1

  // ── Brin d'ADN ─────────────────────────────────────────────────────────────
  const sp = 11
  const beads: { i: number; x: number; y: number; a: number }[] = []
  for (let i = Math.ceil(pos + (memY - S.y) / sp); i >= Math.floor(pos - (tailY - memY) / sp); i--) {
    const y = memY - (i - pos) * sp
    const d = Math.min(1, Math.abs(y - memY) / (memY - S.y))
    const above = y <= memY
    const a = above ? Math.min(1, (y - S.y + 4) / 14) : Math.max(0, 1 - (y - memY) / (tailY - memY))
    beads.push({ i, x: poreX + Math.sin(i * 0.8 + t * 1.3) * 9 * d, y, a })
  }
  ctx.strokeStyle = colors.textMuted
  ctx.lineWidth = 1.2
  for (let k = 1; k < beads.length; k++) {
    ctx.globalAlpha = Math.min(beads[k - 1].a, beads[k].a) * 0.5
    line(beads[k - 1].x, beads[k - 1].y, beads[k].x, beads[k].y)
  }
  ctx.font = `${fs - 1}px ${fonts.mono}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  for (const b of beads) {
    ctx.globalAlpha = b.a
    ctx.fillStyle = BASE_COLORS[baseAt(b.i)]
    dot(b.x, b.y, 3.2)
    if (b.y < memY - 14) {
      ctx.fillStyle = colors.textMuted
      ctx.fillText(BASES[baseAt(b.i)], b.x + 8, b.y)
    }
  }
  ctx.globalAlpha = 1

  // ── Courant mesuré ─────────────────────────────────────────────────────────
  const trTop = S.y + S.h * 0.6
  const trBot = S.y + S.h
  const trMid = (trTop + trBot) / 2
  const right = S.x + S.w
  const step  = Math.max(5, S.w / 34)   // px par base

  ctx.strokeStyle = colors.borderLight
  ctx.lineWidth = 1
  line(S.x, trTop, right, trTop)
  line(S.x, trBot, right, trBot)
  ctx.font = mono
  ctx.fillStyle = colors.textLight
  ctx.textBaseline = 'bottom'
  ctx.fillText('pA', S.x, trTop - 4)

  const kMin = Math.floor(pos - S.w / step) - 1
  const kMax = Math.floor(pos)
  // Une lecture = READ_LEN bases : séparateurs en pointillés
  ctx.setLineDash([2, 3])
  ctx.strokeStyle = colors.border
  ctx.globalAlpha = 0.5
  for (let k = Math.ceil(kMin / READ_LEN) * READ_LEN; k <= kMax; k += READ_LEN) {
    const x = right - (pos - k) * step
    if (x > S.x) line(x, trTop, x, trBot)
  }
  ctx.setLineDash([])

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5
  let prev: [number, number] | null = null
  for (let k = kMin; k <= kMax; k++) {
    for (let j = 0; j < 4; j++) {
      const s = k + j / 4
      if (s > pos) break
      const x = right - (pos - s) * step
      const y = trBot - (levelAt(k) + (hash(k * 4 + j + 5000) - 0.5) * 0.1) * (trBot - trTop)
      if (prev && x >= S.x) {
        ctx.globalAlpha = Math.min(1, (x - S.x) / (S.w * 0.25))
        line(prev[0], prev[1], x, y)
      }
      prev = [x, y]
    }
  }
  ctx.globalAlpha = 1
  if (prev) { ctx.fillStyle = colors.accent; dot(right, prev[1], 2.6) }

  // ── Espace appris (rotation lente, projection en perspective) ─────────────
  const cx = L.x + L.w / 2
  const cy = L.y + L.h / 2
  // Échelle : le cube projeté s'étend jusqu'à 1,57 R en largeur et 1,78 R en hauteur
  const R  = Math.min(L.w * 0.31, L.h * 0.28)
  const ay = t * 0.16 + 0.5
  const ax = -0.38
  const proj = ([x, y, z]: V3) => {
    const x1 = x * Math.cos(ay) + z * Math.sin(ay)
    const z1 = -x * Math.sin(ay) + z * Math.cos(ay)
    const y2 = y * Math.cos(ax) - z1 * Math.sin(ax)
    const z2 = y * Math.sin(ax) + z1 * Math.cos(ax)
    const s = 4 / (4 + z2)
    return { x: cx + x1 * R * s, y: cy - y2 * R * s, d: Math.min(1, Math.max(0, (1 - z2) / 2)) }
  }

  // Cube de repère
  const c = 0.95
  const corners: V3[] = [[-c, -c, -c], [c, -c, -c], [c, c, -c], [-c, c, -c], [-c, -c, c], [c, -c, c], [c, c, c], [-c, c, c]]
  const pc = corners.map(proj)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.22
  for (const [a, b] of [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]) {
    line(pc[a].x, pc[a].y, pc[b].x, pc[b].y)
  }
  ctx.globalAlpha = 1

  const cloud = CLOUD.map(pt => ({ ...proj(pt.p), color: pt.color })).sort((a, b) => a.d - b.d)
  for (const pt of cloud) {
    ctx.globalAlpha = 0.3 + 0.55 * pt.d
    ctx.fillStyle = pt.color
    dot(pt.x, pt.y, 1.6 + 1.6 * pt.d)
  }
  ctx.globalAlpha = 1

  // ── Encodeur et liaisons ───────────────────────────────────────────────────
  const encW = Math.max(64, fs * 7.4)
  const encH = fs * 2.5
  ctx.setLineDash([3, 4])
  ctx.strokeStyle = colors.border
  ctx.globalAlpha = 0.45
  line(right + 6, trMid, enc.x, enc.y)
  line(enc.x, enc.y, cx, cy)
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // ── Lectures : du pore à l'espace appris ──────────────────────────────────
  const rLast  = Math.floor(pos / READ_LEN) - 1
  const rFirst = Math.max(0, rLast - Math.ceil(((POINT_LIFE + FLIGHT) * BASE_RATE) / READ_LEN) - 1)
  let encActive = false
  const flying: { x: number; y: number }[] = []
  for (let r = rFirst; r <= rLast; r++) {
    const tc = ((r + 1) * READ_LEN) / BASE_RATE
    const age = t - tc - FLIGHT
    const target = readTarget(r)
    const p = proj(target.p)
    if (age < 0) {
      // En vol : jusqu'à l'encodeur, puis vers sa place dans l'espace appris
      const u = (t - tc) / FLIGHT
      if (Math.abs(u - TO_ENCODER) < 0.12) encActive = true
      const [x0, y0, x1, y1, v] = u < TO_ENCODER
        ? [right + 6, trMid, enc.x, enc.y, u / TO_ENCODER]
        : [enc.x, enc.y, p.x, p.y, (u - TO_ENCODER) / (1 - TO_ENCODER)]
      const e = v * v * (3 - 2 * v)
      flying.push({ x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e - Math.sin(Math.PI * v) * 18 })
      continue
    }
    if (age > POINT_LIFE) continue
    const fade = Math.min(1, (POINT_LIFE - age) / 2)
    if (target.novel) {
      ctx.strokeStyle = colors.rust
      ctx.lineWidth = 1.6
      ctx.globalAlpha = fade
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.stroke()
      ctx.setLineDash([3, 3])
      ctx.lineDashOffset = -t * 10
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.7 * fade
      ctx.beginPath(); ctx.arc(p.x, p.y, 12 + Math.sin(t * 3) * 1.5, 0, Math.PI * 2); ctx.stroke()
      ctx.setLineDash([])
      ctx.lineDashOffset = 0
      if (age < 4 && W >= 220) {
        ctx.globalAlpha = Math.min(1, 4 - age) * fade
        ctx.fillStyle = colors.rust
        ctx.font = mono
        ctx.textAlign = p.x > cx ? 'right' : 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText('nouveauté', p.x + (p.x > cx ? -18 : 18), p.y)
      }
    } else {
      ctx.globalAlpha = (0.45 + 0.55 * p.d) * fade
      ctx.fillStyle = target.color
      dot(p.x, p.y, 2.4 + 1.6 * p.d)
      if (age < 1.2) {
        ctx.strokeStyle = target.color
        ctx.lineWidth = 1.2
        ctx.globalAlpha = (1 - age / 1.2) * 0.6
        ctx.beginPath(); ctx.arc(p.x, p.y, 4 + age * 12, 0, Math.PI * 2); ctx.stroke()
      }
    }
  }
  ctx.globalAlpha = 1

  ctx.fillStyle = colors.bgCard
  ctx.strokeStyle = encActive ? colors.accent : colors.border
  ctx.lineWidth = encActive ? 1.5 : 1
  ctx.beginPath()
  ctx.roundRect(enc.x - encW / 2, enc.y - encH / 2, encW, encH, 8)
  ctx.fill()
  ctx.stroke()
  ctx.font = mono
  ctx.fillStyle = encActive ? colors.accent : colors.textMuted
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('encodeur', enc.x, enc.y)

  ctx.fillStyle = colors.textMuted
  for (const f of flying) dot(f.x, f.y, 2.6)

  // ── Légendes ───────────────────────────────────────────────────────────────
  ctx.font = mono
  ctx.fillStyle = colors.textLight
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  // Légende complète si elle tient, sinon version courte
  const caption = (full: string, short: string, x: number, y: number, maxW: number) =>
    ctx.fillText(ctx.measureText(full).width <= maxW ? full : short, x, y)
  caption('capteur · courant du nanopore', 'capteur', S.x + S.w / 2, S.y + S.h + 10, S.w)
  caption('modèle · espace appris', 'modèle', cx, L.y + L.h + 10, L.w)
  if (W >= 300) {
    ctx.textAlign = 'right'
    ctx.fillText('schéma de principe', W - Math.max(16, W * 0.04), 20)
  }
}

export default function AustralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let t = reduce ? STATIC_T : START_T
    let raf = 0
    let last = 0

    const render = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (W && H) draw(ctx, W, H, t)
    }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render()
    }
    const frame = (ts: number) => {
      if (last) t += Math.min(0.05, (ts - last) / 1000)
      last = ts
      render()
      raf = requestAnimationFrame(frame)
    }
    const start = () => { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(frame) } }
    const stop  = () => { cancelAnimationFrame(raf); raf = 0 }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    // Pas d'animation hors de l'écran
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(canvas)

    return () => { stop(); ro.disconnect(); io.disconnect() }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Schéma animé : un brin d'ADN traverse un nanopore, le courant mesuré passe par l'encodeur et devient un point de l'espace appris ; une séquence sans parenté connue est signalée comme nouveauté."
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
