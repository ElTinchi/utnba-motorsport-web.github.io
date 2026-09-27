const MIN_STAGGER_INTERVAL = 60;
const MAX_STAGGER_INTERVAL = 100;
const STAGGER_WINDOW = 4;

export function parseAnimatedValue(value) {
  const text = String(value);
  const firstDigit = text.search(/\d/);
  if (firstDigit === -1) {
    return { target: 0, prefix: text, suffix: '', grouped: false };
  }

  const digits = [...text.matchAll(/\d/g)];
  const lastDigit = digits.at(-1).index;
  const numericPart = text.slice(firstDigit, lastDigit + 1);

  return {
    target: Number(numericPart.replace(/\D/g, '')),
    prefix: text.slice(0, firstDigit),
    suffix: text.slice(lastDigit + 1),
    grouped: /[.,]/.test(numericPart),
  };
}

export function formatAnimatedValue(parsed, current, locale) {
  const number = parsed.grouped
    ? new Intl.NumberFormat(locale).format(current)
    : String(current);
  return `${parsed.prefix}${number}${parsed.suffix}`;
}

export function getStaggerDelay(index, interval = 80) {
  if (interval < MIN_STAGGER_INTERVAL || interval > MAX_STAGGER_INTERVAL) {
    throw new RangeError('Stagger interval must be between 60 and 100 milliseconds.');
  }
  return (index % STAGGER_WINDOW) * interval;
}

export function getEditorialRevealProps({
  as = 'div',
  direction = 'up',
  mask,
  visible = false,
  className = '',
}) {
  const classes = [
    'editorial-reveal',
    `editorial-reveal--${direction}`,
    mask && `editorial-reveal--mask-${mask}`,
    visible && 'editorial-reveal--visible',
    className,
  ].filter(Boolean).join(' ');

  return { element: as, className: classes, 'data-motion': 'editorial-reveal' };
}
