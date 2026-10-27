import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react';
import useReducedMotion from '../hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';
import { COMMERCIAL_CONTACT_HREF } from '../routes';
import '../styles/car-scroll-scene.css';

// Reuse the viewer's local renderer; no second 3D framework or permanent render loop.
export default function CarScrollScene() {
  const { t } = useTranslation();
  const section = useRef(null);
  const canvas = useRef(null);
  const draw = useRef(() => {});
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 1 });
  const turn = useTransform(smoothProgress, [0, 1], [.72, 2.4]);
  const line = useTransform(scrollYProgress, value => `scaleX(${value})`);
  useMotionValueEvent(turn, 'change', () => draw.current());
  useEffect(() => { reducedRef.current = reduced; draw.current(); }, [reduced]);

  useEffect(() => {
    const controller = new AbortController();
    let renderer;
    let initialized = false;
    let disposed = false;
    let visible = false;
    let started = false;
    let frame = 0;
    const paint = () => {
      if (frame || !renderer || !visible || document.hidden || disposed) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const aspect = canvas.current.clientWidth / Math.max(1, canvas.current.clientHeight);
        renderer.render({ yaw: reducedRef.current ? .72 : turn.get(), pitch: .26, distance: (aspect < 1.3 ? 10.2 : 7.2) / Math.min(1, aspect) });
      });
    };
    draw.current = paint;
    const start = async () => {
      if (started) return;
      started = true;
      // Data saver keeps the immediately available poster and link to the full viewer.
      if (navigator.connection?.saveData) return;
      try {
        const [{ CarRenderer, parseGLB, raycast }, { cleanUnderbody }, response] = await Promise.all([
          import(/* @vite-ignore */ String('/visor/engine.js?v=studio-light-22')),
          import(/* @vite-ignore */ String('/visor/undertray.js')),
          fetch('/visor/assets/model/auto.glb', { signal: controller.signal }),
        ]);
        if (!response.ok) throw new Error('Model unavailable');
        const buffer = await response.arrayBuffer();
        if (disposed) return;
        const model = parseGLB(buffer);
        cleanUnderbody(model, raycast);
        renderer = new CarRenderer(canvas.current, model);
        await renderer.initTextures();
        if (disposed) { renderer.dispose(); renderer = null; return; }
        initialized = true;
        setReady(true);
        paint();
      } catch {
        // The real render remains visible if WebGL, decoding or the request fails.
        if (renderer) { renderer.dispose(); renderer = null; }
      }
    };
    const preload = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { start(); preload.disconnect(); }
    }, { rootMargin: '350px' });
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; paint(); });
    preload.observe(section.current);
    visibility.observe(section.current);
    const resize = new ResizeObserver(paint);
    resize.observe(canvas.current);
    document.addEventListener('visibilitychange', paint);
    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(frame);
      preload.disconnect(); visibility.disconnect(); resize.disconnect();
      document.removeEventListener('visibilitychange', paint);
      draw.current = () => {};
      // Texture decoding may still be finishing; it disposes on completion above.
      if (renderer && initialized) renderer.dispose();
    };
  }, [turn]);

  return (
    <section ref={section} className={`car-scene${reduced ? ' car-scene--reduced' : ''}`} id="auto-en-movimiento" aria-labelledby="car-scene-title">
      <div className="car-scene__stage">
        <div className="car-scene__heading">
          <h2 id="car-scene-title">{t('cinematic.carTitle')}</h2>
          <p>{t('cinematic.carIntro')}</p>
        </div>
        <div className={`car-scene__model${ready ? ' car-scene__model--ready' : ''}`}>
          <img src="/assets/img/render_fsae.jpg" width="1920" height="1080" alt={t('carPage.renderAlt')} loading="lazy" />
          <canvas ref={canvas} aria-hidden="true" />
        </div>
        <div className="car-scene__bottom">
          <p>{t(reduced ? 'cinematic.carStill' : 'cinematic.carScroll')}</p>
          <div className="car-scene__actions">
            <a href="/visor/visor.html" className="btn btn--secondary">{t('sponsorStory.tryLogo')}</a>
            <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--primary">{t('sponsorsPage.primaryCta')}</a>
          </div>
        </div>
        <motion.div aria-hidden="true" className="car-scene__progress" style={{ transform: line }} />
      </div>
    </section>
  );
}
