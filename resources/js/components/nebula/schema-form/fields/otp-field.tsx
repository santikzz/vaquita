import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import type { OtpFieldConfig } from "../types";

interface Props {
    config: OtpFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function OtpField({ config, field, isDisabled }: Props) {
    const length = config.length ?? 6;
    const firstHalf = Math.ceil(length / 2);
    const secondHalf = length - firstHalf;

    return (
        <InputOTP
            maxLength={length}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={isDisabled}
        >
            <InputOTPGroup>
                {Array.from({ length: firstHalf }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                {Array.from({ length: secondHalf }).map((_, i) => (
                    <InputOTPSlot key={i + firstHalf} index={i + firstHalf} />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
}
