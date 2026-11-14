import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion.js';
import { loadCarModel } from './carModel.js';
import { applyLivery } from './carLivery.js';

const START_YAW = 0.72; // same three-quarter view the home scene opens with

/** The whole car turning one full 360° every `seconds`, over the photo render while the 3D model loads. */
export default function CarSpin({ seconds = 12, className = '' }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let renderer, raf = 0, disposed = false, live = false;
    const draw = yaw => {
      const aspect = canvas.current.clientWidth / Math.max(1, canvas.current.clientHeight);
      renderer.render({ yaw, pitch: 0.22, distance: (aspect < 1.3 ? 10.2 : 7.2) / Math.min(1, aspect) });
    };
    loadCarModel().then(async ({ CarRenderer, model }) => {
      if (disposed) return;
      renderer = new CarRenderer(canvas.current, model);
      await renderer.initTextures();
      // Decals are a bonus: a failed logo load keeps the plain red car.
      await applyLivery(renderer).catch(() => {});
      if (disposed) { renderer.dispose(); return; }
      live = true;
      setReady(true);
      if (reduced) { draw(START_YAW); return; }
      const start = performance.now();
      const loop = now => {
        draw(START_YAW + ((now - start) / 1000 / seconds) * Math.PI * 2);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }).catch(() => { /* WebGL or download failed: the photo render stays */ });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (live) renderer.dispose(); // otherwise the load path above disposes it
    };
  }, [seconds, reduced]);

  return <div className={`car-spin${ready ? ' car-spin--ready' : ''} ${className}`}>
    <img src="/assets/img/render_fsae.jpg" alt="" draggable={false} />
    <canvas ref={canvas} aria-hidden="true" />
  </div>;
}
