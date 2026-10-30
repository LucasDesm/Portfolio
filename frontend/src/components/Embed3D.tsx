import { useEffect, useRef } from 'react'

// Rendu 3D en iframe (public/3d/*.html). Chargé à l'approche de l'écran, mis en pause hors
// de l'écran : la page envoie « pause » / « resume » au script de pause placé en tête de l'iframe.
export default function Embed3D({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visible = true
    const send = () => el.contentWindow?.postMessage(visible ? 'resume' : 'pause', window.location.origin)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; send() })
    io.observe(el)
    el.addEventListener('load', send)   // l'état est renvoyé une fois l'iframe chargée
    return () => { io.disconnect(); el.removeEventListener('load', send) }
  }, [])

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      loading="lazy"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    />
  )
}
