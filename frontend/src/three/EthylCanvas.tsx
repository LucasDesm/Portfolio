export default function EthylCanvas() {
  return (
    <iframe
      src="/3d/ethylometre-embed.html"
      title="Éthylomètre 3D"
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
