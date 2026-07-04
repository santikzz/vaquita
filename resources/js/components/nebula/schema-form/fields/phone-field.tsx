import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { PhoneInput } from "@/components/nebula/phone-input";
import type { PhoneFieldConfig } from "../types";

interface Props {
    config: PhoneFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function PhoneField({ config, field, isDisabled }: Props) {
    return (
        <PhoneInput
            {...field}
            placeholder={config.placeholder}
            disabled={isDisabled}
            className={config.inputClassName}
        />
    );
}
