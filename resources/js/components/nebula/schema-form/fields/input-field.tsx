import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { InputFieldConfig } from "../types";

interface Props {
    config: InputFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

/**
 * Standard text/number/email/url/tel input.
 * Supports a leading icon (Lucide or any React component), a leading text prefix, and a trailing text suffix.
 * Uses the `peer` pattern so icon/adornments dim automatically when the input is disabled.
 *
 * icon   -> 16px icon, input padding ps-9
 * prefix -> short text (€, $, https://), input padding ps-7
 * suffix -> trailing text (USD, .com, %), input padding pe-12
 */
export function InputField({ config, field, isDisabled }: Props) {
    const hasIcon = !!config.icon;
    const hasPrefix = !!config.prefix && !hasIcon; // icon takes priority over text prefix
    const hasSuffix = !!config.suffix;

    return (
        <div className="relative flex items-center">
            {/* Leading icon */}
            {hasIcon && (
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50 z-10">
                    <config.icon aria-hidden="true" size={16} />
                </div>
            )}

            {/* Leading text prefix (e.g. €, $) */}
            {hasPrefix && (
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground text-sm peer-disabled:opacity-50 z-10 select-none">
                    {config.prefix}
                </span>
            )}

            <Input
                {...field}
                peer
                type={config.type ?? "text"}
                placeholder={config.placeholder}
                disabled={isDisabled}
                min={config.min}
                max={config.max}
                step={config.step}
                value={field.value ?? ""}
                className={cn(
                    hasIcon && "ps-9",
                    hasPrefix && "ps-7",
                    hasSuffix && "pe-12",
                    config.inputClassName,
                )}
                onChange={(e) => {
                    if (config.type === "number") {
                        const v = e.target.value === "" ? undefined : e.target.valueAsNumber;
                        field.onChange(isNaN(v as number) ? undefined : v);
                    } else {
                        field.onChange(e.target.value);
                    }
                }}
            />

            {/* Trailing text suffix (e.g. USD, %) */}
            {hasSuffix && (
                <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground text-sm peer-disabled:opacity-50 select-none">
                    {config.suffix}
                </span>
            )}
        </div>
    );
}
