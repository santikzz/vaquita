import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// captured at module load so the event is not missed before a component mounts
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e as BeforeInstallPromptEvent;
        listeners.forEach((notify) => notify());
    });
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        listeners.forEach((notify) => notify());
    });
}

export function usePwaInstall() {
    const [, bump] = useState(0);

    useEffect(() => {
        const notify = () => bump((n) => n + 1);
        listeners.add(notify);
        return () => {
            listeners.delete(notify);
        };
    }, []);

    const isStandalone =
        typeof window !== 'undefined' &&
        (window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    const isIos = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

    const promptInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        listeners.forEach((notify) => notify());
    };

    return {
        isStandalone,
        isIos,
        canPrompt: deferredPrompt !== null,
        promptInstall,
    };
}
