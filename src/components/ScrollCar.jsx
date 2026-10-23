import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useSpring, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import '../styles/scroll-car.css';

export default function ScrollCar({ circuitRef }) {
  const overlayRef = useRef(null);
  const x = useSpring(0, { stiffness: 100, damping: 20, mass: 1 });
  const y = useSpring(0, { stiffness: 100, damping: 20, mass: 1 });
  const angle = useSpring(90, { stiffness: 100, damping: 20, mass: 1 });
  const size = useSpring(1, { stiffness: 100, damping: 20, mass: 1 });
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${size})`;
  const { scrollYProgress } = useScroll();
  const progressTransform = useTransform(scrollYProgress, value => `scaleX(${value})`);

  useEffect(() => {
    const overlay = overlayRef.current;
    const original = circuitRef.current?.querySelector('.hero__car');
    if (!overlay || !original) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const copy = original.cloneNode(true);
    copy.querySelector('animateMotion')?.remove();
    copy.removeAttribute('class');
    overlay.append(copy);
    let departure = null;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const scroll = window.scrollY;
      if (preference.matches || scroll < 10) {
        overlay.style.opacity = '0';
        original.style.visibility = '';
        departure = null;
        return;
      }
      const width = innerWidth, height = innerHeight, mobile = width < 768;
      const rail = width - (mobile ? 18 : 36);
      if (!departure) {
        // The circuit is hidden on phones: start in the gutter, not at (0,0).
        const matrix = mobile ? null : original.getScreenCTM();
        departure = matrix
          ? { x: Math.max(24, Math.min(rail, matrix.e)), y: Math.max(100, Math.min(height - 60, matrix.f)), angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI }
          : { x: rail, y: height * .35, angle: 90 };
        x.jump(departure.x); y.jump(departure.y); angle.jump(departure.angle);
        size.jump(mobile ? .65 : 1);
      }
      const exit = Math.min(1, scroll / 260);
      const blend = exit * exit * (3 - 2 * exit);
      const progress = Math.min(1, scroll / Math.max(1, document.documentElement.scrollHeight - height));
      // Choose the exit arc once. Normalizing a changing angle near 180° can
      // flip from +180 to -180 and make a spring perform an unwanted full turn.
      const turn = ((90 - departure.angle + 540) % 360) - 180;
      size.set(mobile ? .65 : 1);
      x.set(departure.x + (rail - departure.x) * blend);
      y.set(departure.y + (height * (.3 + .4 * progress) - departure.y) * blend);
      angle.set(departure.angle + (turn + Math.sin(progress * Math.PI * 2) * 6) * blend);
      overlay.style.opacity = '1';
      original.style.visibility = 'hidden';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      original.style.visibility = '';
      copy.remove();
    };
  }, [circuitRef, x, y, angle, size]);

  return typeof document === 'undefined' ? null : createPortal(<>
    <motion.div className="scroll-reading-progress" style={{ transform: progressTransform }} aria-hidden="true" />
    <motion.svg ref={overlayRef} style={{ transform }} className="scroll-car" viewBox="-28 -20 56 40" aria-hidden="true" focusable="false" />
  </>, document.body);
}
