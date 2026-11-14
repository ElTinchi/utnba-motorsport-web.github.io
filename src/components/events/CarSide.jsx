import '../../styles/events/staticShared.css';

/**
 * Team car in side view, nose to the right, ground at local y = 20.
 * Groups tagged data-part (wing, chassis, engine, wheel) can be moved by a scene.
 */
export default function CarSide({ x = 0, y = 0, s = 1 }) {
  return (
    <g className="fs-side-car" transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M44,16 H63 V19 H44 Z" className="fs-side-car__body" />
      <path d="M-46,9 L-28,-5 L-8,9 L12,-3 L34,9 M-28,-5 L12,-3 M-8,9 H34" className="fs-side-car__metal" />
      <path d="M-30,6 L-36,8 M26,3 L38,10 M30,9 L38,10" className="fs-side-car__metal" />
      <g data-part="chassis">
        <path d="M-54,10 L-52,-4 L-30,-8 L-12,-8 L8,-4 L26,2 L52,8 L54,10 Z" className="fs-side-car__body" />
        <path d="M-21,-7 L-17,-21 L-11,-21" className="fs-side-car__metal" />
        <circle cx="-9" cy="-12" r="4.6" className="fs-side-car__helmet" />
      </g>
      <g data-part="engine">
        <rect x="-42" y="-14" width="18" height="10" rx="2" className="fs-side-car__engine" />
        <path d="M-38,-14 V-4 M-33,-14 V-4 M-28,-14 V-4" className="fs-side-car__metal" style={{ strokeWidth: 0.6 }} />
      </g>
      <g>
        <circle cx="-36" cy="8" r="12" className="fs-side-car__wheel" />
        <circle cx="-36" cy="8" r="3.5" className="fs-side-car__hub" />
      </g>
      <g data-part="wheel">
        <circle cx="38" cy="10" r="10" className="fs-side-car__wheel" />
        <circle cx="38" cy="10" r="3" className="fs-side-car__hub" />
      </g>
      <g data-part="wing">
        <path d="M-52,-20 V-9" className="fs-side-car__metal" />
        <path d="M-62,-24 H-42 V-20.5 H-62 Z" className="fs-side-car__body" />
      </g>
    </g>
  );
}
