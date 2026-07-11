import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { AppShell, BackButton, Fab } from '@/components/web/app-shell';
import { MemberAvatar } from '@/components/web/member-avatar';
import { Segmented } from '@/components/web/segmented';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatMoney, formatMoneySigned } from '@/lib/money';
import type {
    BalanceData,
    EventData,
    ExpenseData,
    MemberData,
    SettlementData,
    TransferData,
} from '@/types/groups';
import { ArrowRight, Check, CheckCircle2, Copy, HandCoins, SquarePen, ReceiptText, Scale, Trash2 } from 'lucide-react';

interface Props {
    group: { uuid: string; name: string; currency: string };
    event: EventData;
    participants: MemberData[];
    expenses: ExpenseData[];
    settlements: SettlementData[];
    balances: BalanceData[];
    transfers: TransferData[];
}

type Tab = 'expenses' | 'balances' | 'settle';

export default function EventShow({ group, event, participants, expenses, settlements, balances, transfers }: Props) {
    const [tab, setTab] = useState<Tab>('expenses');
    const membersByUuid = new Map(participants.map((m) => [m.uuid, m]));
    const total = expenses.reduce((sum, e) => sum + e.amount_minor, 0);
    const baseUrl = `/groups/${group.uuid}/events/${event.uuid}`;

    return (
        <AppShell
            title={event.name}
            header={
                <div className="flex-none px-4 pt-4 pb-1.5">
                    <div className="mb-3 flex items-center justify-between">
                        <BackButton href={`/groups/${group.uuid}`} />
                        <span className="text-xs text-muted-foreground">{group.name}</span>
                        {event.can_manage ? (
                            <Link
                                href={`${baseUrl}/edit`}
                                prefetch="mount"
                                aria-label={t('groups:edit_event')}
                                className="flex size-10 items-center justify-center rounded-xl border border-border"
                            >
                                <SquarePen className="size-[18px]" />
                            </Link>
                        ) : (
                            <span className="size-10" />
                        )}
                    </div>
                    <div className="px-1 pb-1">
                        <h1 className="text-[23px] font-bold tracking-tight">{event.name}</h1>
                        <div className="mt-0.5 text-[13px] text-muted-foreground">
                            {event.event_date} · {t('groups:total')} {formatMoney(total, group.currency)}
                        </div>
                    </div>
                    <Segmented
                        className="mt-3.5"
                        value={tab}
                        onChange={(v) => setTab(v as Tab)}
                        options={[
                            { value: 'expenses', label: t('groups:tab_expenses'), icon: ReceiptText },
                            { value: 'balances', label: t('groups:tab_balances'), icon: Scale },
                            { value: 'settle', label: t('groups:tab_settle'), icon: HandCoins },
                        ]}
                    />
                </div>
            }
        >
            {tab === 'expenses' && <ExpensesTab group={group} baseUrl={baseUrl} expenses={expenses} />}
            {tab === 'balances' && <BalancesTab group={group} participants={participants} balances={balances} />}
            {tab === 'settle' && (
                <SettleTab
                    group={group}
                    baseUrl={baseUrl}
                    membersByUuid={membersByUuid}
                    myUuid={participants.find((m) => m.is_me)?.uuid}
                    transfers={transfers}
                    settlements={settlements}
                    hasExpenses={expenses.length > 0}
                />
            )}

            <Fab href={`${baseUrl}/expenses/create`} label={t('groups:expense')} />
        </AppShell>
    );
}

function ExpensesTab({ group, baseUrl, expenses }: { group: { currency: string }; baseUrl: string; expenses: ExpenseData[] }) {
    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center px-8 pt-14 pb-10 text-center">
                <div className="mb-4 flex size-15 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
                    <ReceiptText className="size-6" />
                </div>
                <div className="text-base font-semibold">{t('groups:no_expenses_title')}</div>
                <div className="mt-1.5 max-w-60 text-[13.5px] leading-relaxed text-muted-foreground">{t('groups:no_expenses_hint')}</div>
            </div>
        );
    }

    const byDay = new Map<string, ExpenseData[]>();
    [...expenses]
        .sort((a, b) => b.spent_at.localeCompare(a.spent_at))
        .forEach((e) => byDay.set(e.spent_at, [...(byDay.get(e.spent_at) ?? []), e]));

    return (
        <div className="pt-2">
            {[...byDay.entries()].map(([day, rows]) => (
                <div key={day} className="mb-4">
                    <div className="px-1 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{day}</div>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        {rows.map((expense) => (
                            <Link
                                key={expense.uuid}
                                href={`${baseUrl}/expenses/${expense.uuid}/edit`}
                                prefetch="mount"
                                className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-b-0"
                            >
                                <MemberAvatar name={expense.payer.display_name} />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[14.5px] font-semibold">{expense.description}</div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        {t('groups:paid_by', { name: expense.payer.display_name })} · {t('groups:people_count', { count: expense.shares.length })}
                                    </div>
                                </div>
                                <span className="text-[15px] font-semibold tabular-nums">{formatMoney(expense.amount_minor, group.currency)}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function BalancesTab({ group, participants, balances }: { group: { currency: string }; participants: MemberData[]; balances: BalanceData[] }) {
    const byMember = new Map(balances.map((b) => [b.member_uuid, b.amount_minor]));
    const rows = participants
        .map((m) => ({ member: m, amount: byMember.get(m.uuid) ?? 0 }))
        .sort((a, b) => b.amount - a.amount);
    const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.amount)));

    return (
        <div className="flex flex-col gap-2.5 pt-2">
            {rows.map(({ member, amount }) => {
                const color = amount > 0 ? 'text-emerald-500' : amount < 0 ? 'text-red-400' : 'text-muted-foreground';
                const bar = amount > 0 ? 'bg-emerald-500' : amount < 0 ? 'bg-red-400' : 'bg-muted-foreground';
                return (
                    <div key={member.uuid} className="rounded-2xl border border-border bg-card px-3.5 py-3">
                        <div className="flex items-center gap-3">
                            <MemberAvatar name={member.display_name} avatar={member.avatar} size="sm" />
                            <div className="flex-1 text-[14.5px] font-semibold">{member.display_name}</div>
                            <div className="text-right">
                                <div className={`text-[14.5px] font-semibold tabular-nums ${color}`}>
                                    {formatMoneySigned(amount, group.currency)}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    {amount > 0 ? t('groups:gets_back') : amount < 0 ? t('groups:owes') : t('groups:even')}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                            <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.round((Math.abs(amount) / maxAbs) * 100)}%` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface SettleTabProps {
    group: { uuid: string; currency: string };
    baseUrl: string;
    membersByUuid: Map<string, MemberData>;
    myUuid?: string;
    transfers: TransferData[];
    settlements: SettlementData[];
    hasExpenses: boolean;
}

function SettleTab({ group, baseUrl, membersByUuid, myUuid, transfers: initialTransfers, settlements: initialSettlements, hasExpenses }: SettleTabProps) {
    const [transfers, setTransfers] = useState(initialTransfers);
    const [settlements, setSettlements] = useState(initialSettlements);
    // suggestions paid this session stay visible as disabled "paid" cards
    const [paid, setPaid] = useState<TransferData[]>([]);
    const [confirm, setConfirm] = useState<TransferData | null>(null);
    const posting = useRef(false);
    const [, copy] = useClipboard();
    const [copied, setCopied] = useState(false);
    const [copiedAlias, setCopiedAlias] = useState<string | null>(null);

    // keep local lists in sync with server props after each reconcile
    useEffect(() => setTransfers(initialTransfers), [initialTransfers]);
    useEffect(() => setSettlements(initialSettlements), [initialSettlements]);

    const name = (uuid: string) => membersByUuid.get(uuid)?.display_name ?? '?';
    const toMember = confirm ? membersByUuid.get(confirm.to_member_uuid) : null;

    const isMine = (t: TransferData) => t.from_member_uuid === myUuid;
    const mineUnpaid = transfers.filter(isMine);
    const othersUnpaid = transfers.filter((t) => !isMine(t));
    const minePaid = paid.filter(isMine);
    const othersPaid = paid.filter((t) => !isMine(t));
    const allSettled = transfers.length === 0 && paid.length === 0 && hasExpenses;

    const copyCardAlias = async (memberUuid: string) => {
        const alias = membersByUuid.get(memberUuid)?.payment_alias;
        if (!alias) return;
        await copy(alias);
        setCopiedAlias(memberUuid);
        setTimeout(() => setCopiedAlias((prev) => (prev === memberUuid ? null : prev)), 1600);
    };

    const confirmPayment = () => {
        if (!confirm || posting.current) return;
        posting.current = true;
        const transfer = confirm;

        const optimistic: SettlementData = {
            uuid: `temp-${crypto.randomUUID()}`,
            amount_minor: transfer.amount_minor,
            note: null,
            settled_at: '',
            from: { uuid: transfer.from_member_uuid, display_name: name(transfer.from_member_uuid) },
            to: { uuid: transfer.to_member_uuid, display_name: name(transfer.to_member_uuid) },
        };
        // record the payment and flip the suggestion to its paid state right away
        setSettlements((prev) => [optimistic, ...prev]);
        setTransfers((prev) => prev.filter((t) => t !== transfer));
        setPaid((prev) => [...prev, transfer]);
        setConfirm(null);

        router.post(
            `${baseUrl}/settlements`,
            {
                from_member: transfer.from_member_uuid,
                to_member: transfer.to_member_uuid,
                amount_minor: transfer.amount_minor,
            },
            {
                preserveScroll: true,
                only: ['settlements', 'balances', 'transfers', 'event'],
                onError: () => {
                    setSettlements((prev) => prev.filter((s) => s.uuid !== optimistic.uuid));
                    setPaid((prev) => prev.filter((t) => t !== transfer));
                    setTransfers((prev) => [...prev, transfer]);
                },
                onFinish: () => {
                    posting.current = false;
                },
            },
        );
    };

    // deleting a recorded payment revives the suggestion, so drop its paid card
    const dropPaidCard = (settlement: SettlementData) => {
        setPaid((prev) => {
            const index = prev.findIndex(
                (t) =>
                    t.from_member_uuid === settlement.from.uuid &&
                    t.to_member_uuid === settlement.to.uuid &&
                    t.amount_minor === settlement.amount_minor,
            );
            return index === -1 ? prev : prev.filter((_, i) => i !== index);
        });
    };

    const copyAlias = async () => {
        if (!toMember?.payment_alias) return;
        await copy(toMember.payment_alias);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

    const transferCard = (transfer: TransferData, key: string, options: { paid?: boolean; dimmed?: boolean } = {}) => {
        const receiver = membersByUuid.get(transfer.to_member_uuid);
        return (
            <div
                key={key}
                className={`rounded-2xl border border-border bg-card p-3.5 ${options.paid ? 'opacity-70' : options.dimmed ? 'opacity-80' : ''}`}
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex flex-none -space-x-1.5">
                        <MemberAvatar name={name(transfer.from_member_uuid)} size="sm" className="ring-2 ring-card" />
                        <MemberAvatar name={name(transfer.to_member_uuid)} size="sm" className="ring-2 ring-card" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium">
                        <span className="truncate">{name(transfer.from_member_uuid)}</span>
                        <ArrowRight className="size-4 flex-none text-muted-foreground" />
                        <span className="truncate">{name(transfer.to_member_uuid)}</span>
                    </div>
                    {options.paid && <CheckCircle2 className="size-4 flex-none text-emerald-500" />}
                    <span className="flex-none text-[15px] font-semibold tabular-nums">
                        {formatMoney(transfer.amount_minor, group.currency)}
                    </span>
                </div>

                {!options.paid && receiver?.payment_alias && (
                    <button
                        type="button"
                        onClick={() => copyCardAlias(transfer.to_member_uuid)}
                        className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-[11px] border border-border bg-background px-3 py-2.5 text-left active:scale-[0.98]"
                    >
                        <span className="min-w-0">
                            <span className="block text-[10.5px] text-muted-foreground uppercase tracking-wide">
                                {t('groups:payment_alias')}
                            </span>
                            <span className="block truncate text-[13.5px] font-semibold select-all">
                                {receiver.payment_alias}
                            </span>
                        </span>
                        {copiedAlias === transfer.to_member_uuid ? (
                            <Check className="size-4 flex-none text-emerald-500" />
                        ) : (
                            <Copy className="size-4 flex-none text-muted-foreground" />
                        )}
                    </button>
                )}

                {options.paid ? (
                    <button
                        type="button"
                        disabled
                        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[11px] border border-border text-[13.5px] font-semibold text-muted-foreground"
                    >
                        <Check className="size-4 text-emerald-500" />
                        {t('groups:paid')}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setConfirm(transfer)}
                        className={`mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] text-[13.5px] font-semibold active:scale-[0.98] ${
                            options.dimmed ? 'bg-secondary text-muted-foreground' : 'bg-primary text-primary-foreground'
                        }`}
                    >
                        <HandCoins className="size-4" />
                        {t('groups:pay')}
                    </button>
                )}
            </div>
        );
    };

    const transferKey = (t: TransferData, i: number) => `${t.from_member_uuid}|${t.to_member_uuid}|${t.amount_minor}|${i}`;

    return (
        <div className="pt-2">
            {allSettled && (
                <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
                    <div className="mb-4 flex size-15 items-center justify-center rounded-full border border-border bg-secondary text-emerald-500">
                        <Check className="size-7" strokeWidth={2.2} />
                    </div>
                    <div className="text-[17px] font-bold">{t('groups:all_settled_title')}</div>
                    <div className="mt-1.5 max-w-62 text-[13.5px] leading-relaxed text-muted-foreground">{t('groups:all_settled_hint')}</div>
                </div>
            )}

            {mineUnpaid.length + minePaid.length > 0 && (
                <>
                    <div className="px-1 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('groups:your_payments')}</div>
                    <div className="flex flex-col gap-2.5">
                        {mineUnpaid.map((transfer, i) => transferCard(transfer, transferKey(transfer, i)))}
                        {minePaid.map((transfer, i) => transferCard(transfer, `paid-${transferKey(transfer, i)}`, { paid: true }))}
                    </div>
                </>
            )}

            {othersUnpaid.length + othersPaid.length > 0 && (
                <>
                    <div className={`flex items-center gap-3 px-1 pb-2 ${mineUnpaid.length + minePaid.length > 0 ? 'mt-5' : ''}`}>
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('groups:between_others')}</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {othersUnpaid.map((transfer, i) => transferCard(transfer, transferKey(transfer, i), { dimmed: true }))}
                        {othersPaid.map((transfer, i) => transferCard(transfer, `paid-${transferKey(transfer, i)}`, { paid: true, dimmed: true }))}
                    </div>
                </>
            )}

            {settlements.length > 0 && (
                <div className="mt-5">
                    <div className="px-1 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('groups:payments_recorded')}</div>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        {settlements.map((settlement) => (
                            <div key={settlement.uuid} className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-b-0">
                                <div className="flex size-8 flex-none items-center justify-center rounded-full border border-border bg-secondary text-emerald-500">
                                    <CheckCircle2 className="size-4" />
                                </div>
                                <div className="flex-1 text-[13.5px] font-medium">
                                    {t('groups:paid_to', { from: settlement.from.display_name, to: settlement.to.display_name })}
                                </div>
                                <div className="text-right">
                                    <div className="text-[13.5px] font-semibold tabular-nums">{formatMoney(settlement.amount_minor, group.currency)}</div>
                                    <div className="text-[11px] text-muted-foreground">{settlement.settled_at}</div>
                                </div>
                                <button
                                    type="button"
                                    aria-label={t('common:delete')}
                                    onClick={() => {
                                        const removed = settlement;
                                        setSettlements((prev) => prev.filter((s) => s.uuid !== removed.uuid));
                                        dropPaidCard(removed);
                                        router.delete(`${baseUrl}/settlements/${removed.uuid}`, {
                                            preserveScroll: true,
                                            only: ['settlements', 'balances', 'transfers', 'event'],
                                            onError: () => setSettlements((prev) => [removed, ...prev]),
                                        });
                                    }}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:text-red-500"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Drawer open={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
                <DrawerContent>
                    {confirm && (
                        <div className="p-4 pb-8 text-center">
                            <DrawerTitle className="text-[15px] font-semibold">{t('groups:record_payment')}</DrawerTitle>
                            <div className="my-5 flex items-center justify-center gap-3.5">
                                <div className="text-center">
                                    <MemberAvatar name={name(confirm.from_member_uuid)} size="lg" className="mx-auto mb-1.5" />
                                    <div className="text-[12.5px] text-muted-foreground">{name(confirm.from_member_uuid)}</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xl font-bold tabular-nums">{formatMoney(confirm.amount_minor, group.currency)}</span>
                                    <ArrowRight className="size-5 text-primary" />
                                </div>
                                <div className="text-center">
                                    <MemberAvatar name={name(confirm.to_member_uuid)} size="lg" className="mx-auto mb-1.5" />
                                    <div className="text-[12.5px] text-muted-foreground">{name(confirm.to_member_uuid)}</div>
                                </div>
                            </div>

                            {toMember?.payment_alias && (
                                <button
                                    type="button"
                                    onClick={copyAlias}
                                    className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-[13px] border border-border bg-secondary px-3.5 py-3 text-left"
                                >
                                    <span className="min-w-0">
                                        <span className="block text-[11px] text-muted-foreground">{t('groups:payment_alias')}</span>
                                        <span className="block truncate text-[13.5px] font-semibold">{toMember.payment_alias}</span>
                                    </span>
                                    {copied ? <Check className="size-[17px] flex-none text-emerald-500" /> : <Copy className="size-[17px] flex-none text-muted-foreground" />}
                                </button>
                            )}

                            <div className="flex gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setConfirm(null)}
                                    className="h-12.5 flex-1 cursor-pointer rounded-[13px] border border-border bg-secondary text-[14.5px] font-semibold active:scale-[0.98]"
                                >
                                    {t('common:cancel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmPayment}
                                    className="flex h-12.5 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-primary text-[14.5px] font-semibold text-primary-foreground active:scale-[0.98]"
                                >
                                    {t('groups:confirm_payment')}
                                </button>
                            </div>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
