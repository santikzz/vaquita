import { Head, Link, router, usePage } from '@inertiajs/react';
import { type ReactNode, useEffect, useState } from 'react';
import { MemberAvatar } from '@/components/web/member-avatar';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Activity, ArrowLeft, Loader2, Plus, User as UserIcon, Users } from 'lucide-react';

type Tab = 'groups' | 'activity' | 'profile';

interface Props {
    title?: string;
    /** top-level page: big title + avatar, bottom nav highlights this tab */
    tab?: Tab;
    /** sub-page: back arrow to this url */
    back?: string;
    /** small context label shown next to the back arrow */
    context?: string;
    /** replaces the default header entirely (e.g. group/event heads render their own) */
    header?: ReactNode;
    /** show the bottom tab bar even without a top-level tab (group screen) */
    showTabBar?: boolean;
    children: ReactNode;
}

export function AppShell({ title, tab, back, context, header, showTabBar, children }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-dvh bg-background text-foreground">
            <Head title={title ?? 'Dividir'} />
            <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
                {header ?? (
                    <div className="flex flex-none items-center justify-between px-4 pt-4 pb-3">
                        {tab ? (
                            <>
                                <span className="text-[26px] font-bold tracking-tight">{title}</span>
                                {tab !== 'profile' && (
                                    <Link href="/profile" prefetch="mount" aria-label={t('groups:profile')} className="active:scale-95">
                                        <MemberAvatar name={auth.user.name} avatar={auth.user.avatar} />
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <BackButton href={back ?? '/groups'} />
                                {context && <span className="text-xs text-muted-foreground">{context}</span>}
                            </>
                        )}
                    </div>
                )}

                <main className={cn('flex flex-1 flex-col px-4 pb-8', (tab || showTabBar) && 'pb-28')}>{children}</main>

                {(tab || showTabBar) && <BottomNav active={tab} />}
            </div>
        </div>
    );
}

export function BackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            prefetch="mount"
            aria-label={t('common:back')}
            className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground active:scale-95"
        >
            <ArrowLeft className="size-5" />
        </Link>
    );
}

/** floating action button, kept inside the max-w-md column on desktop */
export function Fab({ href, label, aboveTabBar }: { href: string; label: string; aboveTabBar?: boolean }) {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto h-0 w-full max-w-md">
            <Link
                href={href}
                prefetch="mount"
                className={cn(
                    'pointer-events-auto absolute right-5 flex h-13 items-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-xl transition-transform active:scale-95',
                    aboveTabBar ? 'bottom-[92px]' : 'bottom-6',
                )}
            >
                <Plus className="size-5" strokeWidth={2.6} />
                {label}
            </Link>
        </div>
    );
}

function BottomNav({ active }: { active?: Tab }) {
    const [pendingTab, setPendingTab] = useState<Tab | null>(null);

    const items: { tab: Tab; href: string; icon: typeof Users; label: string }[] = [
        { tab: 'groups', href: '/groups', icon: Users, label: t('groups:tab_groups') },
        { tab: 'activity', href: '/activity', icon: Activity, label: t('groups:tab_activity') },
        { tab: 'profile', href: '/profile', icon: UserIcon, label: t('groups:tab_profile') },
    ];

    useEffect(() => {
        const off = router.on('finish', () => setPendingTab(null));
        items.forEach(({ href }) => router.prefetch(href, { method: 'get' }, { cacheFor: '1m' }));
        return off;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto flex w-full max-w-md px-2 pt-2 pb-3">
                {items.map(({ tab, href, icon: Icon, label }) => {
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                if (tab === active) return;
                                setPendingTab(tab);
                                router.visit(href);
                            }}
                            className={cn(
                                'flex flex-1 cursor-pointer flex-col items-center gap-1 transition-colors active:scale-95',
                                tab === active ? 'text-primary' : 'text-muted-foreground',
                            )}
                        >
                            <Icon className="size-[22px]" />
                            <span className="text-[11px] font-semibold">{label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
