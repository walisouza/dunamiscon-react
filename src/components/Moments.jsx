import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { AutoVideo } from './common';
import { asset } from '../lib/env';

const VIDEOS = ['01.mp4', '02.mp4', '03.mp4'];

// Moments — botão de som (som exclusivo: ativar um muta os outros).
export default function Moments() {
    const { t } = useI18n();
    const [unmuted, setUnmuted] = useState(-1);
    const videosRef = useRef([]);

    useEffect(() => {
        videosRef.current.forEach((video, i) => {
            if (video) video.muted = i !== unmuted;
        });
    }, [unmuted]);

    return (
        <section className="moments">
            <img src={asset('assets/imagens/título-dunamiscon.webp')} alt="Dunamis Con'26 moments" className="moments-title"
                 loading="lazy" decoding="async" width="1582" height="206" />
            <div className="moments-grid">
                {VIDEOS.map((file, i) => {
                    const on = unmuted === i;
                    return (
                        <div className="moments-embed" key={file}>
                            <AutoVideo
                                ref={(el) => { videosRef.current[i] = el; }}
                                className={`moments-video moments-video-${i + 1}`}
                                src={asset('assets/dunamis-con-moments-videos/' + file)}
                                preload="metadata"
                                crossOrigin="anonymous"
                            />
                            <button
                                className={'moments-sound-btn' + (on ? ' is-unmuted' : '')}
                                aria-label={t(on ? 'aria.soundOff' : 'aria.soundOn')}
                                aria-pressed={on}
                                onClick={() => setUnmuted(on ? -1 : i)}
                            >
                                <svg className="icon-muted" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="#fff" /><line x1="16" y1="9" x2="22" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><line x1="22" y1="9" x2="16" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                                <svg className="icon-unmuted" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="#fff" /><path d="M16 8a5 5 0 010 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M18.5 5.5a9 9 0 010 13" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
