import { type ReactNode, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Loader2 } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void> | void;
    children: ReactNode;
}

export function ConfirmDrawer({ title, description, confirmLabel, onConfirm, children }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const confirm = async () => {
        setBusy(true);
        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={(next) => !busy && setOpen(next)}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <div className="p-4 pb-8">
                    <DrawerTitle className="px-1 pb-1.5 text-[16px] font-semibold">{title}</DrawerTitle>
                    <p className="px-1 pb-4 text-[13.5px] leading-relaxed text-muted-foreground">{description}</p>
                    <div className="flex gap-2.5">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={busy}
                            className="h-12.5 flex-1 cursor-pointer rounded-[13px] border border-border bg-secondary text-[14.5px] font-semibold active:scale-[0.98] disabled:opacity-50"
                        >
                            {t('common:cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={confirm}
                            disabled={busy}
                            className="flex h-12.5 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-red-500 text-[14.5px] font-semibold text-white active:scale-[0.98] disabled:opacity-70"
                        >
                            {busy && <Loader2 className="size-4 animate-spin" />}
                            {confirmLabel ?? t('common:delete')}
                        </button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
