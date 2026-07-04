import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const highlighterPromise = createHighlighter({
    themes: ["github-dark"],
    langs: ["tsx", "typescript"],
});

interface ExampleBlockProps {
    title: string;
    description?: string;
    code: string;
    children: React.ReactNode;
    badge?: string;
    previewClassName?: string;
    /** When provided, a "Type" tab is added showing the highlighted TypeScript type definition */
    typeCode?: string;
}

export function ExampleBlock({
    title,
    description,
    code,
    children,
    badge,
    previewClassName,
    typeCode,
}: ExampleBlockProps) {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string>("");
    const [highlightedType, setHighlightedType] = useState<string>("");

    useEffect(() => {
        highlighterPromise.then((h) => {
            setHighlightedCode(h.codeToHtml(code.trim(), { lang: "tsx", theme: "github-dark" }));
        });
    }, [code]);

    useEffect(() => {
        if (!typeCode) return;
        highlighterPromise.then((h) => {
            setHighlightedType(h.codeToHtml(typeCode.trim(), { lang: "typescript", theme: "github-dark" }));
        });
    }, [typeCode]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl border border-border overflow-hidden shadow-xs">
            <Tabs defaultValue="preview">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/50 px-5 py-3">
                    <div className="min-w-0 mt-1">
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-sm font-semibold text-foreground leading-none">{title}</h3>
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground leading-snug pt-1">{description}</p>
                        )}
                    </div>

                    <TabsList className="shrink-0">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                        {typeCode && <TabsTrigger value="type">Type</TabsTrigger>}
                    </TabsList>
                </div>

                {/* Preview */}
                <TabsContent value="preview" className="m-0">
                    <div className={cn("p-6 bg-background", previewClassName)}>
                        {children}
                    </div>
                </TabsContent>

                {/* Code */}
                <TabsContent value="code" className="m-0">
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="absolute top-3 right-3 z-10 size-7 text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
                            aria-label="Copy code"
                        >
                            {copied
                                ? <CheckIcon size={14} className="text-emerald-400" />
                                : <CopyIcon size={14} />
                            }
                        </Button>
                        {highlightedCode ? (
                            <div
                                className="overflow-x-auto max-h-[500px] text-xs [&>pre]:m-0 [&>pre]:p-5 [&>pre]:leading-relaxed [&>pre]:font-mono [&>pre]:min-h-full"
                                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                            />
                        ) : (
                            <pre className="overflow-x-auto bg-zinc-950 text-zinc-200 text-xs leading-relaxed p-5 font-mono max-h-[500px]">
                                <code>{code.trim()}</code>
                            </pre>
                        )}
                    </div>
                </TabsContent>

                {/* Type */}
                {typeCode && (
                    <TabsContent value="type" className="m-0">
                        {highlightedType ? (
                            <div
                                className="overflow-x-auto max-h-[500px] text-xs [&>pre]:m-0 [&>pre]:p-5 [&>pre]:leading-relaxed [&>pre]:font-mono [&>pre]:min-h-full"
                                dangerouslySetInnerHTML={{ __html: highlightedType }}
                            />
                        ) : (
                            <pre className="overflow-x-auto bg-zinc-950 text-zinc-200 text-xs leading-relaxed p-5 font-mono max-h-[500px]">
                                <code>{typeCode.trim()}</code>
                            </pre>
                        )}
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
