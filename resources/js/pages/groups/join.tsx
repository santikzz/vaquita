import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { AppShell } from '@/components/web/app-shell';
import { MemberAvatar } from '@/components/web/member-avatar';
import type { MemberData } from '@/types/groups';
import { Check, Loader2 } from 'lucide-react';

interface Props {
    code: string;
    group: { name: string; currency: string; members: MemberData[] };
    claimable: MemberData[];
}

export default function JoinGroup({ code, group, claimable }: Props) {
    const [claimOpen, setClaimOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const join = (memberUuid?: string) => {
        setLoading(true);
        router.post(`/join/${code}`, memberUuid ? { member_uuid: memberUuid } : {}, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppShell title={t('groups:join_title')} back="/groups">
            <div className="flex flex-col items-center px-2 pt-6 text-center">
                <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('groups:invited_to')}</div>
                <h1 className="mt-2 text-[26px] font-bold tracking-tight">{group.name}</h1>
                <div className="mt-1 text-[13.5px] text-muted-foreground">
                    {t('groups:members_count', { count: group.members.length })}
                </div>

                <div className="mt-5 flex pl-2.5">
                    {group.members.slice(0, 6).map((member) => (
                        <MemberAvatar
                            key={member.uuid}
                            name={member.display_name}
                            avatar={member.avatar}
                            size="lg"
                            className="-ml-2.5 ring-2 ring-background"
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => join()}
                    disabled={loading}
                    className="mt-8 flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-50"
                >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {t('groups:join_button')}
                </button>

                {claimable.length > 0 && (
                    <div className="mt-3.5 w-full rounded-2xl border border-border bg-card p-4 text-left">
                        <div className="text-[13.5px] font-semibold">{t('groups:claim_title')}</div>
                        <div className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{t('groups:claim_hint')}</div>
                        <button
                            type="button"
                            onClick={() => setClaimOpen(true)}
                            className="mt-3 h-11 w-full cursor-pointer rounded-[11px] border border-border bg-secondary text-[13.5px] font-semibold"
                        >
                            {t('groups:claim_button')}
                        </button>
                    </div>
                )}
            </div>

            <Drawer open={claimOpen} onOpenChange={setClaimOpen}>
                <DrawerContent>
                    <div className="p-4 pb-8">
                        <DrawerTitle className="px-1 pb-3 text-[15px] font-semibold">{t('groups:claim_pick')}</DrawerTitle>
                        <div className="flex flex-col">
                            {claimable.map((member) => (
                                <button
                                    key={member.uuid}
                                    type="button"
                                    onClick={() => join(member.uuid)}
                                    className="flex cursor-pointer items-center gap-3 border-b border-border px-2 py-3 text-left last:border-b-0"
                                >
                                    <MemberAvatar name={member.display_name} avatar={member.avatar} />
                                    <span className="flex-1 text-[15px] font-medium">{member.display_name}</span>
                                    <Check className="size-[18px] text-primary opacity-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </AppShell>
    );
}
