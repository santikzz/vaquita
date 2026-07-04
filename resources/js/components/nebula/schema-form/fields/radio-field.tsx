import { useId } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RadioFieldConfig } from "../types";

interface Props {
    config: RadioFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function RadioField({ config, field, isDisabled }: Props) {
    const id = useId();

    if (config.variant === "cards") {
        const hasIcons = config.options.some((o) => o.icon);

        if (hasIcons) {
            return (
                <RadioGroup
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isDisabled}
                    className="gap-2"
                >
                    {config.options.map((opt) => (
                        <div
                            key={opt.value}
                            className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50"
                        >
                            <RadioGroupItem
                                value={opt.value}
                                id={`${id}-${opt.value}`}
                                aria-describedby={opt.description ? `${id}-${opt.value}-desc` : undefined}
                                className="order-1 after:absolute after:inset-0"
                            />
                            <div className="flex grow items-start gap-3">
                                {opt.icon && <div className="shrink-0">{opt.icon}</div>}
                                <div className="grid grow gap-1.5">
                                    <Label htmlFor={`${id}-${opt.value}`} className="cursor-pointer">
                                        {opt.label}
                                        {opt.sublabel && (
                                            <span className="ml-1 font-normal text-muted-foreground text-xs leading-[inherit]">
                                                ({opt.sublabel})
                                            </span>
                                        )}
                                    </Label>
                                    {opt.description && (
                                        <p id={`${id}-${opt.value}-desc`} className="text-muted-foreground text-xs">
                                            {opt.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            );
        }

        // Plan-style stacked bordered list
        return (
            <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isDisabled}
                className="-space-y-px gap-0 rounded-md shadow-xs"
            >
                {config.options.map((opt) => (
                    <div
                        key={opt.value}
                        className="relative flex items-center justify-between gap-4 border border-input p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value={opt.value}
                                id={`${id}-${opt.value}`}
                                aria-describedby={opt.meta ? `${id}-${opt.value}-meta` : undefined}
                                className="after:absolute after:inset-0"
                            />
                            <Label htmlFor={`${id}-${opt.value}`} className="cursor-pointer inline-flex items-center gap-2">
                                {opt.label}
                                {opt.badge && <Badge>{opt.badge}</Badge>}
                            </Label>
                        </div>
                        {opt.meta && (
                            <div id={`${id}-${opt.value}-meta`} className="text-muted-foreground text-xs shrink-0">
                                {opt.meta}
                            </div>
                        )}
                    </div>
                ))}
            </RadioGroup>
        );
    }

    // Default: simple list
    return (
        <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            disabled={isDisabled}
            className={cn(
                config.orientation === "horizontal"
                    ? "flex flex-row flex-wrap gap-4"
                    : "flex flex-col gap-2.5",
            )}
        >
            {config.options.map((opt) => (
                <div key={opt.value} className="flex items-start gap-2.5">
                    <RadioGroupItem
                        value={opt.value}
                        id={`${field.name}-${opt.value}`}
                        className="mt-0.5 shrink-0"
                    />
                    <div className="grid gap-0.5 leading-none">
                        <Label
                            htmlFor={`${field.name}-${opt.value}`}
                            className="cursor-pointer font-normal leading-snug"
                        >
                            {opt.label}
                        </Label>
                        {opt.description && (
                            <p className="text-xs text-muted-foreground">{opt.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </RadioGroup>
    );
}
