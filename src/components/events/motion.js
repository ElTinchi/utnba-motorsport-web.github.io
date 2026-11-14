// Small helpers shared by the static-event scenes. All write straight to the DOM.
export const clamp01 = x => Math.min(1, Math.max(0, x));
export const ease = x => x * x * (3 - 2 * x);
/** Eased 0..1 progress of t between a and b. */
export const seg = (t, a, b) => ease(clamp01((t - a) / (b - a)));
export const op = (el, v) => el.setAttribute('opacity', v.toFixed(2));
export const text = (el, s) => { if (el.textContent !== s) el.textContent = s; };
/** Rotates a Person arm (side -1 left, 1 right); 0 deg hangs down, +deg swings it to screen-left. */
export const arm = (el, side, deg) => el.setAttribute('transform', `translate(${side * 9} -26) rotate(${deg.toFixed(1)})`);
