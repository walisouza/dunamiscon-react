// Ruído suave (value noise) usado pelas dissoluções em pixel.
export function gNoise(x, y) {
    const f = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const h = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = f(x - xi);
    const v = f(y - yi);
    return h(xi, yi) * (1 - u) * (1 - v) + h(xi + 1, yi) * u * (1 - v) +
           h(xi, yi + 1) * (1 - u) * v + h(xi + 1, yi + 1) * u * v;
}
