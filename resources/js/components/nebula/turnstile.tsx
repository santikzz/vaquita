import { useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: Record<string, unknown>) => string;
            remove: (id: string) => void;
        };
    }
}

function loadScript(): Promise<void> {
    if (window.turnstile) return Promise.resolve();

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
        return new Promise((resolve) => {
            if (window.turnstile) return resolve();
            existing.addEventListener('load', () => resolve(), { once: true });
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Turnstile'));
        document.head.appendChild(script);
    });
}

type Props = {
    onVerify: (token: string) => void;
    onExpire?: () => void;
};

export function Turnstile({ onVerify, onExpire }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const callbacks = useRef({ onVerify, onExpire });
    callbacks.current = { onVerify, onExpire };

    useEffect(() => {
        if (!siteKey || !containerRef.current) return;

        let widgetId: string | undefined;
        let cancelled = false;
        const container = containerRef.current;

        loadScript()
            .then(() => {
                if (cancelled || !window.turnstile) return;
                widgetId = window.turnstile.render(container, {
                    sitekey: siteKey,
                    action: 'turnstile-spin-v1',
                    theme: 'light',
                    callback: (token: string) => callbacks.current.onVerify(token),
                    'expired-callback': () => callbacks.current.onExpire?.(),
                });
            })
            .catch(() => { });

        return () => {
            cancelled = true;
            if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
        };
    }, []);

    if (!siteKey) return null;

    return <div ref={containerRef} className="flex justify-center" />;
}
