import { motion, useScroll, useTransform } from 'motion/react';
import useReducedMotion from '../hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

export default function HeroArtwork() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, 1000], ['translate3d(0, 0, 0) scale(1)', 'translate3d(0, -12%, 0) scale(1.12)']);
  return <motion.div className="hero-artwork" style={{ transform: reduce ? 'none' : transform }}>
    <img src="/assets/img/render_fsae.jpg" alt={t('carPage.renderAlt')} width="1920" height="1080" fetchpriority="high" />
    <span className="hero-artwork__caption">Fórmula SAE · Brasil 2027</span>
  </motion.div>;
}
