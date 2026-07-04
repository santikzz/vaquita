import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string; icon?: LucideIcon }[];
    className?: string;
}

export function Segmented({ value, onChange, options, className }: Props) {
    return (
        <div className={cn('flex gap-1.5 rounded-xl border border-border bg-card p-1', className)}>
            {options.map((option) => {
                const Icon = option.icon;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'flex h-9.5 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-[13.5px] font-semibold transition-colors',
                            option.value === value
                                ? 'bg-secondary text-foreground'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {Icon && <Icon className="size-[15px]" />}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
