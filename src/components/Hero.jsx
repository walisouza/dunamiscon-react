import { useEffect, useRef } from 'react';
import { AutoVideo, CtaButton } from './common';
import { asset, DESKTOP_EFFECTS } from '../lib/env';
import { loadThree } from '../effects/three';
import { initHeroDistortion } from '../effects/heroDistortion';

const DESKTOP_MEDIA = '(min-width: 1440px), (min-width: 1024px) and (orientation: landscape)';

export default function Hero() {
    const heroRef = useRef(null);
    const canvasRef = useRef(null);
    const mobileVideoRef = useRef(null);
    const desktopVideoRef = useRef(null);

    useEffect(() => {
        if (!DESKTOP_EFFECTS) return;
        let cleanup = () => {};
        let cancelled = false;
        loadThree().then((THREE) => {
            if (cancelled || !THREE) return;
            cleanup = initHeroDistortion(THREE, {
                hero: heroRef.current,
                canvas: canvasRef.current,
                desktopVideo: desktopVideoRef.current,
                mobileVideo: mobileVideoRef.current,
            });
        });
        return () => { cancelled = true; cleanup(); };
    }, []);

    return (
        <section className="hero" ref={heroRef}>
            <AutoVideo ref={mobileVideoRef} className="hero-video hero-video-mobile" preload="auto">
                <source src={asset('assets/videos/dc26-motion.mp4')} type="video/mp4" />
            </AutoVideo>
            <AutoVideo ref={desktopVideoRef} className="hero-video hero-video-desktop" preload="auto">
                <source src={asset('assets/videos/bg-dc26-header-desktop.mp4')} type="video/mp4" />
            </AutoVideo>
            <canvas className="hero-webgl" id="heroWebGL" ref={canvasRef}></canvas>
            <div className="hero-content">
                <div className="hero-title-wrap">
                    <picture className="hero-picture">
                        <source media={DESKTOP_MEDIA} type="image/webp"
                                srcSet={asset('assets/gifs/logo-desktop.webp')} width="1920" height="1080" />
                        <source media={DESKTOP_MEDIA}
                                srcSet={asset('assets/gifs/logo-desktop.gif')} width="1920" height="1080" />
                        <source type="image/webp" srcSet={asset('assets/gifs/logo-banner-mobile.webp')} width="675" height="900" />
                        <img src={asset('assets/gifs/logo-banner-mobile.gif')} alt="DC 26" className="hero-logo"
                             width="675" height="900" loading="eager" fetchpriority="high" />
                    </picture>
                </div>
                <CtaButton href="#setores" />
            </div>
        </section>
    );
}
