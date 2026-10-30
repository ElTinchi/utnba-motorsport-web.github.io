import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import FormulaCarArt from './FormulaCarArt.jsx';
import '../styles/scroll-car.css';

export default function PageScrollCar() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['30vh', '70vh']);
  const transform = useMotionTemplate`translateY(${y}) rotate(90deg)`;
  return <motion.svg className="page-scroll-car" style={{ transform }} viewBox="-28 -20 56 40" aria-hidden="true" focusable="false"><FormulaCarArt /></motion.svg>;
}
