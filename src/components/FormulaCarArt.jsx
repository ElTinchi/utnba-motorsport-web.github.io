import React from 'react';

export default function FormulaCarArt({ children, className }) {
  return <g className={className}>
    <rect x="-18" y="-14" width="9" height="7" rx="2" className="hero__car-wheel" />
    <rect x="-18" y="7" width="9" height="7" rx="2" className="hero__car-wheel" />
    <rect x="7" y="-13" width="8" height="6" rx="2" className="hero__car-wheel" />
    <rect x="7" y="7" width="8" height="6" rx="2" className="hero__car-wheel" />
    <path d="M-17,-7 C-11,-8 -7,-7 -3,-5 L7,-4 L17,-1.8 L21,0 L17,1.8 L7,4 L-3,5 C-7,7 -11,8 -17,7 L-19,4 L-19,-4 Z" className="hero__car-body" />
    <path d="M-10,-4 C-5,-5 0,-3.5 3,0 C0,3.5 -5,5 -10,4 Z" className="hero__car-glass" />
    <path d="M-8,-5.2 L-2,-8 M-8,5.2 L-2,8 M7,-4 L11,-8 M7,4 L11,8" className="hero__car-suspension" />
    {children}
  </g>;
}
