import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import i18n, { changeLanguage } from '@/i18n';
import { Check, Languages } from 'lucide-react';

const langs = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
];

export const LangToggle = () => {
    const current = i18n.language?.split('-')[0] || 'es';

    const handleSelect = (code: string) => {
        if (code === current) return;
        changeLanguage(code);
        // global t() is non-reactive, reload to repaint with the new language
        window.location.reload();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <Languages className="size-4" />
                    <span className="text-sm font-medium uppercase">{current}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
                {langs.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleSelect(lang.code)}
                        className="gap-2"
                    >
                        <span className="flex-1">{lang.label}</span>
                        {lang.code === current && <Check className="size-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
