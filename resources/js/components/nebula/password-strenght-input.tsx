import { useMemo, useState } from "react"
import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface PasswordStrengthInputProps {
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
    placeholder?: string
    required?: boolean
    tabIndex?: number
    className?: string
}

export const PasswordStrengthInput = ({
    value = "",
    onChange = () => { },
    disabled = false,
    placeholder = "",
    required = false,
    tabIndex = 0,
    className = "",
    ...props
}: PasswordStrengthInputProps) => {

    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: t("auth.validation.password_strength.requirements.min_8_chars") },
            { regex: /[0-9]/, text: t("auth.validation.password_strength.requirements.one_number") },
            { regex: /[a-z]/, text: t("auth.validation.password_strength.requirements.one_lowercase") },
            { regex: /[A-Z]/, text: t("auth.validation.password_strength.requirements.one_uppercase") },
            { regex: /[^A-Za-z0-9]/, text: t("auth.validation.password_strength.requirements.one_special_char") },
        ]

        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }))
    }

    const strength = checkStrength(value)

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length
    }, [strength])

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border"
        if (score <= 1) return "bg-red-500"
        if (score <= 2) return "bg-orange-500"
        if (score === 3) return "bg-amber-500"
        return "bg-emerald-500"
    }

    const getStrengthText = (score: number) => {
        if (score === 0) return t("auth.validation.password_strength.enter_password")
        if (score <= 2) return t("auth.validation.password_strength.weak")
        if (score === 3) return t("auth.validation.password_strength.medium")
        return t("auth.validation.password_strength.strong")
    }

    return (
        <div>
            {/* Password input field with toggle visibility button */}
            <div className="*:not-first:mt-2">
                <div className="relative flex rounded-md shadow-xs">
                    <span className="border-input bg-card text-muted-foreground inline-flex items-center rounded-s-md border px-3 text-sm">
                        <LockIcon className="size-4" />
                    </span>
                    <Input
                        className={cn("-ms-px rounded-s-none shadow-none pe-9", className)}
                        disabled={disabled}
                        required={required}
                        tabIndex={tabIndex}
                        placeholder={placeholder}
                        type={isVisible ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        {...props}
                    />
                    <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? t("auth.validation.password_strength.aria.hide_password") : t("auth.validation.password_strength.aria.show_password")}
                        aria-pressed={isVisible}
                        aria-controls="password"
                    >
                        {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                            <EyeIcon size={16} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Password strength indicator */}
            <div
                className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuenow={strengthScore}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label={t("auth.validation.password_strength.aria.password_strength")}
            >
                <div
                    className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                ></div>
            </div>

            {/* Password strength description */}
            {/* <p className="mb-2 text-sm font-medium text-foreground">
                {getStrengthText(strengthScore)}. Must contain:
            </p> */}

            {/* Password requirements list */}
            <ul className="space-y-1.5">
                {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                            <CheckIcon
                                size={16}
                                className="text-emerald-500"
                                aria-hidden="true"
                            />
                        ) : (
                            <XIcon
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                            />
                        )}
                        <span
                            className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                        >
                            {req.text}
                            <span className="sr-only">
                                {req.met ? ` - ${t("auth.validation.password_strength.aria.requirement_met")}` : ` - ${t("auth.validation.password_strength.aria.requirement_not_met")}`}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
