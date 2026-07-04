import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { z } from 'zod';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import { SchemaForm } from '@/components/nebula/schema-form/schema-form';
import type { FieldConfig } from '@/components/nebula/schema-form/types';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Turnstile } from '@/components/nebula/turnstile';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { type SharedData } from '@/types';
import { GoogleLoginButton } from './google-login-button';

export default function Register({
    redirect,
    turnstileEnabled = true,
}: {
    redirect?: string | null;
    turnstileEnabled?: boolean;
}) {
    const { errors } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');

    const schema = z
        .object({
            name: z
                .string()
                .min(3, t('auth:name_min'))
                .max(30, t('auth:name_max'))
                .regex(/^[a-zA-Z0-9_\-\s]+$/, t('auth:name_invalid')),
            email: z.email(t('auth:invalid_email')),
            password: z.string().min(8, t('auth:password_min')),
            password_confirmation: z.string().min(1, t('auth:confirm_password_required')),
        })
        .refine((data) => data.password === data.password_confirmation, {
            message: t('auth:passwords_no_match'),
            path: ['password_confirmation'],
        });

    const fields: FieldConfig[] = [
        {
            name: 'name',
            component: 'input',
            label: t('auth:name'),
            placeholder: t('auth:name'),
            icon: User,
            required: true,
        },
        {
            name: 'email',
            component: 'input',
            type: 'email',
            label: t('auth:email_address'),
            placeholder: 'email@example.com',
            icon: Mail,
            required: true,
        },
        {
            name: 'password',
            component: 'password',
            label: t('auth:password'),
            icon: Lock,
            showStrength: true,
            required: true,
        },
        {
            name: 'password_confirmation',
            component: 'password',
            label: t('auth:confirm_password'),
            icon: Lock,
            required: true,
        },
    ];

    const handleSubmit = (data: z.infer<typeof schema>) => {
        router.post(
            '/register',
            { ...data, turnstile_token: turnstileToken, redirect: redirect ?? '' },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <AuthLayout title={t('auth:register_title')} description={t('auth:register_description')}>
            <Head title="Register" />

            <div className="flex flex-col gap-6">
                <SchemaForm
                    schema={schema}
                    fields={fields}
                    defaultValues={{ name: '', email: '', password: '', password_confirmation: '' }}
                    onSubmit={handleSubmit}
                    serverErrors={errors as Record<string, string>}
                    loading={loading}
                    layout="stack"
                    submitLabel={t('auth:register')}
                    submitIcon={UserPlus}
                    showRequiredIndicator={false}
                    actionsClassName="[&>button]:w-full"
                    after={
                        turnstileEnabled ? (
                            <div className="grid gap-2">
                                <Turnstile
                                    onVerify={setTurnstileToken}
                                    onExpire={() => setTurnstileToken('')}
                                />
                                <InputError message={(errors as Record<string, string>)?.turnstile_token} />
                            </div>
                        ) : null
                    }
                />

                <div className="relative text-center text-sm after:absolute after:inset-x-0 after:top-1/2 after:-z-0 after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        {t('auth:or_continue_with')}
                    </span>
                </div>

                <GoogleLoginButton />

                <div className="text-center text-sm text-muted-foreground">
                    {t('auth:already_have_account')}{' '}
                    <TextLink href={login()}>{t('auth:login')}</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
