import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import type { SwitchFieldConfig } from "../types";

interface Props {
    config: SwitchFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function SwitchField({ config, field, isDisabled }: Props) {
    return (
        <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            disabled={isDisabled}
            ref={field.ref}
        />
    );
}
