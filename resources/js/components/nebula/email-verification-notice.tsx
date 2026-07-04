import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, MailCheck, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COOLDOWN_MS = 5 * 60 * 1000;
const STORAGE_KEY = 'verify_resend_until';

interface Props {
    verified: boolean;
    className?: string;
}

export function EmailVerificationNotice({ verified, className }: Props) {
    const [sending, setSending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // keep the countdown in sync with the throttle window stored in localStorage
    useEffect(() => {
        if (verified) return;
        const tick = () => {
            const until = Number(localStorage.getItem(STORAGE_KEY) || 0);
            setCooldown(Math.max(0, Math.ceil((until - Date.now()) / 1000)));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [verified]);

    if (verified) {
        return (
            <div
                className={cn(
                    'flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400',
                    className,
                )}
            >
                <CheckCircle2 className="size-4 shrink-0" />
                {t('profile:email_verified')}
            </div>
        );
    }

    const handleResend = () => {
        setSending(true);
        router.post(
            '/email/resend',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    localStorage.setItem(STORAGE_KEY, String(Date.now() + COOLDOWN_MS));
                    toast.success(t('profile:verification_sent'));
                },
                onError: () => toast.error(t('common:error')),
                onFinish: () => setSending(false),
            },
        );
    };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div
            className={cn(
                'flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 shrink-0" />
                {t('profile:email_unverified')}
            </div>
            <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={handleResend}
                disabled={sending || cooldown > 0}
            >
                {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <MailCheck className="size-4" />
                )}
                {cooldown > 0
                    ? t('profile:resend_in', { time: formatTime(cooldown) })
                    : t('profile:resend_verification')}
            </Button>
        </div>
    );
}
