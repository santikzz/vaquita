import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { CurrencyFieldConfig } from "../types";

interface Props {
    config: CurrencyFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

/**
 * Numeric input with optional currency symbol prefix (€, $) and currency code suffix (EUR, USD).
 * Uses the `peer` pattern so adornments dim automatically when the input is disabled.
 *
 * @example
 * { name: "price", component: "currency", label: "Price", currencySymbol: "€", currencyCode: "EUR" }
 */
export function CurrencyField({ config, field, isDisabled }: Props) {
    const hasSymbol = !!config.currencySymbol;
    const hasCode = !!config.currencyCode;

    return (
        <div className="relative">
            {hasSymbol && (
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground text-sm peer-disabled:opacity-50 select-none z-10">
                    {config.currencySymbol}
                </span>
            )}

            <Input
                {...field}
                peer
                type="text"
                inputMode="decimal"
                placeholder={config.placeholder ?? "0.00"}
                disabled={isDisabled}
                value={field.value ?? ""}
                className={cn(
                    hasSymbol && "ps-7",
                    hasCode && "pe-14",
                    config.inputClassName,
                )}
                onChange={(e) => {
                    const raw = e.target.value;
                    // Allow empty, digits, and one decimal separator
                    if (raw === "" || /^-?\d*[.,]?\d*$/.test(raw)) {
                        field.onChange(raw === "" ? undefined : raw);
                    }
                }}
                onBlur={(e) => {
                    // Normalise to float on blur
                    const parsed = parseFloat(e.target.value.replace(",", "."));
                    if (!isNaN(parsed)) {
                        field.onChange(parsed);
                    }
                    field.onBlur();
                }}
            />

            {hasCode && (
                <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground text-sm peer-disabled:opacity-50 select-none">
                    {config.currencyCode}
                </span>
            )}
        </div>
    );
}
