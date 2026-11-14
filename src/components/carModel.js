// Loads the viewer's 3D engine and the car model once per page; every caller
// (home scroll scene, stand 360° slide) shares the same parsed model.
let pending;

export function loadCarModel() {
  pending ||= (async () => {
    const [{ CarRenderer }, response] = await Promise.all([
      import(/* @vite-ignore */ String('/visor/engine.js?v=studio-light-22')),
      fetch('/visor/assets/model/auto.glb'),
    ]);
    if (!response.ok) throw new Error('Model unavailable');
    const buffer = await response.arrayBuffer();
    // Parsing and clipping the model take a few hundred ms: do it off the main thread so scrolling stays smooth.
    const model = await new Promise((resolve, reject) => {
      const worker = new Worker('/visor/model-worker.js?v=1', { type: 'module' });
      worker.onmessage = ({ data }) => { worker.terminate(); data.error ? reject(new Error(data.error)) : resolve(data.model); };
      worker.onerror = event => { worker.terminate(); reject(event); };
      worker.postMessage({ buffer }, [buffer]);
    });
    return { CarRenderer, model };
  })();
  // A failed load (offline, no WebGL worker) can be retried by the next caller.
  pending.catch(() => { pending = undefined; });
  return pending;
}
