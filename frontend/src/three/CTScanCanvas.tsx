export default function CTScanCanvas() {
  return (
    <iframe
      src="/3d/ctscan-embed.html"
      title="CT-Scan Deep Learning 3D"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'none',
      }}
    />
  )
}
