import { router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import { AppShell } from '@/components/web/app-shell';
import type { SharedData } from '@/types';
import { Loader2, Plus, X } from 'lucide-react';

// one-screen wizard: group + guest names + first event, for splitting
// with people who don't have the app
export default function QuickSplit() {
    const { errors } = usePage<SharedData>().props;
    const [name, setName] = useState('');
    const [eventName, setEventName] = useState('');
    const [guests, setGuests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const guestInput = useRef<HTMLInputElement>(null);

    const addGuest = () => {
        const value = guestInput.current?.value.trim();
        if (!value || !guestInput.current) return;
        guestInput.current.value = '';
        setGuests((prev) => [...prev, value]);
    };

    const submit = () => {
        setLoading(true);
        router.post(
            '/groups/quick',
            { name, currency: 'ARS', guests, event_name: eventName },
            { onFinish: () => setLoading(false) },
        );
    };

    const inputClass =
        'h-12.5 w-full rounded-[13px] border border-input bg-card px-3.5 text-[15px] outline-none focus:border-ring';

    return (
        <AppShell title={t('groups:quick_split')} back="/groups">
            <h1 className="px-1 text-[22px] font-bold tracking-tight">{t('groups:quick_split')}</h1>
            <p className="mt-1.5 mb-5 px-1 text-[13px] leading-relaxed text-muted-foreground">{t('groups:quick_intro')}</p>

            {Object.keys(errors).length > 0 && <AlertError errors={Object.values(errors)} />}

            <label className="mb-2 block px-1 text-[13px] font-semibold">{t('groups:group_name')}</label>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('groups:quick_group_placeholder')}
                className={inputClass}
            />

            <label className="mt-5 mb-2 block px-1 text-[13px] font-semibold">{t('groups:quick_who')}</label>
            <div className="rounded-2xl border border-border bg-card p-3">
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary py-1.5 pr-2.5 pl-3 text-[13px] font-semibold">
                        {t('groups:you')}
                        <span className="text-[11px] font-normal text-muted-foreground">({t('groups:admin')})</span>
                    </div>
                    {guests.map((guest, i) => (
                        <div
                            key={`${guest}-${i}`}
                            className="flex items-center gap-1.5 rounded-full border border-border bg-secondary py-1.5 pr-2 pl-3 text-[13px] font-semibold"
                        >
                            {guest}
                            <button
                                type="button"
                                aria-label={t('common:delete')}
                                onClick={() => setGuests((prev) => prev.filter((_, idx) => idx !== i))}
                                className="flex size-4.5 cursor-pointer items-center justify-center rounded-full bg-border text-foreground"
                            >
                                <X className="size-2.5" strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex gap-2">
                    <input
                        ref={guestInput}
                        onKeyDown={(e) => {
                            if (e.key !== 'Enter') return;
                            e.preventDefault();
                            addGuest();
                        }}
                        placeholder={t('groups:add_name')}
                        className="h-10.5 flex-1 rounded-[11px] border border-input bg-background px-3 text-sm outline-none focus:border-ring"
                    />
                    <button
                        type="button"
                        aria-label={t('groups:add_name')}
                        onClick={addGuest}
                        className="flex size-10.5 flex-none cursor-pointer items-center justify-center rounded-[11px] bg-primary text-primary-foreground"
                    >
                        <Plus className="size-[18px]" strokeWidth={2.4} />
                    </button>
                </div>
            </div>

            <label className="mt-5 mb-2 block px-1 text-[13px] font-semibold">{t('groups:first_event')}</label>
            <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder={t('groups:quick_event_placeholder')}
                className={inputClass}
            />

            <button
                type="button"
                onClick={submit}
                disabled={loading || !name.trim() || !eventName.trim() || guests.length === 0}
                className="mt-6 flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-50"
            >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {t('groups:quick_create')}
            </button>
        </AppShell>
    );
}
