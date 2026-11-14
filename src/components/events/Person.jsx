import '../../styles/events/staticShared.css';

/** Flat pictogram person, feet at (x, y). armL/armR are optional refs to the arm groups (see motion.arm). */
export default function Person({ x = 0, y = 0, s = 1, kind = 'team', armL, armR }) {
  return (
    <g className={`fs-person fs-person--${kind}`} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y="-13" width="5" height="13" rx="2.5" />
      <rect x="1" y="-13" width="5" height="13" rx="2.5" />
      <rect x="-9" y="-31" width="18" height="24" rx="8" />
      <g ref={armL} transform="translate(-9 -26) rotate(8)"><line className="fs-person__arm" x1="0" y1="0" x2="0" y2="17" /></g>
      <g ref={armR} transform="translate(9 -26) rotate(-8)"><line className="fs-person__arm" x1="0" y1="0" x2="0" y2="17" /></g>
      <circle cx="0" cy="-38" r="6.5" />
    </g>
  );
}
