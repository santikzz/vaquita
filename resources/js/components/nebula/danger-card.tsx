import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

interface DangerCardProps {
    title?: string;
    description?: string;
    /** Action rendered on the right (e.g. a delete button or confirm dialog trigger) */
    action?: React.ReactNode;
    /** Custom content - replaces the default title/description/action layout */
    children?: React.ReactNode;
    className?: string;
}

export const DangerCard = ({ title, description, action, children, className }: DangerCardProps) => {
    return (
        <div className={cn("rounded-lg border border-destructive/40 bg-destructive/5 p-4", className)}>
            {children ?? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-destructive">{title ?? t('common:danger_zone')}</p>
                            {description && <p className="text-sm text-muted-foreground">{description}</p>}
                        </div>
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
        </div>
    );
};
