import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { z } from 'zod';
import { Lock, LogIn, Mail } from 'lucide-react';
import { SchemaForm } from '@/components/nebula/schema-form/schema-form';
import type { FieldConfig } from '@/components/nebula/schema-form/types';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { GoogleLoginButton } from './google-login-button';

export default function Login({ status }: { status?: string }) {
    const { flash, errors } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);

    const schema = z.object({
        email: z.email(t('auth:invalid_email')),
        password: z.string().min(1, t('auth:password_required')),
    });

    const fields: FieldConfig[] = [
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
            required: true,
        },
    ];

    const handleSubmit = (data: z.infer<typeof schema>) => {
        router.post('/login', data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AuthLayout title={t('auth:login_title')} description={t('auth:login_description')}>
            <Head title="Log in" />

            <div className="flex flex-col gap-6">
                {flash?.error && (
                    <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {flash.error}
                    </div>
                )}

                <SchemaForm
                    schema={schema}
                    fields={fields}
                    defaultValues={{ email: '', password: '' }}
                    onSubmit={handleSubmit}
                    serverErrors={errors as Record<string, string>}
                    loading={loading}
                    layout="stack"
                    submitLabel={t('auth:login')}
                    submitIcon={LogIn}
                    showRequiredIndicator={false}
                    actionsClassName="[&>button]:w-full"
                />

                <div className="relative text-center text-sm after:absolute after:inset-x-0 after:top-1/2 after:-z-0 after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        {t('auth:or_continue_with')}
                    </span>
                </div>

                <GoogleLoginButton />

                <div className="text-center text-sm text-muted-foreground">
                    {t('auth:dont_have_account')}{' '}
                    <TextLink href={register()}>{t('auth:sign_up')}</TextLink>
                </div>

                {status && (
                    <div className="text-center text-sm font-medium text-green-600">{status}</div>
                )}
            </div>
        </AuthLayout>
    );
}
