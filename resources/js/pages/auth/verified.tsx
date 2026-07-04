import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

export default function Verified() {
    return (
        <AuthLayout
            title={t('auth:verified_title')}
            description={t('auth:verified_description')}
        >
            <Head title={t('auth:verified_title')} />
        </AuthLayout>
    );
}
