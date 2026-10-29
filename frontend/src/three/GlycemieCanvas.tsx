import { useEffect, useRef } from 'react'

// ── Palette médicale / CGM ────────────────────────────────────────────────────
const C = {
  bg:     '#040811',
  panel:  '#070e1b',
  border: '#162233',
  green:  '#22c55e',   // in range
  yellow: '#f59e0b',   // hyperglycémie
  red:    '#ef4444',   // hypoglycémie
  blue:   '#60a5fa',   // insuline / info
  cyan:   '#22d3ee',   // courbe
  white:  '#dceef8',
  muted:  '#3d5570',
  dim:    '#0f1f32',
} as const

// ── Profil glycémique réaliste (repas + correction PID) ───────────────────────
function glucose(t: number): number {
  const w = ((t % 1) + 1) % 1
  if (w < 0.13)      return 108 + Math.sin(w * 53) * 2.5
  if (w < 0.22)      { const u = (w - 0.13) / 0.09; return 108 + 12 * u }
  if (w < 0.41)      { const u = (w - 0.22) / 0.19; return 120 + 106 * Math.pow(u, 0.62) }
  if (w < 0.76)      { const u = (w - 0.41) / 0.35; return 120 + 106 * Math.exp(-4.0 * u) + Math.sin(w * 38) * 3.5 * (1 - Math.min(1, u * 1.5)) }
  if (w < 0.90)      return 118 + Math.sin(w * 28) * 2.5
  const u = (w - 0.90) / 0.10; return 118 - 10 * u
}

// Glucose → coordonnée Y dans le graphe
function gy(g: number, top: number, h: number): number {
  return top + h * (1 - (g - 40) / 260)
}

const CYCLE  = 13000   // ms par cycle complet
const WINDOW = 0.37    // fraction du cycle visible dans le graphe

export default function GlycemieCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const canvas = el
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx = context

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let animId: number
    let t0: number | null = null

    function draw(ts: number) {
      if (!t0) t0 = ts
      const t = ((ts - t0) % CYCLE) / CYCLE
      const W = canvas.width, H = canvas.height
      if (W === 0 || H === 0) { animId = requestAnimationFrame(draw); return }

      // ── Layout ─────────────────────────────────────────────────────────────
      const HDR = Math.max(36, Math.round(H * 0.10))
      const FTR = Math.max(26, Math.round(H * 0.08))
      const LFT = Math.max(130, Math.min(Math.round(W * 0.27), 190))
      const PAD = 8
      const cX = LFT + PAD, cY = HDR + PAD
      const cW = W - cX - PAD, cH = H - HDR - FTR - PAD * 2
      const cR = cX + cW, cB = cY + cH

      // ── État ───────────────────────────────────────────────────────────────
      const gNow   = glucose(t)
      const gPrev  = glucose(Math.max(0, t - 0.015))
      const delta  = gNow - gPrev
      const isMeal = t > 0.20 && t < 0.44
      const isPID  = t > 0.38 && t < 0.77
      const gColor = gNow > 140 ? C.yellow : gNow < 70 ? C.red : C.green
      const arrow  = delta > 4 ? '↑↑' : delta > 1.5 ? '↗' : delta < -4 ? '↓↓' : delta < -1.5 ? '↘' : '→'
      const status = gNow > 140 ? 'HYPER' : gNow < 70 ? 'HYPO' : 'IN RANGE'

      // ── Fond ───────────────────────────────────────────────────────────────
      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, W, H)

      // ── Header ─────────────────────────────────────────────────────────────
      ctx.fillStyle = C.panel
      ctx.fillRect(0, 0, W, HDR)
      ctx.strokeStyle = C.border; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, HDR); ctx.lineTo(W, HDR); ctx.stroke()

      const hFS = Math.max(9, Math.round(HDR * 0.33))
      ctx.textBaseline = 'middle'

      if (Math.sin(ts * 0.005) > 0) {
        ctx.fillStyle = C.green
        ctx.beginPath(); ctx.arc(14, HDR / 2, hFS * 0.38, 0, Math.PI * 2); ctx.fill()
      }
      ctx.font = `bold ${hFS}px "Courier New",monospace`
      ctx.fillStyle = C.green; ctx.textAlign = 'left'
      ctx.fillText('  CLOSED LOOP ACTIVE', 12, HDR / 2)

      ctx.font = `${hFS - 1}px "Courier New",monospace`
      ctx.fillStyle = C.muted; ctx.textAlign = 'center'
      ctx.fillText('PID · ZIEGLER-NICHOLS', W / 2, HDR / 2)

      ctx.textAlign = 'right'
      ctx.fillText('UVA/PADOVA · FDA VALIDATED', W - 12, HDR / 2)
      ctx.textAlign = 'left'

      // ── Séparateur panneau gauche ──────────────────────────────────────────
      ctx.strokeStyle = C.border; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(LFT, HDR); ctx.lineTo(LFT, H - FTR); ctx.stroke()

      // ── Grand affichage glycémie ────────────────────────────────────────────
      const bigFS = Math.max(26, Math.round(H * 0.11))
      const readY = HDR + bigFS + H * 0.022
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'

      ctx.font = `bold ${bigFS}px "Courier New",monospace`
      ctx.fillStyle = gColor
      ctx.shadowColor = gColor; ctx.shadowBlur = 18
      ctx.fillText(String(Math.round(gNow)), LFT / 2, readY)
      ctx.shadowBlur = 0

      ctx.font = `${Math.max(8, Math.round(bigFS * 0.30))}px "Courier New",monospace`
      ctx.fillStyle = C.muted
      ctx.fillText('mg/dL', LFT / 2, readY + bigFS * 0.46)

      ctx.font = `${Math.max(16, Math.round(bigFS * 0.52))}px sans-serif`
      ctx.fillStyle = gColor
      ctx.fillText(arrow, LFT / 2, readY + bigFS * 1.08)

      const sbFS = Math.max(8, Math.round(H * 0.022))
      ctx.font = `bold ${sbFS}px "Courier New",monospace`
      ctx.fillStyle = gColor
      ctx.fillText(status, LFT / 2, readY + bigFS * 1.64)

      // ── Bloc info gauche ───────────────────────────────────────────────────
      const div1Y = HDR + H * 0.38
      ctx.strokeStyle = C.dim; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(10, div1Y); ctx.lineTo(LFT - 10, div1Y); ctx.stroke()

      const iFS = Math.max(8, Math.round(H * 0.020))
      let iY = div1Y + H * 0.046
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'

      const info = (label: string, val: string) => {
        ctx.font = `${iFS}px "Courier New",monospace`
        ctx.fillStyle = C.muted; ctx.fillText(label, 10, iY); iY += iFS * 1.5
        ctx.font = `bold ${iFS + 1}px "Courier New",monospace`
        ctx.fillStyle = C.white; ctx.fillText(val, 10, iY); iY += iFS * 2.4
      }

      info('PATIENT', '07 / 11')
      info('SIMULATIONS', '222 scénarios')

      const div2Y = iY - iFS * 0.5
      ctx.strokeStyle = C.dim
      ctx.beginPath(); ctx.moveTo(10, div2Y); ctx.lineTo(LFT - 10, div2Y); ctx.stroke()
      iY = div2Y + H * 0.04

      ctx.font = `bold ${iFS}px "Courier New",monospace`
      if (isMeal && !isPID) {
        const blk = Math.sin(ts * 0.008) > 0
        ctx.fillStyle = blk ? C.yellow : 'rgba(245,158,11,0.32)'
        ctx.fillText('⚠ MEAL EVENT', 10, iY); iY += iFS * 2
        ctx.font = `${iFS}px "Courier New",monospace`
        ctx.fillStyle = C.muted; ctx.fillText('Glycémie ↑ ↑', 10, iY)
      } else if (isPID) {
        ctx.fillStyle = C.blue
        ctx.fillText('◎ PID ACTIF', 10, iY); iY += iFS * 2
        ctx.font = `${iFS}px "Courier New",monospace`
        ctx.fillStyle = C.muted; ctx.fillText('Insuline ↑', 10, iY)
      } else {
        ctx.fillStyle = C.green
        ctx.fillText('✓ STABLE', 10, iY); iY += iFS * 2
        ctx.font = `${iFS}px "Courier New",monospace`
        ctx.fillStyle = C.muted; ctx.fillText('Cible atteinte', 10, iY)
      }

      iY += iFS * 2.8
      ctx.font = `${iFS}px "Courier New",monospace`
      ctx.fillStyle = C.muted; ctx.fillText('CAPTEURS BLE', 10, iY)
      iY += iFS * 1.6
      ctx.fillStyle = C.blue; ctx.fillText('● GSR · Cardio', 10, iY)

      // ── Étiquettes axe Y ───────────────────────────────────────────────────
      const gridGs = [50, 70, 100, 140, 180, 240, 300]
      const lFS = Math.max(7, Math.round(H * 0.018))
      ctx.font = `${lFS}px "Courier New",monospace`
      ctx.textBaseline = 'middle'; ctx.textAlign = 'right'
      gridGs.forEach(g => {
        const y = gy(g, cY, cH)
        const isTgt = g === 70 || g === 140
        ctx.fillStyle = isTgt ? 'rgba(34,197,94,0.7)' : 'rgba(61,85,112,0.6)'
        ctx.fillText(String(g), cX - 5, y)
      })

      // ── Fond graphe ────────────────────────────────────────────────────────
      ctx.fillStyle = C.panel
      ctx.fillRect(cX, cY, cW, cH)

      // ── Zone clippée ───────────────────────────────────────────────────────
      ctx.save()
      ctx.beginPath(); ctx.rect(cX, cY, cW, cH); ctx.clip()

      // Bande cible 70–140
      const yTop140 = gy(140, cY, cH)
      const yBot70  = gy(70, cY, cH)
      ctx.fillStyle = 'rgba(34,197,94,0.055)'
      ctx.fillRect(cX, yTop140, cW, yBot70 - yTop140)

      // Grille horizontale
      gridGs.forEach(g => {
        const y = gy(g, cY, cH)
        const isTgt = g === 70 || g === 140
        ctx.strokeStyle = isTgt ? 'rgba(34,197,94,0.28)' : 'rgba(15,31,50,0.9)'
        ctx.lineWidth = isTgt ? 1 : 0.5
        ctx.setLineDash(isTgt ? [4, 4] : [])
        ctx.beginPath(); ctx.moveTo(cX, y); ctx.lineTo(cR, y); ctx.stroke()
        ctx.setLineDash([])
      })

      // Labels HYPER / HYPO
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
      ctx.font = `bold ${lFS}px "Courier New",monospace`
      ctx.fillStyle = 'rgba(245,158,11,0.36)'
      ctx.fillText('HYPER', cX + 5, yTop140 - 3)
      ctx.fillStyle = 'rgba(239,68,68,0.36)'
      ctx.fillText('HYPO', cX + 5, cB - 3)

      // ── Courbe glycémique ──────────────────────────────────────────────────
      const tStart = Math.max(0, t - WINDOW)
      const tRange = t - tStart
      const STEPS  = 200

      // Remplissage sous la courbe
      ctx.beginPath()
      let first = true
      for (let i = 0; i <= STEPS; i++) {
        const ti = tStart + (i / STEPS) * tRange
        const g = glucose(ti)
        const x = cX + ((ti - tStart) / WINDOW) * cW
        const y = gy(g, cY, cH)
        if (first) { ctx.moveTo(x, cB); ctx.lineTo(x, y); first = false }
        else ctx.lineTo(x, y)
      }
      ctx.lineTo(cX + (tRange / WINDOW) * cW, cB)
      ctx.closePath()
      ctx.fillStyle = 'rgba(34,211,238,0.05)'; ctx.fill()

      // Ligne de la courbe
      ctx.beginPath()
      first = true
      for (let i = 0; i <= STEPS; i++) {
        const ti = tStart + (i / STEPS) * tRange
        const g = glucose(ti)
        const x = cX + ((ti - tStart) / WINDOW) * cW
        const y = gy(g, cY, cH)
        if (first) { ctx.moveTo(x, y); first = false }
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = C.cyan; ctx.lineWidth = 2
      ctx.shadowColor = C.cyan; ctx.shadowBlur = 6
      ctx.stroke(); ctx.shadowBlur = 0

      // Point "NOW"
      const nowX = cX + (tRange / WINDOW) * cW
      const nowY = gy(gNow, cY, cH)
      ctx.fillStyle = gColor
      ctx.shadowColor = gColor; ctx.shadowBlur = 14
      ctx.beginPath(); ctx.arc(nowX, nowY, 5, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0

      // Marqueurs bolus insuline
      if (isPID) {
        const pStep = 0.048
        for (let p = 0.40; p < 0.77; p += pStep) {
          const px = cX + ((p - tStart) / WINDOW) * cW
          if (px < cX || px > cR) continue
          ctx.strokeStyle = 'rgba(96,165,250,0.5)'; ctx.lineWidth = 1
          ctx.setLineDash([2, 3])
          ctx.beginPath(); ctx.moveTo(px, cB - 14); ctx.lineTo(px, cB); ctx.stroke()
          ctx.setLineDash([])
          ctx.fillStyle = C.blue
          ctx.beginPath(); ctx.moveTo(px - 3, cB); ctx.lineTo(px + 3, cB); ctx.lineTo(px, cB - 7)
          ctx.closePath(); ctx.fill()
        }
        ctx.textAlign = 'left'
        ctx.font = `${lFS}px "Courier New",monospace`
        ctx.fillStyle = 'rgba(96,165,250,0.46)'
        ctx.fillText('▼ bolus insuline', cX + 5, cB - 17)
      }

      // Fondu bord gauche
      const fade = ctx.createLinearGradient(cX, 0, cX + cW * 0.05, 0)
      fade.addColorStop(0, C.panel); fade.addColorStop(1, 'transparent')
      ctx.fillStyle = fade
      ctx.fillRect(cX, cY, cW * 0.05, cH)

      ctx.restore()

      // Bordure graphe
      ctx.strokeStyle = C.border; ctx.lineWidth = 1
      ctx.strokeRect(cX, cY, cW, cH)

      // ── Axe temps ──────────────────────────────────────────────────────────
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'
      ctx.font = `${lFS}px "Courier New",monospace`; ctx.fillStyle = C.muted
      ;[{ f: 0, l: '-45m' }, { f: 1/3, l: '-30m' }, { f: 2/3, l: '-15m' }, { f: 1, l: 'NOW' }]
        .forEach(({ f, l }) => ctx.fillText(l, cX + f * cW, cB + 4))

      // ── Footer ─────────────────────────────────────────────────────────────
      ctx.fillStyle = C.panel; ctx.fillRect(0, H - FTR, W, FTR)
      ctx.strokeStyle = C.border; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H - FTR); ctx.lineTo(W, H - FTR); ctx.stroke()

      const ftFS = Math.max(8, Math.round(FTR * 0.30))
      ctx.font = `${ftFS}px "Courier New",monospace`
      ctx.textBaseline = 'middle'; ctx.fillStyle = C.muted
      ctx.textAlign = 'left'
      ctx.fillText('RÉGULATEUR GLYCÉMIE · IUT BORDEAUX', 14, H - FTR / 2)
      ctx.textAlign = 'right'
      const simMin = Math.floor(t * 120)
      ctx.fillText(
        `SIM ${String(Math.floor(simMin / 60)).padStart(2, '0')}:${String(simMin % 60).padStart(2, '0')}`,
        W - 14, H - FTR / 2,
      )

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
