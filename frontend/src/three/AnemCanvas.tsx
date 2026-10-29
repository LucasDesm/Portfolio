export default function AnemCanvas() {
  return (
    <iframe
      src="/3d/anemometre-embed.html"
      title="Anémomètre connecté 3D"
      allowTransparency
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
