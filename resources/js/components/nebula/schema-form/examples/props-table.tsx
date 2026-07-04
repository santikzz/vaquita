import { Badge } from "@/components/ui/badge";

export interface PropRow {
    name: string;
    type: string;
    default?: string;
    description: string;
}

interface PropsTableProps {
    rows: PropRow[];
    title?: string;
}

export function PropsTable({ rows, title }: PropsTableProps) {
    return (
        <div className="rounded-lg border border-border overflow-hidden">
            {title && (
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                    <span className="text-sm font-medium">{title}</span>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Prop</th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Default</th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.name} className="border-b border-border/50 last:border-0">
                                <td className="px-4 py-2.5">
                                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                                        {row.name}
                                    </code>
                                </td>
                                <td className="px-4 py-2.5">
                                    <Badge variant="outline" className="font-mono text-[11px] font-normal">
                                        {row.type}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground text-xs">
                                    {row.default ? (
                                        <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">{row.default}</code>
                                    ) : (
                                        <span className="text-muted-foreground/50">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground text-xs leading-relaxed">
                                    {row.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
