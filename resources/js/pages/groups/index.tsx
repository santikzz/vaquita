import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { AppShell } from '@/components/web/app-shell';
import { MemberAvatar } from '@/components/web/member-avatar';
import type { GroupListItem } from '@/types/groups';
import { Plus, UserPlus, Users, Zap } from 'lucide-react';

interface Props {
    groups: GroupListItem[];
}

export default function GroupsIndex({ groups }: Props) {
    const [fabOpen, setFabOpen] = useState(false);

    return (
        <AppShell title={t('groups:tab_groups')} tab="groups">
            {groups.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="flex flex-col gap-3">
                    {groups.map((group) => (
                        <Link
                            key={group.uuid}
                            href={`/groups/${group.uuid}`}
                            className="block rounded-2xl border border-border bg-card p-4 text-left transition-transform active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between gap-2.5">
                                <div className="text-[16.5px] font-semibold tracking-tight">{group.name}</div>
                                {group.open_events_count > 0 && (
                                    <span className="flex-none rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                                        {t('groups:open_event')}
                                    </span>
                                )}
                            </div>
                            <div className="mt-0.5 text-[13px] text-muted-foreground">
                                {t('groups:members_count', { count: group.members.length })}
                            </div>
                            <div className="mt-3.5 flex pl-2">
                                {group.members.slice(0, 5).map((member) => (
                                    <MemberAvatar
                                        key={member.uuid}
                                        name={member.display_name}
                                        avatar={member.avatar}
                                        size="sm"
                                        className="-ml-2 ring-2 ring-card"
                                    />
                                ))}
                                {group.members.length > 5 && (
                                    <div className="-ml-2 flex size-7 items-center justify-center rounded-full border border-border bg-secondary text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
                                        +{group.members.length - 5}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="mt-5 flex flex-col gap-2.5">
                <Drawer open={fabOpen} onOpenChange={setFabOpen}>
                    <DrawerTrigger asChild>
                        <button
                            type="button"
                            className="flex h-13 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground"
                        >
                            <Plus className="size-[18px]" strokeWidth={2.4} />
                            {t('groups:new_group')}
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerTitle className="sr-only">{t('groups:new_group')}</DrawerTitle>
                        <div className="flex flex-col gap-2.5 p-4 pb-8">
                            <button
                                type="button"
                                onClick={() => router.visit('/groups/create')}
                                className="flex cursor-pointer items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left"
                            >
                                <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                    <UserPlus className="size-5" />
                                </span>
                                <span>
                                    <span className="block text-[15px] font-semibold">{t('groups:new_group')}</span>
                                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{t('groups:new_group_hint')}</span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit('/groups/quick')}
                                className="flex cursor-pointer items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left"
                            >
                                <span className="flex size-10 flex-none items-center justify-center rounded-xl border border-border bg-secondary">
                                    <Zap className="size-5" />
                                </span>
                                <span>
                                    <span className="block text-[15px] font-semibold">{t('groups:quick_split')}</span>
                                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{t('groups:quick_split_hint')}</span>
                                </span>
                            </button>
                        </div>
                    </DrawerContent>
                </Drawer>
                <Link
                    href="/groups/quick"
                    className="flex h-12 items-center justify-center rounded-2xl border border-border bg-card text-[14.5px] font-semibold"
                >
                    {t('groups:quick_split')}
                </Link>
            </div>
        </AppShell>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center px-8 pt-14 pb-6 text-center">
            <div className="mb-4 flex size-15 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
                <Users className="size-6" />
            </div>
            <div className="text-base font-semibold">{t('groups:empty_title')}</div>
            <div className="mt-1.5 max-w-60 text-[13.5px] leading-relaxed text-muted-foreground">{t('groups:empty_hint')}</div>
        </div>
    );
}
