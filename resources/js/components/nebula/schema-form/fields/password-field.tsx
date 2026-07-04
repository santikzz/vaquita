import { useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { PasswordFieldConfig } from "../types";

interface Props {
    config: PasswordFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function PasswordField({ config, field, isDisabled }: Props) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    const rules = config.strengthRules ?? [
        { regex: /.{8,}/, label: t("schema_form:password_strength.min_8_chars") },
        { regex: /[0-9]/, label: t("schema_form:password_strength.one_number") },
        { regex: /[a-z]/, label: t("schema_form:password_strength.one_lowercase") },
        { regex: /[A-Z]/, label: t("schema_form:password_strength.one_uppercase") },
        { regex: /[^A-Za-z0-9]/, label: t("schema_form:password_strength.one_special_char") },
    ];

    const value = field.value ?? "";
    const strength = rules.map((r) => ({ met: r.regex.test(value), label: r.label }));
    const score = strength.filter((r) => r.met).length;

    const strengthColor =
        score === 0 ? "bg-border"
        : score <= 1 ? "bg-red-500"
        : score <= 2 ? "bg-orange-500"
        : score === rules.length - 2 ? "bg-amber-500"
        : "bg-emerald-500";

    const toggleButton = (
        <button
            type="button"
            aria-label={isVisible ? t("schema_form.password_strength.hide_password") : t("schema_form.password_strength.show_password")}
            aria-pressed={isVisible}
            tabIndex={-1}
            onClick={() => setIsVisible((v) => !v)}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isVisible ? <EyeOffIcon size={16} aria-hidden="true" /> : <EyeIcon size={16} aria-hidden="true" />}
        </button>
    );

    if (config.showStrength) {
        return (
            <div className="space-y-3">
                <div className="relative">
                    {config.icon && (
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80 z-10">
                            <config.icon aria-hidden="true" size={16} />
                        </div>
                    )}
                    <Input
                        {...field}
                        id={field.name}
                        type={isVisible ? "text" : "password"}
                        placeholder={config.placeholder ?? "••••••••"}
                        disabled={isDisabled}
                        value={value}
                        className={cn("pe-9", config.icon && "ps-9", config.inputClassName)}
                    />
                    {toggleButton}
                </div>

                <div
                    className="h-1 w-full overflow-hidden rounded-full bg-border"
                    role="progressbar"
                    aria-valuenow={score}
                    aria-valuemin={0}
                    aria-valuemax={rules.length}
                >
                    <div
                        className={cn("h-full transition-all duration-500 ease-out", strengthColor)}
                        style={{ width: `${(score / rules.length) * 100}%` }}
                    />
                </div>

                <ul className="space-y-1.5">
                    {strength.map((req, i) => (
                        <li key={i} className="flex items-center gap-2">
                            {req.met
                                ? <CheckIcon size={16} className="text-emerald-500 shrink-0" aria-hidden="true" />
                                : <XIcon size={16} className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
                            }
                            <span className={cn("text-xs", req.met ? "text-emerald-600" : "text-muted-foreground")}>
                                {req.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="relative">
            {config.icon && (
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50 z-10">
                    <config.icon aria-hidden="true" size={16} />
                </div>
            )}
            <Input
                {...field}
                id={field.name}
                type={isVisible ? "text" : "password"}
                placeholder={config.placeholder ?? "••••••••"}
                disabled={isDisabled}
                value={value}
                className={cn("pe-9", config.icon && "ps-9", config.inputClassName)}
            />
            {toggleButton}
        </div>
    );
}
