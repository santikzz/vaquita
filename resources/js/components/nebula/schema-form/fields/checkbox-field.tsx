import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxFieldConfig } from "../types";

interface Props {
    config: CheckboxFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function CheckboxField({ config, field, isDisabled }: Props) {
    return (
        <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            disabled={isDisabled}
            ref={field.ref}
        />
    );
}
