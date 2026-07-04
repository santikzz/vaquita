import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "../../searchable-select";
import type { SelectFieldConfig } from "../types";

interface Props {
    config: SelectFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function SelectField({ config, field, isDisabled }: Props) {
    if (config.searchable) {
        return (
            <SearchableSelect
                value={field.value ?? ""}
                onValueChange={field.onChange}
                options={config.options}
                placeholder={config.placeholder ?? "Select an option"}
                searchPlaceholder={config.searchPlaceholder}
                emptyText={config.emptyText}
                disabled={isDisabled}
            />
        );
    }

    return (
        <Select value={field.value ?? ""} onValueChange={field.onChange} disabled={isDisabled}>
            <SelectTrigger className={cn(config.inputClassName)}>
                <SelectValue placeholder={config.placeholder ?? "Select an option"} />
            </SelectTrigger>
            <SelectContent>
                {config.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
