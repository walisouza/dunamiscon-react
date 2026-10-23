import { useI18n } from '../i18n/I18nProvider';
import { asset } from '../lib/env';

// Dobra isolada com a thumb do recap; o clique abre o VideoModal.
export default function RecapVideo({ onOpen }) {
    const { t } = useI18n();
    return (
        <section className="recap-video">
            <img src={asset('assets/imagens/dobra 2/BG azul.webp')} alt="" className="recap-video-bg"
                 loading="lazy" decoding="async" width="2100" height="1293" />
            <button className="recap-video-thumb-btn" id="recapVideoBtn" aria-label={t('aria.watchVideo')} onClick={onOpen}>
                <img src={asset('assets/imagens/thumb-mobile.webp')} alt="Recap 2025"
                     className="recap-video-thumb recap-video-thumb-mobile"
                     loading="lazy" decoding="async" width="904" height="1320" />
                <img src={asset('assets/imagens/dobra 2/thumb video.webp')} alt="Recap 2025"
                     className="recap-video-thumb recap-video-thumb-desktop"
                     loading="lazy" decoding="async" width="1817" height="962" />
            </button>
        </section>
    );
}
