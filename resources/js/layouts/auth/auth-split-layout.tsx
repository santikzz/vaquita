import AppLogoIcon from '@/components/app-logo-icon';
import { LangToggle } from '@/components/lang-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* brand panel - hidden on mobile. gradient derives from the shadcn primary color */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-primary/60 p-10 text-primary-foreground lg:flex">
                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-2 text-lg font-medium"
                >
                    <AppLogoIcon className="size-10 fill-current text-primary-foreground" />
                    {name}
                </Link>

                <p className="relative z-10 max-w-md text-3xl font-medium leading-snug text-balance">
                    {t('auth:tagline')}
                </p>
            </div>

            {/* form panel */}
            <div className="relative flex flex-col items-center justify-center gap-6 p-6 md:p-10">

                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4 lg:items-start">
                            <Link
                                href={home()}
                                className="flex items-center gap-2 font-medium lg:hidden"
                            >
                                <AppLogoIcon className="size-9 fill-current" />
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center lg:text-left">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
