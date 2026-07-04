import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/web/app-shell';
import { MemberAvatar } from '@/components/web/member-avatar';
import { PwaInstallButton } from '@/components/web/pwa-install-button';
import { useAppearance } from '@/hooks/use-appearance';
import i18n, { changeLanguage } from '@/i18n';
import { logout } from '@/routes';
import { ChevronRight, Globe, Moon, SquarePen, Sun } from 'lucide-react';

interface Props {
    profile: {
        name: string;
        email: string;
        avatar?: string | null;
        payment_alias?: string | null;
    };
}

export default function Profile({ profile }: Props) {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark';
    const lang = i18n.language?.split('-')[0] || 'es';

    const toggleLanguage = () => {
        changeLanguage(lang === 'es' ? 'en' : 'es');
        window.location.reload();
    };

    return (
        <AppShell title={t('groups:tab_profile')} tab="profile">
            <div className="flex flex-col items-center gap-3 pt-4 pb-6">
                <MemberAvatar name={profile.name} avatar={profile.avatar} size="lg" className="size-19 text-2xl" />
                <div className="text-center">
                    <div className="text-xl font-bold">{profile.name}</div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground">{profile.email}</div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <Link
                    href="/profile/edit"
                    prefetch="mount"
                    className="flex w-full cursor-pointer items-center justify-between border-b border-border px-4 py-3.5 text-left active:bg-secondary"
                >
                    <span className="flex items-center gap-3 text-[14.5px]">
                        <SquarePen className="size-[17px] text-muted-foreground" />
                        {t('groups:edit_profile')}
                    </span>
                    <span className="flex items-center gap-2">
                        {profile.payment_alias && (
                            <span className="max-w-32 truncate text-[12.5px] text-muted-foreground">{profile.payment_alias}</span>
                        )}
                        <ChevronRight className="size-4 text-muted-foreground" />
                    </span>
                </Link>
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="flex items-center gap-3 text-[14.5px]">
                        {isDark ? <Moon className="size-[17px] text-muted-foreground" /> : <Sun className="size-[17px] text-muted-foreground" />}
                        {t('groups:theme')}
                    </span>
                    <button
                        type="button"
                        onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
                        className="cursor-pointer rounded-full border border-border bg-secondary px-3 py-1.5 text-[13px] font-semibold active:scale-95"
                    >
                        {isDark ? t('groups:theme_dark') : t('groups:theme_light')}
                    </button>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-3 text-[14.5px]">
                        <Globe className="size-[17px] text-muted-foreground" />
                        {t('groups:language')}
                    </span>
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="cursor-pointer rounded-full border border-border bg-secondary px-3 py-1.5 text-[13px] font-semibold active:scale-95"
                    >
                        {lang === 'es' ? 'Español' : 'English'}
                    </button>
                </div>
            </div>

            <div className="min-h-8 flex-1" />

            <div className="flex flex-col gap-2.5">
                <PwaInstallButton />
                <Link
                    href={logout()}
                    as="button"
                    className="flex h-12.5 w-full cursor-pointer items-center justify-center rounded-2xl border border-border bg-card text-[14.5px] font-semibold text-red-500 active:scale-[0.98]"
                >
                    {t('groups:logout')}
                </Link>
            </div>
        </AppShell>
    );
}
