import '../css/app.css';
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient()

// eager-load every page so navigations never wait on a chunk download
const pages = import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx', { eager: true });

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];
        if (!page) throw new Error(`Page not found: ./pages/${name}.tsx`);
        return page;
    },
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