import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AlertError from '@/components/alert-error';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { ConfirmDrawer } from '@/components/web/confirm-drawer';
import { MemberAvatar } from '@/components/web/member-avatar';
import { Segmented } from '@/components/web/segmented';
import { formatMoney, formatWhole, wholeToMinor } from '@/lib/money';
import type { SharedData } from '@/types';
import type { MemberData } from '@/types/groups';
import { Check, ChevronRight, Loader2, Minus, Plus, Trash2 } from 'lucide-react';

interface ExpenseFormData {
    uuid: string;
    description: string;
    amount_minor: number;
    split_method: 'equal' | 'amounts' | 'shares';
    spent_at: string;
    payer_member: string;
    splits: { member: string; amount_minor: number; units: number | null }[];
}

interface Props {
    group: { uuid: string; name: string; currency: string };
    event: { uuid: string; name: string };
    participants: MemberData[];
    expense?: ExpenseFormData;
}

type SplitMethod = 'equal' | 'amounts' | 'shares';

const today = () => new Date().toISOString().slice(0, 10);

export default function ManageExpense({ group, event, participants, expense }: Props) {
    const { errors } = usePage<SharedData>().props;
    const isEdit = Boolean(expense);
    const baseUrl = `/groups/${group.uuid}/events/${event.uuid}`;

    const [description, setDescription] = useState(expense?.description ?? '');
    // whole units string typed by the user; minor units = whole * 100
    const [amountStr, setAmountStr] = useState(expense ? String(Math.round(expense.amount_minor / 100)) : '');
    const [date, setDate] = useState(expense?.spent_at ?? today());
    const [payer, setPayer] = useState(expense?.payer_member ?? participants.find((p) => p.is_me)?.uuid ?? participants[0]?.uuid);
    const [method, setMethod] = useState<SplitMethod>(expense?.split_method ?? 'equal');
    const [checked, setChecked] = useState<string[]>(expense?.splits.map((s) => s.member) ?? participants.map((p) => p.uuid));
    const [amounts, setAmounts] = useState<Record<string, string>>(() =>
        Object.fromEntries((expense?.splits ?? []).map((s) => [s.member, String(Math.round(s.amount_minor / 100))])),
    );
    const [units, setUnits] = useState<Record<string, number>>(() =>
        Object.fromEntries((expense?.splits ?? []).map((s) => [s.member, s.units ?? 1])),
    );
    const [payerOpen, setPayerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const amountMinor = wholeToMinor(amountStr);
    const payerMember = participants.find((p) => p.uuid === payer);

    const toggle = (uuid: string) => {
        setChecked((prev) => {
            if (!prev.includes(uuid)) return [...prev, uuid];
            if (prev.length === 1) return prev;
            return prev.filter((p) => p !== uuid);
        });
    };

    // live preview of each member's share, mirroring the backend splitter
    const previewFor = (uuid: string): number => {
        if (!checked.includes(uuid) || amountMinor === 0) return 0;
        if (method === 'amounts') return wholeToMinor(amounts[uuid] ?? '');
        if (method === 'shares') {
            const totalUnits = checked.reduce((sum, id) => sum + (units[id] ?? 1), 0);
            return Math.round((amountMinor * (units[uuid] ?? 1)) / totalUnits);
        }
        return Math.round(amountMinor / checked.length);
    };

    const amountsSum = checked.reduce((sum, id) => sum + wholeToMinor(amounts[id] ?? ''), 0);
    const amountsMismatch = method === 'amounts' && amountMinor > 0 && amountsSum !== amountMinor;

    const canSave =
        !loading && amountMinor > 0 && description.trim().length > 0 && checked.length > 0 && !amountsMismatch;

    const submit = () => {
        if (!canSave) return;
        setLoading(true);
        const splits = checked.map((uuid) => ({
            member: uuid,
            amount_minor: method === 'amounts' ? wholeToMinor(amounts[uuid] ?? '') : undefined,
            units: method === 'shares' ? (units[uuid] ?? 1) : undefined,
        }));
        const url = isEdit ? `${baseUrl}/expenses/${expense!.uuid}` : `${baseUrl}/expenses`;
        router.post(
            url,
            {
                description: description.trim(),
                amount_minor: amountMinor,
                split_method: method,
                spent_at: date,
                payer_member: payer,
                splits,
            },
            { onFinish: () => setLoading(false) },
        );
    };

    return (
        <div className="min-h-dvh bg-background text-foreground">
            <Head title={isEdit ? t('groups:edit_expense') : t('groups:new_expense')} />
            <div className="mx-auto w-full max-w-md px-4 pb-10">
                <div className="flex items-center justify-between py-4">
                    <button
                        type="button"
                        onClick={() => router.visit(baseUrl)}
                        className="cursor-pointer p-1 text-[14.5px] text-muted-foreground"
                    >
                        {t('common:cancel')}
                    </button>
                    <span className="text-[15px] font-semibold">{isEdit ? t('groups:edit_expense') : t('groups:new_expense')}</span>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!canSave}
                        className={`flex cursor-pointer items-center gap-1.5 p-1 text-[14.5px] font-semibold ${canSave ? 'text-primary' : 'text-muted-foreground/60'}`}
                    >
                        {loading && <Loader2 className="size-4 animate-spin" />}
                        {t('common:save')}
                    </button>
                </div>

                {Object.keys(errors).length > 0 && <AlertError errors={Object.values(errors)} />}

                <div className="py-3 pb-5 text-center">
                    <div className="mb-1.5 text-xs text-muted-foreground">
                        {t('groups:amount')} ({group.currency})
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-[34px] font-semibold text-muted-foreground">$</span>
                        <input
                            value={amountStr ? formatWhole(amountStr) : ''}
                            onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9]/g, ''))}
                            inputMode="numeric"
                            placeholder="0"
                            className="w-48 border-none bg-transparent text-center text-[46px] font-bold tracking-tight tabular-nums outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="border-b border-border px-3.5 py-3">
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('groups:expense_placeholder')}
                            className="w-full border-none bg-transparent text-[15px] outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setPayerOpen(true)}
                        className="flex w-full cursor-pointer items-center justify-between border-b border-border px-3.5 py-3"
                    >
                        <span className="text-sm text-muted-foreground">{t('groups:paid_by_label')}</span>
                        <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                            {payerMember && <MemberAvatar name={payerMember.display_name} avatar={payerMember.avatar} size="sm" />}
                            {payerMember?.display_name}
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </span>
                    </button>
                    <div className="flex items-center justify-between px-3.5 py-2">
                        <span className="text-sm text-muted-foreground">{t('groups:date')}</span>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-none bg-transparent text-right text-[14.5px] font-semibold outline-none"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <div className="mb-2 px-1 text-[13px] font-semibold">{t('groups:split_how')}</div>
                    <Segmented
                        value={method}
                        onChange={(v) => setMethod(v as SplitMethod)}
                        options={[
                            { value: 'equal', label: t('groups:split_equal') },
                            { value: 'amounts', label: t('groups:split_amounts') },
                            { value: 'shares', label: t('groups:split_shares') },
                        ]}
                    />
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
                    {participants.map((member) => {
                        const isChecked = checked.includes(member.uuid);
                        return (
                            <div key={member.uuid} className="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
                                <button
                                    type="button"
                                    onClick={() => toggle(member.uuid)}
                                    aria-label={member.display_name}
                                    className={`flex size-5.5 flex-none cursor-pointer items-center justify-center rounded-[7px] border-[1.5px] ${
                                        isChecked ? 'border-primary bg-primary' : 'border-border bg-transparent'
                                    }`}
                                >
                                    <Check className={`size-3.5 text-primary-foreground ${isChecked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                                </button>
                                <MemberAvatar name={member.display_name} avatar={member.avatar} size="sm" />
                                <span className="flex-1 text-[14.5px] font-medium">{member.display_name}</span>

                                {method === 'amounts' && isChecked ? (
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="text-muted-foreground">$</span>
                                        <input
                                            value={amounts[member.uuid] ?? ''}
                                            onChange={(e) =>
                                                setAmounts((prev) => ({ ...prev, [member.uuid]: e.target.value.replace(/[^0-9]/g, '') }))
                                            }
                                            inputMode="numeric"
                                            placeholder="0"
                                            className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-right text-sm tabular-nums outline-none focus:border-ring"
                                        />
                                    </div>
                                ) : method === 'shares' && isChecked ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            aria-label="-"
                                            onClick={() => setUnits((prev) => ({ ...prev, [member.uuid]: Math.max(1, (prev[member.uuid] ?? 1) - 1) }))}
                                            className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-border"
                                        >
                                            <Minus className="size-3.5" />
                                        </button>
                                        <span className="w-4 text-center text-sm font-semibold tabular-nums">{units[member.uuid] ?? 1}</span>
                                        <button
                                            type="button"
                                            aria-label="+"
                                            onClick={() => setUnits((prev) => ({ ...prev, [member.uuid]: (prev[member.uuid] ?? 1) + 1 }))}
                                            className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-border"
                                        >
                                            <Plus className="size-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`text-[13.5px] font-semibold tabular-nums ${isChecked ? '' : 'text-muted-foreground/50'}`}>
                                        {isChecked ? formatMoney(previewFor(member.uuid), group.currency) : '-'}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    <div className="flex items-center justify-between bg-secondary px-3.5 py-3">
                        <span className={`text-[13px] ${amountsMismatch ? 'font-semibold text-red-400' : 'text-muted-foreground'}`}>
                            {amountsMismatch
                                ? t('groups:amounts_mismatch', { total: formatMoney(amountsSum, group.currency) })
                                : t('groups:people_count', { count: checked.length })}
                        </span>
                        <span className="text-[15px] font-bold tabular-nums">{formatMoney(amountMinor, group.currency)}</span>
                    </div>
                </div>

                {isEdit && (
                    <ConfirmDrawer
                        onConfirm={() =>
                            new Promise<void>((resolve) =>
                                router.delete(`${baseUrl}/expenses/${expense!.uuid}`, { onFinish: () => resolve() }),
                            )
                        }
                        title={t('groups:delete_expense')}
                        description={t('groups:delete_expense_hint')}
                    >
                        <button
                            type="button"
                            className="mt-5 flex h-12.5 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[14.5px] font-semibold text-red-500 active:scale-[0.98]"
                        >
                            <Trash2 className="size-4" />
                            {t('groups:delete_expense')}
                        </button>
                    </ConfirmDrawer>
                )}

                <Drawer open={payerOpen} onOpenChange={setPayerOpen}>
                    <DrawerContent>
                        <div className="p-4 pb-8">
                            <DrawerTitle className="px-1 pb-3 text-[15px] font-semibold">{t('groups:who_paid')}</DrawerTitle>
                            <div className="flex flex-col">
                                {participants.map((member) => (
                                    <button
                                        key={member.uuid}
                                        type="button"
                                        onClick={() => {
                                            setPayer(member.uuid);
                                            setPayerOpen(false);
                                        }}
                                        className="flex cursor-pointer items-center gap-3 border-b border-border px-2 py-3 text-left last:border-b-0"
                                    >
                                        <MemberAvatar name={member.display_name} avatar={member.avatar} />
                                        <span className="flex-1 text-[15px] font-medium">{member.display_name}</span>
                                        <Check className={`size-[18px] text-primary ${member.uuid === payer ? 'opacity-100' : 'opacity-0'}`} strokeWidth={2.4} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}
