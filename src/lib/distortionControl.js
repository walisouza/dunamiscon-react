// Permite que outras partes do site (ex.: ao abrir um modal de vídeo)
// escondam o canvas da distorção na hora, sem esperar o mouse sair do elemento —
// evita o canvas ficar visível por cima de um modal com z-index maior.
let disabler = null;

export function registerDistortionDisabler(fn) {
    disabler = fn;
}

export function disableMouseDistortion() {
    if (disabler) disabler();
}
