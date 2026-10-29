import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Bounds } from '@react-three/drei'
import { useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'

// ─── Material ─────────────────────────────────────────────────────────────────

const HAND_MAT = new THREE.MeshPhysicalMaterial({
  color: 0x2a6db5,
  roughness: 0.35,
  metalness: 0.08,
  clearcoat: 0.4,
  clearcoatRoughness: 0.3,
})

function applyMat(scene: THREE.Object3D) {
  scene.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = HAND_MAT
      child.castShadow = true
    }
  })
}

// ─── Animated hand (hand-animated.glb with separate finger nodes) ─────────────
//
// Expects nodes named: palm, finger_thumb, finger_index, finger_middle,
//                      finger_ring, finger_pinky
//
// If fingers curl on a different axis in your export, change CURL_AXIS.
// If the curl is inverted, negate MAX_CURL.

const CURL_AXIS:  'x' | 'y' | 'z' = 'x'
const THUMB_AXIS: 'x' | 'y' | 'z' = 'y'
const MAX_CURL   = Math.PI / 2.5

// [axe, signe] par doigt — changer le signe en -1 si un doigt part dans le mauvais sens
const FINGER_AXES: Array<['x' | 'y' | 'z', number]> = [
  [THUMB_AXIS,  1],   // Pouce
  [CURL_AXIS,   1],   // Index  ← -1 si le sens est inversé, sinon repasser à 1
  [CURL_AXIS,   1],   // Majeur
  [CURL_AXIS,   1],   // Annulaire
  [CURL_AXIS,   1],   // Auriculaire
]
const MAX_CURLS = [-Math.PI / 3, MAX_CURL, MAX_CURL, MAX_CURL, MAX_CURL]

function HandModelAnimated() {
  const { scene, nodes } = useGLTF('/models/hand_blender.glb')
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => applyMat(scene), [scene])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.3

    // Sync avec l'état EMG (même STATE_DUR que EMGMonitor)
    const t   = state.clock.elapsedTime
    const si  = Math.floor(t / STATE_DUR) % GRIP_STATES.length
    const ni  = (si + 1) % GRIP_STATES.length
    const bld = Math.max(0, ((t % STATE_DUR) / STATE_DUR - 0.85) / 0.15)
    const cur = GRIP_STATES[si], nxt = GRIP_STATES[ni]

    // fingers[] : [Pouce, Index, Majeur, Annulaire, Auriculaire]
    const targets = cur.fingers.map((f, i) => f + (nxt.fingers[i] - f) * bld)

    const fingerNodes = [
      nodes.pouce,
      nodes.index,
      nodes.majeur,
      nodes.annualaire,
      nodes.orriculaire,
    ]
    const SPEED = 2  // rad/s — vitesse angulaire constante (servo)
    fingerNodes.forEach((node, i) => {
      if (!node) return
      const [axis, sign] = FINGER_AXES[i]
      const target  = targets[i] * MAX_CURLS[i] * sign
      const current = node.rotation[axis]
      const diff    = target - current
      const step    = SPEED * delta
      node.rotation[axis] = Math.abs(diff) <= step ? target : current + Math.sign(diff) * step
    })
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

// ─── EMG constants ────────────────────────────────────────────────────────────

const CHANNELS = [
  { label: 'CH1 · Flex. digit. superf.', short: 'CH1', color: '#3b82f6' },
  { label: 'CH2 · Ext. digitorum',       short: 'CH2',  color: '#10b981' },
  { label: 'CH3 · Flex. pollicis long.', short: 'CH3', color: '#06b6d4' },
  { label: 'CH4 · Abd. pollicis brev.',  short: 'CH4', color: '#f59e0b' },
]

// [FDS, ED, FPL, APB] activations + finger activations [P, I, M, An, Au]
const GRIP_STATES = [
  { name: 'OPEN',    act: [0.05, 0.05, 0.05, 0.05], fingers: [0,   0,   0,   0,   0  ] },
  { name: 'CLOSE',   act: [0.90, 0.12, 0.55, 0.18], fingers: [1,   1,   1,   1,   1  ] },
  { name: 'PINCH',   act: [0.48, 0.08, 0.92, 0.88], fingers: [1,   1,   0.5, 0,   0  ] },
  { name: 'LATERAL', act: [0.70, 0.42, 0.28, 0.28], fingers: [1,   1,   0.3, 0,   0  ] },
  { name: 'EXTEND',  act: [0.08, 0.88, 0.08, 0.06], fingers: [0.1, 0.1, 0.1, 0.1, 0.1] },
]

const FINGER_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#06b6d4', '#3b82f6']
const STATE_DUR = 3.5
const HIST      = 80    // ~1.3s à 60fps → réactivité immédiate au changement d'état

function emgSignal(t: number, amp: number, ci: number): number {
  // Même structure de fréquences pour tous les canaux — seule l'amplitude varie
  // Un léger déphasage (ci * 1.1) évite que les canaux soient identiques visuellement
  const ph = ci * 1.1
  const s  = Math.sin(t * 72  * 2 * Math.PI + ph)        * 0.42
           + Math.sin(t * 108 * 2 * Math.PI + ph + 0.9)  * 0.33
           + Math.sin(t * 157 * 2 * Math.PI + ph + 1.8)  * 0.25
  return Math.max(0, amp * Math.abs(s))
}

// ─── EMG Monitor Canvas 2D ────────────────────────────────────────────────────

function EMGMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const histories: number[][] = CHANNELS.map(() => new Array(HIST).fill(0))
    let animId: number
    let t0: number | null = null

    function draw(ts: number) {
      if (!canvas) return
      if (!t0) t0 = ts
      const t = (ts - t0) / 1000
      const W = canvas.width, H = canvas.height
      if (W === 0 || H === 0) { animId = requestAnimationFrame(draw); return }

      // ── État de préhension ───────────────────────────────────────────────────
      const si  = Math.floor(t / STATE_DUR) % GRIP_STATES.length
      const ni  = (si + 1) % GRIP_STATES.length
      const p   = (t % STATE_DUR) / STATE_DUR
      const bld = Math.max(0, (p - 0.85) / 0.15)
      const cur = GRIP_STATES[si], nxt = GRIP_STATES[ni]
      const acts    = cur.act.map((a, i) => a + (nxt.act[i] - a) * bld)
      const fingers = cur.fingers.map((f, i) => f + (nxt.fingers[i] - f) * bld)

      CHANNELS.forEach((_, ci) => {
        histories[ci].push(emgSignal(t, acts[ci], ci))
        if (histories[ci].length > HIST) histories[ci].shift()
      })

      // ── Layout ───────────────────────────────────────────────────────────────
      const HDR = Math.max(34, Math.round(H * 0.09))
      const FTR = Math.max(24, Math.round(H * 0.07))
      const LFT = Math.max(130, Math.min(Math.round(W * 0.40), 185))
      const PAD = 8

      // ── Fond ─────────────────────────────────────────────────────────────────
      ctx.fillStyle = '#040811'
      ctx.fillRect(0, 0, W, H)

      // ── Header ───────────────────────────────────────────────────────────────
      ctx.fillStyle = '#070e1b'
      ctx.fillRect(0, 0, W, HDR)
      ctx.strokeStyle = '#162233'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, HDR); ctx.lineTo(W, HDR); ctx.stroke()

      const hFS = Math.max(8, Math.round(HDR * 0.30))
      ctx.textBaseline = 'middle'
      ctx.font = `bold ${hFS}px "Courier New",monospace`
      ctx.fillStyle = '#3b82f6'; ctx.textAlign = 'left'
      ctx.fillText('Commande myoélectrique', 14, HDR / 2)
      ctx.font = `${hFS}px "Courier New",monospace`
      ctx.fillStyle = '#3d5570'; ctx.textAlign = 'right'
      ctx.fillText('simulation illustrative · EMG', W - 12, HDR / 2)

      // ── Séparateur panneau gauche ─────────────────────────────────────────────
      ctx.strokeStyle = '#162233'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(LFT, HDR); ctx.lineTo(LFT, H - FTR); ctx.stroke()

      // ── PANNEAU GAUCHE : état + barres doigts ────────────────────────────────

      // Label "PRÉHENSION"
      const lFS = Math.max(7, Math.round(H * 0.018))
      ctx.font = `${lFS}px "Courier New",monospace`
      ctx.fillStyle = '#3d5570'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
      ctx.fillText('PRÉHENSION', LFT / 2, HDR + H * 0.065)

      // Grand texte état
      const bigFS = Math.max(18, Math.round(H * 0.075))
      ctx.font = `bold ${bigFS}px "Courier New",monospace`
      ctx.fillStyle = '#3b82f6'
      ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 16
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
      ctx.fillText(cur.name, LFT / 2, HDR + H * 0.20)
      ctx.shadowBlur = 0

      // Divider fin
      const div1Y = HDR + H * 0.26
      ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(10, div1Y); ctx.lineTo(LFT - 10, div1Y); ctx.stroke()

      // Barres horizontales doigts
      const FINGER_NAMES_FR = ['Pouce', 'Index', 'Majeur', 'Annul.', 'Auric.']
      const barAreaTop = div1Y + H * 0.03
      const barAreaBot = H - FTR - H * 0.02
      const slotH      = (barAreaBot - barAreaTop) / 5
      const nameW      = 36
      const pctW       = 26
      const barX       = nameW + 10
      const barMaxW    = LFT - barX - pctW - 6

      fingers.forEach((act, fi) => {
        const midY  = barAreaTop + fi * slotH + slotH / 2
        const barH  = Math.max(4, slotH * 0.28)
        const color = act > 0.05 ? FINGER_COLORS[fi] : '#1e2d3d'

        // Nom
        ctx.font = `${lFS}px "Courier New",monospace`
        ctx.fillStyle = act > 0.05 ? FINGER_COLORS[fi] : '#3d5570'
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
        ctx.fillText(FINGER_NAMES_FR[fi], 8, midY)

        // Track
        ctx.fillStyle = '#0d1a2e'
        ctx.fillRect(barX, midY - barH / 2, barMaxW, barH)

        // Barre active
        if (act > 0.01) {
          const grad = ctx.createLinearGradient(barX, 0, barX + barMaxW, 0)
          grad.addColorStop(0, color)
          grad.addColorStop(1, `${color}55`)
          ctx.fillStyle = grad
          ctx.fillRect(barX, midY - barH / 2, barMaxW * act, barH)
        }

        // Pourcentage
        ctx.font = `bold ${lFS}px "Courier New",monospace`
        ctx.fillStyle = act > 0.05 ? FINGER_COLORS[fi] : '#3d5570'
        ctx.textAlign = 'right'
        ctx.fillText(`${Math.round(act * 100)}%`, LFT - 4, midY)
      })

      // ── PANNEAU DROIT : 4 canaux EMG ─────────────────────────────────────────
      const cX  = LFT + PAD
      const cY  = HDR + PAD
      const cW  = W - cX - PAD
      const cH  = H - HDR - FTR - PAD * 2
      const chH = cH / CHANNELS.length

      CHANNELS.forEach((ch, ci) => {
        const rowY   = cY + ci * chH
        const lblH   = Math.max(14, Math.round(chH * 0.22))
        const chartY = rowY + lblH
        const chartH = chH - lblH - 3

        if (ci > 0) {
          ctx.strokeStyle = '#0f1f32'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(cX, rowY); ctx.lineTo(cX + cW, rowY); ctx.stroke()
        }

        // Label canal (court)
        const chFS = Math.max(8, Math.round(chH * 0.15))
        ctx.font = `${chFS}px "Courier New",monospace`
        ctx.fillStyle = ch.color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
        ctx.fillText(ch.short, cX + 2, rowY + lblH / 2)

        // Fond du graphe
        ctx.fillStyle = '#060d1a'
        ctx.fillRect(cX, chartY, cW, chartH)

        // Grille légère
        ctx.strokeStyle = '#ffffff06'; ctx.lineWidth = 0.5
        for (let g = 1; g < 4; g++) {
          const gy = chartY + (g / 4) * chartH
          ctx.beginPath(); ctx.moveTo(cX, gy); ctx.lineTo(cX + cW, gy); ctx.stroke()
        }

        // Remplissage sous la courbe
        const hist = histories[ci]
        ctx.beginPath()
        ctx.moveTo(cX, chartY + chartH)
        for (let x = 0; x < hist.length; x++) {
          ctx.lineTo(cX + (x / HIST) * cW, chartY + chartH - hist[x] * chartH * 0.88)
        }
        ctx.lineTo(cX + cW, chartY + chartH)
        ctx.closePath()
        ctx.fillStyle = `${ch.color}16`; ctx.fill()

        // Courbe
        ctx.beginPath()
        for (let x = 0; x < hist.length; x++) {
          const px = cX + (x / HIST) * cW
          const py = chartY + chartH - hist[x] * chartH * 0.88
          if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = ch.color; ctx.lineWidth = 1.2
        ctx.shadowColor = ch.color; ctx.shadowBlur = 3
        ctx.stroke(); ctx.shadowBlur = 0

        // Fondu bord gauche (passé) → droite = maintenant
        const fade = ctx.createLinearGradient(cX, 0, cX + cW * 0.18, 0)
        fade.addColorStop(0, '#060d1a')
        fade.addColorStop(1, 'transparent')
        ctx.fillStyle = fade
        ctx.fillRect(cX, chartY, cW * 0.18, chartH)

        // Curseur NOW (bord droit)
        const nowX = cX + cW - 1
        ctx.strokeStyle = `${ch.color}80`; ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath(); ctx.moveTo(nowX, chartY); ctx.lineTo(nowX, chartY + chartH); ctx.stroke()
        ctx.setLineDash([])
      })

      // ── Footer ───────────────────────────────────────────────────────────────
      ctx.fillStyle = '#070e1b'
      ctx.fillRect(0, H - FTR, W, FTR)
      ctx.strokeStyle = '#162233'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H - FTR); ctx.lineTo(W, H - FTR); ctx.stroke()

      const fFS = Math.max(7, Math.round(FTR * 0.30))
      ctx.font = `${fFS}px "Courier New",monospace`
      ctx.fillStyle = '#3d5570'; ctx.textBaseline = 'middle'
      ctx.textAlign = 'left'
      ctx.fillText('IUT de Bordeaux · BUT Mesures Physiques', 12, H - FTR / 2)
      ctx.textAlign = 'right'
      const simSec = Math.floor(t)
      ctx.fillText(
        `${String(Math.floor(simSec / 60)).padStart(2, '0')}:${String(simSec % 60).padStart(2, '0')}`,
        W - 12, H - FTR / 2,
      )

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

// ─── Main export (main + EMG monitor) ────────────────────────────────────────

export default function HandCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      <div style={{ flex: '0 0 50%', position: 'relative' }}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 3]} intensity={2.0} />
          <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#c8d8f0" />
          <directionalLight position={[0, -3, 2]} intensity={0.25} color="#f0ece8" />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <HandModelAnimated />
            </Bounds>
          </Suspense>
        </Canvas>
      </div>

      <div style={{ width: 1, background: '#3b82f620', flexShrink: 0 }} />

      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <EMGMonitor />
      </div>
    </div>
  )
}

// ─── Hand only (sans tableau EMG) ────────────────────────────────────────────

export function HandCanvasOnly() {
  return (
    <iframe
      src="/3d/hand-embed.html"
      title="Main robotique EMG 3D"
      allowTransparency
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        border: 'none', background: 'transparent',
        pointerEvents: 'none',
      }}
    />
  )
}

// Pas de préchargement : le module est importé par l'accueil, qui n'affiche que l'iframe
// de la main. Le modèle est chargé à la demande, sur la page du projet.
