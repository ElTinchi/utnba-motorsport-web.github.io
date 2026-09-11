// Iconos de bandera dibujados a mano (SVG inline).
// Nota: no usamos emoji de bandera porque Windows las renderiza
// como el código de país en texto ("AR", "GB", "BR") en vez del ícono.

const FLAG_VIEWBOX = '0 0 24 16';

function FlagBase({ className, children }) {
  return (
    <svg
      className={`flag-icon ${className || ''}`}
      viewBox={FLAG_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function FlagAR({ className }) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 16;
    const innerR = 1.1;
    const outerR = i % 2 === 0 ? 2.6 : 2.0;
    const x1 = 12 + Math.cos(angle) * innerR;
    const y1 = 8 + Math.sin(angle) * innerR;
    const x2 = 12 + Math.cos(angle) * outerR;
    const y2 = 8 + Math.sin(angle) * outerR;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F6B40E" strokeWidth="0.9" />;
  });

  return (
    <FlagBase className={className}>
      <rect width="24" height="16" fill="#74ACDF" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <g>{rays}</g>
      <circle cx="12" cy="8" r="1.4" fill="#F6B40E" stroke="#85340A" strokeWidth="0.3" />
    </FlagBase>
  );
}

export function FlagGB({ className }) {
  return (
    <FlagBase className={className}>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="3.2" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1.1" />
      <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" strokeWidth="5.4" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="1.8" />
    </FlagBase>
  );
}

export function FlagBR({ className }) {
  return (
    <FlagBase className={className}>
      <rect width="24" height="16" fill="#009C3B" />
      <polygon points="12,2 22,8 12,14 2,8" fill="#FEDD00" />
      <circle cx="12" cy="8" r="3.6" fill="#002776" />
      <path d="M8.6,7 A5,5 0 0 0 15.6,9.4" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
    </FlagBase>
  );
}

export const FLAG_COMPONENTS = {
  es: FlagAR,
  en: FlagGB,
  pt: FlagBR,
};
