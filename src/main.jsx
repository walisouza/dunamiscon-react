import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n/I18nProvider';
import App from './App';

// Mesma ordem da versão HTML: estilos da primeira tela, folha principal e, por
// último, a grade do lineup no desktop (que precisa vencer a folha principal).
import './styles/critical.css';
import './styles/site.css';
import './styles/lineup-desktop.css';

// Sem <StrictMode>: ele monta os efeitos duas vezes em desenvolvimento, o que
// duplicaria o WebGL, o pin da galeria e os canvases de dissolução.
createRoot(document.getElementById('root')).render(
    <I18nProvider>
        <App />
    </I18nProvider>,
);
