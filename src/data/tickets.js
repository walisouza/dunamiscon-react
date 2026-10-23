// Último lote — cada setor é uma linha de quatro cards.
const DIR = 'assets/imagens/ultimo lote/';

export const TICKET_GROUPS = [
    {
        sector: 'tickets.central',
        cards: [
            { img: DIR + 'central individual.webp?v=2', alt: 'Central Individual - R$405,00', w: 716, h: 1107 },
            { img: DIR + 'central dupla.webp?v=2', alt: 'Central Combo Dupla - R$385,00', w: 689, h: 1051 },
            { img: DIR + 'central 3 amigos.webp?v=2', alt: 'Central Combo 3 Amigos - R$369,00', w: 786, h: 1154 },
            { img: DIR + 'Central caravana.webp?v=2', alt: 'Central Caravana - R$357,00', w: 721, h: 1154 },
        ],
    },
    {
        sector: 'tickets.bleachers',
        cards: [
            { img: DIR + 'arquibancada individual.webp?v=2', alt: 'Arquibancada Individual - R$385,00', w: 689, h: 954 },
            { img: DIR + 'arquibancada dupla.webp?v=2', alt: 'Arquibancada Combo Dupla - R$385,00', w: 689, h: 1135 },
            { img: DIR + 'arquibancada 3 amigos.webp?v=2', alt: 'Arquibancada Combo 3 Amigos - R$360,00', w: 696, h: 1008 },
            { img: DIR + 'arquibancada caravana.webp?v=2', alt: 'Arquibancada Caravana - R$348,00', w: 689, h: 1135 },
        ],
    },
];
