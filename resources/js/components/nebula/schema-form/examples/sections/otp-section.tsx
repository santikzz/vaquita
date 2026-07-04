import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function OtpSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="OTP - 6 digits (2FA / verification)"
                badge="otp"
                description="Two groups of 3 separated by a dash. Classic verification code layout."
                code={SIX_CODE}
            >
                <SchemaForm
                    schema={z.object({ code: z.string().length(6, "Enter the 6-digit code") })}
                    fields={[
                        {
                            name: "code",
                            component: "otp",
                            label: "Verification code",
                            description: "Enter the 6-digit code sent to your email.",
                            length: 6,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Verify"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="OTP - 4 digits (PIN)"
                badge="otp · length=4"
                description="Same component with length: 4. Groups split 2+2."
                code={FOUR_CODE}
            >
                <SchemaForm
                    schema={z.object({ pin: z.string().length(4, "Enter your 4-digit PIN") })}
                    fields={[
                        {
                            name: "pin",
                            component: "otp",
                            label: "PIN",
                            length: 4,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Confirm"
                    layout="stack"
                />
            </ExampleBlock>
            <PropsTable
                title="OtpFieldConfig props"
                rows={[
                    { name: "component", type: '"otp"', description: "Field type discriminator" },
                    { name: "length", type: "number", default: "6", description: "Total number of digits (split into two equal groups)" },
                    { name: "inputClassName", type: "string", description: "CSS classes on the OTP container" },
                ]}
            />
        </div>
    );
}

const SIX_CODE = `\
const schema = z.object({
    code: z.string().length(6, "Enter the 6-digit code"),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "code", component: "otp", label: "Verification code",
          description: "Check your email.", length: 6 },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const FOUR_CODE = `\
<SchemaForm
    schema={z.object({ pin: z.string().length(4, "Enter your PIN") })}
    fields={[
        { name: "pin", component: "otp", label: "PIN", length: 4 },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;
