import { DESKTOP_EFFECTS } from '../lib/env';

// Three.js só é baixado no desktop (mesma regra da versão HTML, que o
// carregava por CDN apenas quando havia mouse). Uma única promessa compartilhada.
let threePromise = null;

export function loadThree() {
    if (!DESKTOP_EFFECTS) return Promise.resolve(null);
    if (!threePromise) threePromise = import('three').catch(() => null);
    return threePromise;
}
