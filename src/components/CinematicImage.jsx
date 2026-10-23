import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import useReducedMotion from '../hooks/useReducedMotion';

export default function CinematicImage(props) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const transform = useTransform(scrollYProgress, [0, 1], ['translate3d(0, 4%, 0) scale(1.08)', 'translate3d(0, -4%, 0) scale(1.08)']);
  return <div ref={ref} className="cinematic-image"><motion.img {...props} style={{ transform: reduce ? 'none' : transform }} /></div>;
}
