import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { getDateFnsLocale } from "@/lib/date-locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateFieldConfig } from "../types";

interface Props {
    config: DateFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

/**
 * Date picker built with shadcn Calendar + Popover + date-fns.
 * Stores value as an ISO string ("2024-03-15") or a Date object depending on `valueFormat`.
 *
 * @example
 * { name: "birth_date", component: "date", label: "Date of birth", displayFormat: "PPP" }
 */
export function DateField({ config, field, isDisabled }: Props) {
    const [open, setOpen] = useState(false);
    const { i18n } = useTranslation();
    const locale = config.locale ?? getDateFnsLocale(i18n.language);

    // Normalise incoming value to Date | undefined
    const dateValue: Date | undefined = (() => {
        if (!field.value) return undefined;
        if (field.value instanceof Date) return field.value;
        const d = new Date(field.value);
        return isNaN(d.getTime()) ? undefined : d;
    })();

    const displayFormat = config.displayFormat ?? "PPP"; // e.g. "April 3, 2026"

    const handleSelect = (date: Date | undefined) => {
        if (!date) {
            field.onChange(null);
            setOpen(false);
            return;
        }
        const valueFormat = config.valueFormat ?? "iso";
        if (valueFormat === "iso") {
            field.onChange(format(date, "yyyy-MM-dd"));
        } else if (valueFormat === "datetime") {
            field.onChange(date.toISOString());
        } else {
            field.onChange(date); // raw Date object
        }
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        field.onChange(null);
    };

    return (
        <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) field.onBlur(); }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={isDisabled}
                    className={cn(
                        "border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between rounded-md border bg-input/30 px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-normal",
                        !dateValue && "text-muted-foreground",
                        config.inputClassName,
                    )}
                >
                    <span className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-muted-foreground/80 shrink-0" />
                        {dateValue ? format(dateValue, displayFormat) : (config.placeholder ?? "Pick a date")}
                    </span>
                    {dateValue && !isDisabled && (
                        <span
                            role="button"
                            tabIndex={-1}
                            onClick={handleClear}
                            aria-label="Clear date"
                            className="rounded p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                        >
                            <X size={13} />
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleSelect}
                    defaultMonth={dateValue}
                    disabled={config.disabledDates}
                    locale={locale}
                    captionLayout="dropdown"
                    startMonth={new Date(config.startYear ?? 1900, 0)}
                    endMonth={new Date(config.endYear ?? new Date().getFullYear() + 10, 11)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
