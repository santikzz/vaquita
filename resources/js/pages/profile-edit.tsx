import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import { EmailVerificationNotice } from '@/components/nebula/email-verification-notice';
import { SchemaForm, toFormData } from '@/components/nebula/schema-form';
import type { FieldConfig } from '@/components/nebula/schema-form/types';
import { AppShell } from '@/components/web/app-shell';
import type { SharedData } from '@/types';
import { AtSign, CreditCard, KeyRound, Save, User as UserIcon } from 'lucide-react';

interface Props {
    profile: {
        name: string;
        email: string;
        avatar?: string | null;
        payment_alias?: string | null;
        email_verified_at?: string | null;
    };
}

const profileSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    payment_alias: z.string().max(100).optional().or(z.literal('')),
    avatar: z.any().optional(),
});

const passwordSchema = z
    .object({
        current_password: z.string().min(1),
        password: z.string().min(8),
        password_confirmation: z.string().min(1),
    })
    .refine((d) => d.password === d.password_confirmation, {
        message: t('profile:passwords_no_match'),
        path: ['password_confirmation'],
    });

const pick = (obj: Record<string, string>, keys: string[]) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));

export default function ProfileEdit({ profile }: Props) {
    const { errors } = usePage<SharedData>().props;
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordKey, setPasswordKey] = useState(0);

    const profileFields: FieldConfig[] = [
        {
            name: 'avatar',
            component: 'file',
            label: t('profile:avatar'),
            description: t('profile:avatar_hint'),
            accept: 'image/*',
            maxSizeMb: 2,
        },
        {
            name: 'name',
            component: 'input',
            label: t('common:name'),
            icon: UserIcon,
            required: true,
        },
        {
            name: 'email',
            component: 'input',
            type: 'email',
            label: t('common:email'),
            icon: AtSign,
            required: true,
        },
        {
            name: 'payment_alias',
            component: 'input',
            label: t('groups:payment_alias'),
            description: t('groups:payment_alias_hint'),
            placeholder: t('groups:payment_alias_placeholder'),
            icon: CreditCard,
        },
    ];

    const passwordFields: FieldConfig[] = [
        {
            name: 'current_password',
            component: 'password',
            label: t('profile:current_password'),
            placeholder: t('profile:current_password_placeholder'),
            required: true,
        },
        {
            name: 'password',
            component: 'password',
            label: t('profile:new_password'),
            showStrength: true,
            required: true,
        },
        {
            name: 'password_confirmation',
            component: 'password',
            label: t('profile:confirm_password'),
            required: true,
        },
    ];

    const onSubmitProfile = (data: z.infer<typeof profileSchema>) => {
        setProfileLoading(true);
        const fd = toFormData({ name: data.name, email: data.email, payment_alias: data.payment_alias ?? '' });
        if (data.avatar instanceof File) {
            fd.append('avatar', data.avatar);
        } else if (!data.avatar && profile.avatar) {
            fd.append('remove_avatar', '1');
        }
        router.post('/profile', fd, {
            preserveScroll: true,
            onFinish: () => setProfileLoading(false),
        });
    };

    const onSubmitPassword = (data: z.infer<typeof passwordSchema>) => {
        setPasswordLoading(true);
        router.put('/password', data, {
            preserveScroll: true,
            onSuccess: () => setPasswordKey((k) => k + 1),
            onFinish: () => setPasswordLoading(false),
        });
    };

    const formActions =
        'pt-1 [&>button]:h-12.5 [&>button]:w-full [&>button]:rounded-2xl [&>button]:text-[15px] [&>button]:font-semibold';

    return (
        <AppShell title={t('groups:edit_profile')} back="/profile">
            <div className="space-y-4 pt-1">
                <div className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 px-1 pb-3 text-[15px] font-semibold">
                        <UserIcon className="size-[18px] text-muted-foreground" />
                        {t('profile:info_title')}
                    </div>
                    <EmailVerificationNotice verified={Boolean(profile.email_verified_at)} className="mb-4" />
                    <SchemaForm
                        schema={profileSchema}
                        fields={profileFields}
                        layout="stack"
                        defaultValues={{
                            name: profile.name,
                            email: profile.email,
                            payment_alias: profile.payment_alias ?? '',
                            avatar: profile.avatar ?? undefined,
                        }}
                        serverErrors={pick(errors, ['name', 'email', 'payment_alias', 'avatar'])}
                        loading={profileLoading}
                        onSubmit={onSubmitProfile}
                        submitLabel={t('common:save')}
                        submitIcon={Save}
                        actionsClassName={formActions}
                    />
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 px-1 pb-3 text-[15px] font-semibold">
                        <KeyRound className="size-[18px] text-muted-foreground" />
                        {t('profile:password_title')}
                    </div>
                    <SchemaForm
                        key={passwordKey}
                        schema={passwordSchema}
                        fields={passwordFields}
                        layout="stack"
                        defaultValues={{
                            current_password: '',
                            password: '',
                            password_confirmation: '',
                        }}
                        serverErrors={pick(errors, ['current_password', 'password', 'password_confirmation'])}
                        loading={passwordLoading}
                        onSubmit={onSubmitPassword}
                        submitLabel={t('profile:update_password')}
                        submitIcon={Save}
                        actionsClassName={formActions}
                    />
                </div>
            </div>
        </AppShell>
    );
}
