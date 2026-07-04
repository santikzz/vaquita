import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { AppShell, BackButton, Fab } from '@/components/web/app-shell';
import { ConfirmDrawer } from '@/components/web/confirm-drawer';
import { MemberAvatar } from '@/components/web/member-avatar';
import { Segmented } from '@/components/web/segmented';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatMoney, formatMoneySigned } from '@/lib/money';
import type { BalanceData, EventListItem, GroupData, MemberData } from '@/types/groups';
import { CalendarDays, Check, Copy, Loader2, LogOut, SquarePen, Plus, Scale, UserMinus, Users } from 'lucide-react';

interface Props {
    group: GroupData;
    members: MemberData[];
    events: EventListItem[];
    balances: BalanceData[];
}

type Tab = 'events' | 'members' | 'balances';

export default function GroupShow({ group, members, events, balances }: Props) {
    const [tab, setTab] = useState<Tab>('events');
    const activeMembers = members.filter((m) => m.is_active);

    return (
        <AppShell
            title={group.name}
            showTabBar
            header={
                <div className="flex-none px-4 pt-4 pb-1.5">
                    <div className="mb-3.5 flex items-center justify-between">
                        <BackButton href="/groups" />
                        {group.is_owner ? (
                            <Link
                                href={`/groups/${group.uuid}/edit`}
                                prefetch="mount"
                                aria-label={t('groups:edit_group')}
                                className="flex size-10 items-center justify-center rounded-xl border border-border active:scale-95"
                            >
                                <SquarePen className="size-[18px]" />
                            </Link>
                        ) : (
                            <ConfirmDrawer
                                onConfirm={() =>
                                    new Promise<void>((resolve) =>
                                        router.post(`/groups/${group.uuid}/leave`, {}, { onFinish: () => resolve() }),
                                    )
                                }
                                title={t('groups:leave_group')}
                                description={t('groups:leave_group_hint')}
                                confirmLabel={t('groups:leave_group')}
                            >
                                <button
                                    type="button"
                                    aria-label={t('groups:leave_group')}
                                    className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border active:scale-95"
                                >
                                    <LogOut className="size-[18px]" />
                                </button>
                            </ConfirmDrawer>
                        )}
                    </div>
                    <div className="px-1 pb-1">
                        <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
                        <div className="mt-0.5 text-[13px] text-muted-foreground">
                            {t('groups:members_count', { count: activeMembers.length })} · {t('groups:events_count', { count: events.length })}
                        </div>
                    </div>
                    <Segmented
                        className="mt-3.5"
                        value={tab}
                        onChange={(v) => setTab(v as Tab)}
                        options={[
                            { value: 'events', label: t('groups:tab_events'), icon: CalendarDays },
                            { value: 'members', label: t('groups:tab_members'), icon: Users },
                            { value: 'balances', label: t('groups:tab_balances'), icon: Scale },
                        ]}
                    />
                </div>
            }
        >
            {tab === 'events' && <EventsTab group={group} events={events} />}
            {tab === 'members' && <MembersTab group={group} members={members} />}
            {tab === 'balances' && <BalancesTab group={group} members={activeMembers} balances={balances} />}

            {tab === 'events' && <Fab href={`/groups/${group.uuid}/events/create`} label={t('groups:event')} aboveTabBar />}
        </AppShell>
    );
}

function EventsTab({ group, events }: { group: GroupData; events: EventListItem[] }) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center px-8 pt-14 pb-6 text-center">
                <div className="mb-4 flex size-15 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
                    <CalendarDays className="size-6" />
                </div>
                <div className="text-base font-semibold">{t('groups:new_event')}</div>
                <div className="mt-1.5 max-w-60 text-[13.5px] leading-relaxed text-muted-foreground">{t('groups:no_events_hint')}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5 pt-2">
            {events.map((event) => (
                <Link
                    key={event.uuid}
                    href={`/groups/${group.uuid}/events/${event.uuid}`}
                    prefetch="mount"
                    className="flex items-center justify-between gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5 transition-transform active:scale-[0.98]"
                >
                    <div>
                        <div className="text-[15.5px] font-semibold">{event.name}</div>
                        <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                            {event.event_date} · {formatMoney(event.total_minor, group.currency)}
                        </div>
                    </div>
                    <span
                        className={`flex-none rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold ${
                            event.status === 'settled' ? 'text-muted-foreground' : 'text-primary'
                        }`}
                    >
                        {event.status === 'settled' ? t('groups:settled') : t('groups:open')}
                    </span>
                </Link>
            ))}
        </div>
    );
}

function MembersTab({ group, members: initialMembers }: { group: GroupData; members: MemberData[] }) {
    const [members, setMembers] = useState(initialMembers);
    const [guestOpen, setGuestOpen] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [adding, setAdding] = useState(false);
    const [, copy] = useClipboard();
    const [copied, setCopied] = useState(false);
    const [copiedAlias, setCopiedAlias] = useState<string | null>(null);

    // keep local list in sync with server props after each reconcile
    useEffect(() => setMembers(initialMembers), [initialMembers]);

    const inviteUrl = `${window.location.origin}/join/${group.invite_code}`;

    const copyAlias = async (member: MemberData) => {
        if (!member.payment_alias) return;
        await copy(member.payment_alias);
        setCopiedAlias(member.uuid);
        setTimeout(() => setCopiedAlias((prev) => (prev === member.uuid ? null : prev)), 1600);
    };

    const addGuest = () => {
        const nickname = guestName.trim();
        if (!nickname || adding) return;
        setAdding(true);

        const optimistic: MemberData = {
            uuid: `temp-${crypto.randomUUID()}`,
            display_name: nickname,
            avatar: null,
            payment_alias: null,
            is_guest: true,
            is_active: true,
            is_me: false,
            role: 'member',
        };
        setMembers((prev) => [...prev, optimistic]);
        setGuestName('');
        setGuestOpen(false);

        router.post(
            `/groups/${group.uuid}/members`,
            { nickname },
            {
                preserveScroll: true,
                only: ['members', 'balances'],
                onError: () => {
                    setMembers((prev) => prev.filter((m) => m.uuid !== optimistic.uuid));
                    setGuestName(nickname);
                    setGuestOpen(true);
                },
                onFinish: () => setAdding(false),
            },
        );
    };

    const copyInvite = async () => {
        await copy(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className="pt-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {members.map((member) => (
                    <div key={member.uuid} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
                        <MemberAvatar name={member.display_name} avatar={member.avatar} className={member.is_active ? '' : 'opacity-40'} />
                        <div className="min-w-0 flex-1">
                            <div className={`truncate text-[15px] font-medium ${member.is_active ? '' : 'text-muted-foreground line-through'}`}>
                                {member.display_name}
                            </div>
                            {member.payment_alias && (
                                <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{member.payment_alias}</div>
                            )}
                        </div>
                        {(member.is_guest || member.is_me) && (
                            <span className="flex-none rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                                {member.is_me ? t('groups:you') : t('groups:guest')}
                            </span>
                        )}
                        {member.payment_alias && (
                            <button
                                type="button"
                                aria-label={t('groups:copy')}
                                onClick={() => copyAlias(member)}
                                className="flex size-8 flex-none cursor-pointer items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground active:scale-95"
                            >
                                {copiedAlias === member.uuid ? (
                                    <Check className="size-4 text-emerald-500" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </button>
                        )}
                        {group.is_owner && member.role !== 'owner' && member.is_active && (
                            <ConfirmDrawer
                                onConfirm={() => {
                                    // optimistically deactivate; server may delete or deactivate, reconciled on reload
                                    setMembers((prev) => prev.map((m) => (m.uuid === member.uuid ? { ...m, is_active: false } : m)));
                                    router.delete(`/groups/${group.uuid}/members/${member.uuid}`, {
                                        preserveScroll: true,
                                        only: ['members', 'balances'],
                                        onError: () =>
                                            setMembers((prev) => prev.map((m) => (m.uuid === member.uuid ? { ...m, is_active: true } : m))),
                                    });
                                    return Promise.resolve();
                                }}
                                title={t('groups:remove_member')}
                                description={t('groups:remove_member_hint', { name: member.display_name })}
                            >
                                <button
                                    type="button"
                                    aria-label={t('groups:remove_member')}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:text-red-500"
                                >
                                    <UserMinus className="size-4" />
                                </button>
                            </ConfirmDrawer>
                        )}
                    </div>
                ))}
            </div>

            {group.is_owner && (
                <>
                    <button
                        type="button"
                        onClick={() => setGuestOpen(true)}
                        className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-sm font-semibold"
                    >
                        <Plus className="size-[17px]" />
                        {t('groups:add_guest')}
                    </button>
                    <Drawer open={guestOpen} onOpenChange={setGuestOpen}>
                        <DrawerContent>
                            <div className="p-4 pb-8">
                                <DrawerTitle className="px-1 pb-1.5 text-[15px] font-semibold">{t('groups:add_guest')}</DrawerTitle>
                                <p className="px-1 pb-3.5 text-[13px] leading-relaxed text-muted-foreground">{t('groups:add_guest_hint')}</p>
                                <input
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addGuest()}
                                    placeholder={t('groups:guest_name_placeholder')}
                                    className="h-12.5 w-full rounded-[13px] border border-input bg-background px-3.5 text-[15px] outline-none focus:border-ring"
                                />
                                <button
                                    type="button"
                                    onClick={addGuest}
                                    disabled={!guestName.trim() || adding}
                                    className="mt-3 flex h-12.5 w-full cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-primary text-[15px] font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-50"
                                >
                                    {adding && <Loader2 className="size-4 animate-spin" />}
                                    {t('groups:add')}
                                </button>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </>
            )}

            <div className="mt-4.5 rounded-2xl border border-border bg-card p-4">
                <div className="text-sm font-semibold">{t('groups:invite_title')}</div>
                <div className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{t('groups:invite_hint')}</div>
                <div className="mt-3 flex gap-2">
                    <div className="flex h-11 min-w-0 flex-1 items-center overflow-hidden rounded-[11px] border border-input bg-background px-3 text-[12.5px] text-ellipsis whitespace-nowrap text-muted-foreground">
                        {inviteUrl.replace(/^https?:\/\//, '')}
                    </div>
                    <button
                        type="button"
                        aria-label={t('groups:copy')}
                        onClick={copyInvite}
                        className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-[11px] bg-primary text-primary-foreground"
                    >
                        <Copy className="size-[17px]" />
                    </button>
                </div>
                {copied && <div className="mt-2 text-xs font-medium text-primary">{t('groups:link_copied')}</div>}
            </div>
        </div>
    );
}

function BalancesTab({ group, members, balances }: { group: GroupData; members: MemberData[]; balances: BalanceData[] }) {
    const byMember = new Map(balances.map((b) => [b.member_uuid, b.amount_minor]));
    const rows = members
        .map((m) => ({ member: m, amount: byMember.get(m.uuid) ?? 0 }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {rows.map(({ member, amount }) => (
                <div key={member.uuid} className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0">
                    <MemberAvatar name={member.display_name} avatar={member.avatar} />
                    <div className="flex-1 text-[15px] font-medium">{member.display_name}</div>
                    <div className="text-right">
                        <div
                            className={`text-[14.5px] font-semibold tabular-nums ${
                                amount > 0 ? 'text-emerald-500' : amount < 0 ? 'text-red-400' : 'text-muted-foreground'
                            }`}
                        >
                            {formatMoneySigned(amount, group.currency)}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            {amount > 0 ? t('groups:gets_back') : amount < 0 ? t('groups:owes') : t('groups:even')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
