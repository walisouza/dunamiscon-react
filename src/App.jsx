import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from './i18n/I18nProvider';
import { initSmoothScroll, ScrollTrigger } from './lib/scroll';
import { loadThree } from './effects/three';
import { initMouseDistortion } from './effects/mouseDistortion';
import { initReveal } from './effects/reveal';
import { initGaleria } from './effects/galeria';
import { initDissolves } from './effects/dissolve';

import Navbar from './components/Navbar';
import MenuOverlay from './components/MenuOverlay';
import Hero from './components/Hero';
import RecapVideo from './components/RecapVideo';
import VideoModal from './components/VideoModal';
import Lineup from './components/Lineup';
import Tickets from './components/Tickets';
import TeaserAbout from './components/TeaserAbout';
import Espera from './components/Espera';
import Caravana from './components/Caravana';
import PowerUp from './components/PowerUp';
import Moments from './components/Moments';
import Faq from './components/Faq';
import Footer from './components/Footer';
import BioModal from './components/BioModal';

// As animações de scroll medem o layout final; esperam as imagens/fontes do load.
function pageLoaded() {
    if (document.readyState === 'complete') return Promise.resolve();
    return new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
}

export default function App() {
    const { lang } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [bio, setBio] = useState(null);
    const [bioOpen, setBioOpen] = useState(false);
    const revealRef = useRef(null);

    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const closeVideo = useCallback(() => setVideoOpen(false), []);
    const closeBio = useCallback(() => setBioOpen(false), []);
    const openBio = useCallback((data) => { setBio(data); setBioOpen(true); }, []);

    // Efeitos da página inteira (os que atravessam várias seções).
    useEffect(() => {
        const cleanups = [];
        let cancelled = false;

        (async () => {
            await initSmoothScroll();
            const THREE = await loadThree();
            if (cancelled) return;
            if (THREE) cleanups.push(initMouseDistortion(THREE));

            const reveal = initReveal();
            revealRef.current = reveal;
            cleanups.push(reveal.destroy);

            await pageLoaded();
            if (cancelled) return;
            cleanups.push(initGaleria());
            cleanups.push(initDissolves());
        })();

        // Só a LARGURA importa aqui. No iPad a barra de endereço entrando e saindo
        // dispara resize a cada scroll mudando só a altura — refazer o ScrollTrigger
        // nessas horas é justamente o que o ignoreMobileResize evita, e era o que
        // fazia o pin da galeria engasgar. Texto também só requebra quando a
        // largura muda, então esta guarda serve aos dois.
        let reflowTimer;
        let lastWidth = window.innerWidth;
        const onViewportReflow = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            clearTimeout(reflowTimer);
            reflowTimer = setTimeout(() => {
                revealRef.current?.rebuild();
                ScrollTrigger.refresh();
            }, 250);
        };
        // orientationchange dispara antes de innerWidth atualizar; o resize que vem
        // em seguida é quem faz o trabalho, mas o timeout cobre quem não o emite.
        const onOrientation = () => setTimeout(onViewportReflow, 300);
        window.addEventListener('resize', onViewportReflow);
        window.addEventListener('orientationchange', onOrientation);

        return () => {
            cancelled = true;
            clearTimeout(reflowTimer);
            window.removeEventListener('resize', onViewportReflow);
            window.removeEventListener('orientationchange', onOrientation);
            cleanups.forEach((fn) => fn());
        };
    }, []);

    // A troca de idioma substitui o texto dos parágrafos; refaz as barras do reveal.
    useEffect(() => { revealRef.current?.rebuild(); }, [lang]);

    return (
        <>
            <Navbar menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
            <MenuOverlay open={menuOpen} onClose={closeMenu} />

            <Hero />
            <RecapVideo onOpen={() => setVideoOpen(true)} />
            <VideoModal open={videoOpen} onClose={closeVideo} />

            <Lineup onOpenBio={openBio} />
            <Tickets />
            <TeaserAbout />
            <Espera />
            <Caravana />
            <PowerUp />
            <Moments />
            <Faq />
            <Footer />

            <BioModal bio={bio} open={bioOpen} onClose={closeBio} />
        </>
    );
}
