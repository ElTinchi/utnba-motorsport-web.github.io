import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../styles/scroll-car.css';

export default function ScrollCar({ circuitRef }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const circuit = circuitRef.current;
    const original = circuit?.querySelector('.hero__car');
    if (!overlay || !original) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const copy = original.cloneNode(true);
    copy.querySelector('animateMotion')?.remove();
    copy.removeAttribute('class');
    overlay.append(copy);
    let departure = null;
    let frame = 0;

    function draw() {
      frame = 0;
      const scroll = window.scrollY;
      if (motion.matches || scroll < 10) {
        overlay.style.opacity = '0';
        original.style.visibility = '';
        departure = null;
        return;
      }
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 768;
      if (!departure) {
        const matrix = original.getScreenCTM();
        departure = matrix
          ? { x: matrix.e, y: matrix.f, angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI }
          : { x: width * .75, y: height * .5, angle: 90 };
      }
      const exit = Math.min(1, scroll / (height * .65));
      const blend = exit * exit * (3 - 2 * exit);
      const progress = Math.max(0, scroll - height * .65) / height;
      // Keep the guide in the page gutter, clear of copy and controls.
      const rail = width - (mobile ? 18 : 42);
      const wave = Math.sin(progress * Math.PI);
      const targetY = height * (.47 + .18 * wave);
      const x = departure.x + (rail - departure.x) * blend;
      const y = departure.y + (targetY - departure.y) * blend;
      const heading = 90 + Math.sin(progress * Math.PI * 2) * (mobile ? 12 : 25);
      const turn = ((heading - departure.angle + 540) % 360) - 180;
      const angle = departure.angle + turn * blend;
      const scale = mobile ? .65 : 1.15;
      overlay.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale})`;
      overlay.style.opacity = '1';
      original.style.visibility = 'hidden';
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      original.style.visibility = '';
      copy.remove();
    };
  }, [circuitRef]);

  return typeof document === 'undefined' ? null : createPortal(
    <svg ref={overlayRef} className="scroll-car" viewBox="-28 -20 56 40" aria-hidden="true" focusable="false" />,
    document.body,
  );
}
