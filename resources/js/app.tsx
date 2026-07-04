import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient()

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <StrictMode>
                <I18nextProvider i18n={i18n}>
                    <QueryClientProvider client={queryClient}>
                        <App {...props} />
                    </QueryClientProvider>
                </I18nextProvider>
            </StrictMode>,
        );
    },
    progress: false,
    defaults: {
        visitOptions: (href, options) => {
            return { viewTransition: true };
        },
    },
});

initializeTheme();