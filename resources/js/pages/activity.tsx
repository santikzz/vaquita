import { AppShell } from '@/components/web/app-shell';
import { formatMoney } from '@/lib/money';
import { Activity as ActivityIcon, CheckCircle2, ReceiptText } from 'lucide-react';

interface ActivityItem {
    type: 'expense' | 'settlement';
    actor: string;
    target?: string;
    description?: string;
    amount_minor: number;
    currency: string;
    group_name: string;
    event_name: string;
    created_at: string;
}

interface Props {
    items: ActivityItem[];
}

export default function Activity({ items }: Props) {
    return (
        <AppShell title={t('groups:tab_activity')} tab="activity">
            {items.length === 0 ? (
                <div className="flex flex-col items-center px-8 pt-14 text-center">
                    <div className="mb-4 flex size-15 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
                        <ActivityIcon className="size-6" />
                    </div>
                    <div className="text-base font-semibold">{t('groups:no_activity_title')}</div>
                    <div className="mt-1.5 max-w-60 text-[13.5px] leading-relaxed text-muted-foreground">{t('groups:no_activity_hint')}</div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3">
                            <div
                                className={`flex size-9.5 flex-none items-center justify-center rounded-xl border border-border bg-secondary ${
                                    item.type === 'settlement' ? 'text-emerald-500' : 'text-muted-foreground'
                                }`}
                            >
                                {item.type === 'settlement' ? <CheckCircle2 className="size-[18px]" /> : <ReceiptText className="size-[18px]" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">
                                    {item.type === 'expense'
                                        ? t('groups:activity_expense', { name: item.actor, description: item.description })
                                        : t('groups:paid_to', { from: item.actor, to: item.target })}
                                </div>
                                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                    {item.group_name} · {item.event_name} · {new Date(item.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <span
                                className={`text-[13.5px] font-semibold tabular-nums ${
                                    item.type === 'settlement' ? 'text-emerald-500' : 'text-muted-foreground'
                                }`}
                            >
                                {formatMoney(item.amount_minor, item.currency)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </AppShell>
    );
}
