import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})
import Header from '@/components/Header'
import XRayEasterEgg from '@/components/XRayEasterEgg'
import PageLoader from '@/components/PageLoader'
import { colors, ca } from '@/lib/tokens'

const Home          = lazy(() => import('@/sections/Home'))
const Parcours      = lazy(() => import('@/sections/Parcours'))
const Projets       = lazy(() => import('@/sections/Projets'))
const ProjetDetail  = lazy(() => import('@/sections/ProjetDetail'))
const StageDetail   = lazy(() => import('@/sections/StageDetail'))
const Competences   = lazy(() => import('@/sections/Competences'))
const Contact       = lazy(() => import('@/sections/Contact'))
const NotFound      = lazy(() => import('@/sections/NotFound'))

// Blobs statiques — filter: blur() sur élément animé force une re-rasterisation GPU à chaque frame
function AmbientBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${ca.glow(0.22)} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        opacity: 0.45,
      }} />
      <div style={{
        position: 'absolute', top: '-18%', left: '-10%',
        width: '62vw', height: '62vw',
        background: `radial-gradient(circle, ${ca.glow(0.13)} 0%, transparent 62%)`,
        filter: 'blur(70px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '2%', right: '-12%',
        width: '55vw', height: '55vw',
        background: `radial-gradient(circle, ${ca.glow(0.11)} 0%, transparent 62%)`,
        filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute', top: '38%', left: '18%',
        width: '45vw', height: '45vw',
        background: `radial-gradient(circle, ${ca.glow(0.08)} 0%, transparent 65%)`,
        filter: 'blur(90px)',
      }} />
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"              element={<Home />} />
          <Route path="/parcours"      element={<Parcours />} />
          <Route path="/projets"       element={<Projets />} />
          <Route path="/projets/:slug" element={<ProjetDetail />} />
          {/* Les stages sont présentés dans le Parcours ; les pages de détail restent */}
          <Route path="/stages"        element={<Navigate to="/parcours" replace />} />
          <Route path="/stages/:slug"  element={<StageDetail />} />
          <Route path="/competences"   element={<Competences />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <div style={{ minHeight: '100svh', background: colors.bg, position: 'relative' }}>
        <AmbientBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ScrollToTop />
          <Header />
          <AnimatedRoutes />
        </div>
        <XRayEasterEgg />
      </div>
      <Analytics />
    </BrowserRouter>
    </MotionConfig>
    </QueryClientProvider>
  )
}
