import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AlertError from '@/components/alert-error';
import { AppShell } from '@/components/web/app-shell';
import { ConfirmDrawer } from '@/components/web/confirm-drawer';
import { MemberAvatar } from '@/components/web/member-avatar';
import type { SharedData } from '@/types';
import type { MemberData } from '@/types/groups';
import { Check, Loader2, Trash2 } from 'lucide-react';

interface EventFormData {
    uuid: string;
    name: string;
    event_date: string;
    participants: string[];
}

interface Props {
    group: { uuid: string; name: string; currency: string };
    members: MemberData[];
    event?: EventFormData;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function ManageEvent({ group, members, event }: Props) {
    const { errors } = usePage<SharedData>().props;
    const isEdit = Boolean(event);
    const [name, setName] = useState(event?.name ?? '');
    const [date, setDate] = useState(event?.event_date ?? today());
    const [participants, setParticipants] = useState<string[]>(event?.participants ?? members.map((m) => m.uuid));
    const [loading, setLoading] = useState(false);

    const toggle = (uuid: string) => {
        setParticipants((prev) => {
            if (!prev.includes(uuid)) return [...prev, uuid];
            if (prev.length === 1) return prev;
            return prev.filter((p) => p !== uuid);
        });
    };

    const submit = () => {
        setLoading(true);
        const url = isEdit ? `/groups/${group.uuid}/events/${event!.uuid}` : `/groups/${group.uuid}/events`;
        router.post(url, { name, event_date: date, participants }, { onFinish: () => setLoading(false) });
    };

    const backUrl = isEdit ? `/groups/${group.uuid}/events/${event!.uuid}` : `/groups/${group.uuid}`;

    return (
        <AppShell title={isEdit ? t('groups:edit_event') : t('groups:new_event')} back={backUrl} context={group.name}>
            <h1 className="mb-5 px-1 text-[22px] font-bold tracking-tight">
                {isEdit ? t('groups:edit_event') : t('groups:new_event')}
            </h1>

            {Object.keys(errors).length > 0 && <AlertError errors={Object.values(errors)} />}

            <label className="mb-2 block px-1 text-[13px] font-semibold">{t('groups:event_name')}</label>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('groups:event_name_placeholder')}
                className="h-12.5 w-full rounded-[13px] border border-input bg-card px-3.5 text-[15px] outline-none focus:border-ring"
            />

            <label className="mt-5 mb-2 block px-1 text-[13px] font-semibold">{t('groups:date')}</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12.5 w-full rounded-[13px] border border-input bg-card px-3.5 text-[15px] outline-none focus:border-ring"
            />

            <label className="mt-5 mb-2 block px-1 text-[13px] font-semibold">{t('groups:participants')}</label>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {members.map((member) => {
                    const checked = participants.includes(member.uuid);
                    return (
                        <button
                            key={member.uuid}
                            type="button"
                            onClick={() => toggle(member.uuid)}
                            className="flex w-full cursor-pointer items-center gap-3 border-b border-border px-3.5 py-3 text-left last:border-b-0"
                        >
                            <span
                                className={`flex size-5.5 flex-none items-center justify-center rounded-[7px] border-[1.5px] ${
                                    checked ? 'border-primary bg-primary' : 'border-border bg-transparent'
                                }`}
                            >
                                <Check className={`size-3.5 text-primary-foreground ${checked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                            </span>
                            <MemberAvatar name={member.display_name} avatar={member.avatar} size="sm" />
                            <span className="flex-1 text-[14.5px] font-medium">{member.display_name}</span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={submit}
                disabled={loading || !name.trim() || !date || participants.length === 0}
                className="mt-6 flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-50"
            >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? t('common:save') : t('groups:create_event')}
            </button>

            {isEdit && (
                <>
                    <div className="min-h-8 flex-1" />
                    <ConfirmDrawer
                        onConfirm={() =>
                            new Promise<void>((resolve) =>
                                router.delete(`/groups/${group.uuid}/events/${event!.uuid}`, { onFinish: () => resolve() }),
                            )
                        }
                        title={t('groups:delete_event')}
                        description={t('groups:delete_event_hint')}
                    >
                        <button
                            type="button"
                            className="flex h-12.5 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[14.5px] font-semibold text-red-500 active:scale-[0.98]"
                        >
                            <Trash2 className="size-4" />
                            {t('groups:delete_event')}
                        </button>
                    </ConfirmDrawer>
                </>
            )}
        </AppShell>
    );
}
