import useInView from '../hooks/useInView.js';
import { getEditorialRevealProps } from '../utils/editorialMotion.js';

export default function EditorialReveal({
  as: Element = 'div',
  direction = 'up',
  mask,
  rhythm = 'standard',
  className = '',
  children,
  ...props
}) {
  const [ref, visible] = useInView();
  const revealProps = getEditorialRevealProps({
    as: Element,
    direction,
    mask,
    visible,
    className,
  });

  return (
    <Element
      {...props}
      ref={ref}
      className={`${revealProps.className} editorial-reveal--${rhythm}`}
      data-motion={revealProps['data-motion']}
    >
      {children}
    </Element>
  );
}
