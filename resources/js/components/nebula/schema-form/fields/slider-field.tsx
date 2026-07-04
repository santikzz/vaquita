import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import type { SliderFieldConfig } from "../types";

interface Props {
    config: SliderFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function SliderField({ config, field, isDisabled }: Props) {
    const current = field.value ?? config.min ?? 0;

    return (
        <div className="flex items-center gap-4 py-1">
            <Slider
                value={[current]}
                onValueChange={(vals) => field.onChange(vals[0])}
                onBlur={field.onBlur}
                min={config.min ?? 0}
                max={config.max ?? 100}
                step={config.step ?? 1}
                disabled={isDisabled}
                className={cn("flex-1", config.inputClassName)}
            />
            {config.showValue && (
                <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-muted-foreground">
                    {current}
                </span>
            )}
        </div>
    );
}
