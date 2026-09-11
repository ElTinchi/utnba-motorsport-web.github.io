import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Team from './pages/Team.jsx';
import Car from './pages/Car.jsx';
import Academy from './pages/Academy.jsx';
import FormulaStudent from './pages/FormulaStudent.jsx';
import JoinUs from './pages/JoinUs.jsx';
import Sponsors from './pages/Sponsors.jsx';
import News from './pages/News.jsx';
import NotFound from './pages/NotFound.jsx';
import { ROUTES, LEGACY_REDIRECTS } from './routes';

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

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="main">
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.news} element={<News />} />
          <Route path={ROUTES.team} element={<Team />} />
          <Route path={ROUTES.car} element={<Car />} />
          <Route path={ROUTES.academy} element={<Academy />} />
          <Route path={ROUTES.aboutFormulaStudent} element={<FormulaStudent />} />
          <Route path={ROUTES.joinUs} element={<JoinUs />} />
          <Route path={ROUTES.sponsors} element={<Sponsors />} />

          {/* URLs viejas -> destino nuevo, con replace para no ensuciar el historial */}
          {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
