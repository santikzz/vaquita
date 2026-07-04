import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { TextareaFieldConfig } from "../types";

interface Props {
    config: TextareaFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function TextareaField({ config, field, isDisabled }: Props) {
    return (
        <Textarea
            {...field}
            placeholder={config.placeholder}
            disabled={isDisabled}
            rows={config.rows ?? 4}
            value={field.value ?? ""}
            className={cn("resize-none", config.inputClassName)}
        />
    );
}
