// Galeria 3D — scroll z-fly-in
import { gsap, ScrollTrigger } from '../lib/scroll';

export function initGaleria() {
    const trigger = document.querySelector('.video-teaser');
    const cards = gsap.utils.toArray('.galeria-card');
    if (!trigger || !cards.length) return () => {};

    const rotations = [0, 0, 0, 0, 0, 0, 0, 0];

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger,
            start: 'top top',
            // Quanto tempo a galeria fica presa.
            // No desktop quem manda é a coluna de texto ao lado: o .about-desktop
            // tem min-height:250vh contra os 100vh do teaser, então a galeria
            // precisa segurar exatamente a diferença para soltar no instante em
            // que o texto acaba. Com um valor fixo sobrava texto rolando depois
            // que a galeria já tinha se soltado — a dessincronia do fim.
            // Fora do desktop o .about-desktop está em display:none e aí vale a
            // proporção da viewport (o '+=1200' de antes era a altura de um
            // celular cravada em px, curta demais em tablet).
            end: () => {
                const about = document.querySelector('.about-desktop');
                if (about && about.offsetParent) {
                    return '+=' + Math.max(0, about.offsetHeight - trigger.offsetHeight);
                }
                return '+=' + Math.round(window.innerHeight * 1.4);
            },
            invalidateOnRefresh: true,
            scrub: 1.2,
            pin: true,
            // 'transform' é obrigatório aqui, não preferência: no desktop o
            // .video-teaser é um flex item (flex: 0 0 55%) dentro do
            // .teaser-about-wrapper. Com o 'fixed' automático o pin tira a seção
            // do fluxo, ela perde a largura que vinha do flex e encolhe durante
            // toda a animação, voltando ao tamanho certo só ao soltar. Mantendo
            // 'transform' a seção continua no fluxo e conserva a largura.
            pinType: 'transform',
            anticipatePin: 1,
        },
    });

    // fromTo garante que rotation é mantida em ambos os estados
    cards.forEach((card, i) => {
        tl.fromTo(card,
            { z: -2800, opacity: 0, rotation: rotations[i] },
            { z: 0, opacity: 1, rotation: rotations[i], ease: 'power2.out', duration: 1 },
            i * 0.2,
        );
    });

    ScrollTrigger.refresh();

    return () => {
        tl.scrollTrigger?.kill(true);
        tl.kill();
    };
}
