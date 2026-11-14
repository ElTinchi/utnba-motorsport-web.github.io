// Parses and cleans the car model off the main thread (see CarScrollScene).
import { parseGLB, raycast } from './engine.js?v=studio-light-22';
import { cleanUnderbody } from './undertray.js?v=1';

self.onmessage = ({ data }) => {
  try {
    const model = parseGLB(data.buffer);
    cleanUnderbody(model, raycast);
    self.postMessage({ model });
  } catch (error) {
    self.postMessage({ error: String(error?.message || error) });
  }
};
