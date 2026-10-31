import Embed3D from '@/components/Embed3D'

// Main robotique seule (iframe), pour l'accueil et la page Projets.
// Module séparé de HandCanvas : on évite de charger React Three Fiber (~1 Mo) pour une simple iframe.
export default function HandEmbed() {
  return <Embed3D src="/3d/hand-embed.html" title="Main robotique EMG 3D" />
}
