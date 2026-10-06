import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Seo from './components/Seo.jsx';
import { ROUTES, LEGACY_REDIRECTS } from './routes';
import './styles/route-loading.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const Car = lazy(() => import('./pages/Car.jsx'));
const Academy = lazy(() => import('./pages/Academy.jsx'));
const FormulaStudent = lazy(() => import('./pages/FormulaStudent.jsx'));
const JoinUs = lazy(() => import('./pages/JoinUs.jsx'));
const Sponsors = lazy(() => import('./pages/Sponsors.jsx'));
const News = lazy(() => import('./pages/News.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const PolicyPage = lazy(() => import('./pages/PolicyPage.jsx'));

// Al navegar entre páginas el scroll se queda donde estaba: con React Router
// no hay recarga que lo resetee.
//
// Si la URL trae un #ancla hay que saltar a mano. El navegador no lo hace solo:
// en una navegación de React Router la URL cambia antes de que monte la página
// nueva, así que cuando el navegador busca el elemento del ancla todavía no
// existe. Es el caso de los links de áreas del Home hacia /el-equipo#<área>.
//
// scrollIntoView() sin `behavior` usa el scroll-behavior del CSS, que ya está
// anulado bajo prefers-reduced-motion. Por eso no se pasa 'smooth' explícito:
// forzarlo se saltearía esa preferencia.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Lazy route chunks and i18n updates can mount the target after this effect.
    let attempts = 0;
    let frame;
    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
      if (attempts++ < 20) frame = window.requestAnimationFrame(scrollToTarget);
      else window.scrollTo(0, 0);
    };
    frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useEffect(() => {
    // Discourage casual image copying without blocking text or normal navigation.
    const protectImage = (event) => {
      if (event.target instanceof Element && event.target.closest('img, picture')) {
        event.preventDefault();
      }
    };
    document.addEventListener('contextmenu', protectImage);
    document.addEventListener('dragstart', protectImage);
    return () => {
      document.removeEventListener('contextmenu', protectImage);
      document.removeEventListener('dragstart', protectImage);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Seo />
      <Header />
      <main className="main">
        <Suspense fallback={<div className="route-loading" role="status" aria-label="Cargando página" />}>
          <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.news} element={<News />} />
          <Route path={ROUTES.team} element={<Team />} />
          <Route path={ROUTES.car} element={<Car />} />
          <Route path={ROUTES.academy} element={<Academy />} />
          <Route path={ROUTES.aboutFormulaStudent} element={<FormulaStudent />} />
          <Route path={ROUTES.joinUs} element={<JoinUs />} />
          <Route path={ROUTES.sponsors} element={<Sponsors />} />
          <Route path={ROUTES.legal} element={<PolicyPage type="legal" />} />
          <Route path={ROUTES.privacy} element={<PolicyPage type="privacy" />} />

          {/* URLs viejas -> destino nuevo, con replace para no ensuciar el historial */}
          {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}

          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
