import type { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import type { FieldConfig, CustomFieldConfig } from "./types";

import { InputField } from "./fields/input-field";
import { PasswordField } from "./fields/password-field";
import { TextareaField } from "./fields/textarea-field";
import { CurrencyField } from "./fields/currency-field";
import { DateField } from "./fields/date-field";
import { SelectField } from "./fields/select-field";
import { SelectApiField } from "./fields/select-api-field";
import { SwitchField } from "./fields/switch-field";
import { CheckboxField } from "./fields/checkbox-field";
import { RadioField } from "./fields/radio-field";
import { FileField } from "./fields/file-field";
import { PhoneField } from "./fields/phone-field";
import { OtpField } from "./fields/otp-field";
import { SliderField } from "./fields/slider-field";
import { TagsField } from "./fields/tags-field";

interface FieldRendererProps {
    config: FieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    form: UseFormReturn<FieldValues>;
    formValues: FieldValues;
    disabled?: boolean;
}

export function FieldRenderer({ config, field, form, formValues, disabled }: FieldRendererProps) {
    const isDisabled = disabled || config.disabled || form.formState.isSubmitting;

    switch (config.component) {
        case "input":      return <InputField      config={config} field={field} isDisabled={isDisabled} />;
        case "password":   return <PasswordField   config={config} field={field} isDisabled={isDisabled} />;
        case "textarea":   return <TextareaField   config={config} field={field} isDisabled={isDisabled} />;
        case "currency":   return <CurrencyField   config={config} field={field} isDisabled={isDisabled} />;
        case "date":       return <DateField       config={config} field={field} isDisabled={isDisabled} />;
        case "tags":       return <TagsField       config={config} field={field} isDisabled={isDisabled} />;
        case "select":     return <SelectField     config={config} field={field} isDisabled={isDisabled} />;
        case "select-api": return <SelectApiField  config={config} field={field} isDisabled={isDisabled} />;
        case "switch":     return <SwitchField     config={config} field={field} isDisabled={isDisabled} />;
        case "checkbox":   return <CheckboxField   config={config} field={field} isDisabled={isDisabled} />;
        case "radio":      return <RadioField      config={config} field={field} isDisabled={isDisabled} />;
        case "file":       return <FileField       config={config} field={field} isDisabled={isDisabled} />;
        case "phone":      return <PhoneField      config={config} field={field} isDisabled={isDisabled} />;
        case "otp":        return <OtpField        config={config} field={field} isDisabled={isDisabled} />;
        case "slider":     return <SliderField     config={config} field={field} isDisabled={isDisabled} />;
        case "custom":     return <>{(config as CustomFieldConfig).render(field, formValues, form)}</>;
        default:           return null;
    }
}
