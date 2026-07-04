import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import { SchemaForm } from '@/components/nebula/schema-form';
import type { FieldConfig } from '@/components/nebula/schema-form/types';
import { AppShell } from '@/components/web/app-shell';
import { ConfirmDrawer } from '@/components/web/confirm-drawer';
import type { SharedData } from '@/types';
import type { GroupData } from '@/types/groups';
import { Save, Trash2 } from 'lucide-react';

interface Props {
    group?: GroupData;
}

const CURRENCIES = ['ARS', 'USD', 'EUR', 'UYU', 'CLP', 'BRL', 'MXN'];

const schema = z.object({
    name: z.string().min(2).max(100),
    currency: z.string().length(3),
});

export default function ManageGroup({ group }: Props) {
    const { errors } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);
    const isEdit = Boolean(group);

    const fields: FieldConfig[] = [
        {
            name: 'name',
            component: 'input',
            label: t('groups:group_name'),
            placeholder: t('groups:group_name_placeholder'),
            required: true,
        },
        {
            name: 'currency',
            component: 'select',
            label: t('groups:currency'),
            required: true,
            options: CURRENCIES.map((c) => ({ value: c, label: c })),
        },
    ];

    const onSubmit = (data: z.infer<typeof schema>) => {
        setLoading(true);
        const url = isEdit ? `/groups/${group!.uuid}` : '/groups';
        router.post(url, data, { onFinish: () => setLoading(false) });
    };

    return (
        <AppShell
            title={isEdit ? t('groups:edit_group') : t('groups:new_group')}
            back={isEdit ? `/groups/${group!.uuid}` : '/groups'}
        >
            <h1 className="mb-5 px-1 text-[22px] font-bold tracking-tight">
                {isEdit ? t('groups:edit_group') : t('groups:new_group')}
            </h1>

            <SchemaForm
                schema={schema}
                fields={fields}
                layout="stack"
                defaultValues={{ name: group?.name ?? '', currency: group?.currency ?? 'ARS' }}
                serverErrors={errors}
                loading={loading}
                onSubmit={onSubmit}
                submitLabel={isEdit ? t('common:save') : t('groups:create_group')}
                submitIcon={Save}
                actionsClassName="pt-2 [&>button]:h-12.5 [&>button]:w-full [&>button]:rounded-2xl [&>button]:text-[15px] [&>button]:font-semibold"
            />

            {isEdit && (
                <>
                    <div className="min-h-10 flex-1" />
                    <ConfirmDrawer
                        onConfirm={() =>
                            new Promise<void>((resolve) => router.delete(`/groups/${group!.uuid}`, { onFinish: () => resolve() }))
                        }
                        title={t('groups:delete_group')}
                        description={t('groups:delete_group_hint')}
                    >
                        <button
                            type="button"
                            className="flex h-12.5 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[14.5px] font-semibold text-red-500 active:scale-[0.98]"
                        >
                            <Trash2 className="size-4" />
                            {t('groups:delete_group')}
                        </button>
                    </ConfirmDrawer>
                </>
            )}
        </AppShell>
    );
}
