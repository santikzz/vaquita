import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Share, SquarePlus, Smartphone } from 'lucide-react';

// "install on home screen" entry: hidden when already installed, prompts
// natively on chromium and shows manual instructions on ios
export function PwaInstallButton() {
    const { isStandalone, isIos, canPrompt, promptInstall } = usePwaInstall();
    const [iosOpen, setIosOpen] = useState(false);

    if (isStandalone || (!canPrompt && !isIos)) return null;

    const onClick = () => {
        if (canPrompt) {
            void promptInstall();
            return;
        }
        setIosOpen(true);
    };

    return (
        <>
            <button
                type="button"
                onClick={onClick}
                className="flex h-12.5 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[14.5px] font-semibold active:scale-[0.98]"
            >
                <Smartphone className="size-[17px]" />
                {t('groups:install_app')}
            </button>

            <Drawer open={iosOpen} onOpenChange={setIosOpen}>
                <DrawerContent>
                    <div className="p-4 pb-8">
                        <DrawerTitle className="px-1 pb-1.5 text-[16px] font-semibold">{t('groups:install_app')}</DrawerTitle>
                        <p className="px-1 pb-4 text-[13.5px] leading-relaxed text-muted-foreground">{t('groups:install_ios_hint')}</p>
                        <div className="overflow-hidden rounded-2xl border border-border bg-background">
                            <div className="flex items-center gap-3 border-b border-border px-4 py-3 text-[14px]">
                                <Share className="size-[18px] flex-none text-primary" />
                                {t('groups:install_ios_step1')}
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 text-[14px]">
                                <SquarePlus className="size-[18px] flex-none text-primary" />
                                {t('groups:install_ios_step2')}
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
