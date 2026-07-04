import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function PasswordSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="Password - simple toggle"
                badge="password"
                description="Eye icon reveals/hides the password. No strength meter."
                code={SIMPLE_CODE}
                typeCode={PASSWORD_TYPE}
            >
                <SchemaForm
                    schema={z.object({ password: z.string().min(8, "At least 8 characters") })}
                    fields={[
                        { name: "password", component: "password", label: "Password" },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Submit"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="Password - with strength meter"
                badge="password · showStrength"
                description="Colour-coded strength bar and requirements checklist. Default rules: length, number, lowercase, uppercase, special char."
                code={STRENGTH_CODE}
            >
                <SchemaForm
                    schema={z.object({
                        password: z.string().min(8)
                            .regex(/[0-9]/, "Include a number")
                            .regex(/[A-Z]/, "Include an uppercase letter")
                            .regex(/[^a-zA-Z0-9]/, "Include a special character"),
                    })}
                    fields={[
                        { name: "password", component: "password", label: "Password", showStrength: true },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Submit"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="Password - custom strength rules"
                badge="password · strengthRules"
                description="Override the default checklist with your own rules. Each rule is a regex + display label."
                code={CUSTOM_RULES_CODE}
            >
                <SchemaForm
                    schema={z.object({ password: z.string().min(12) })}
                    fields={[
                        {
                            name: "password",
                            component: "password",
                            label: "Password",
                            showStrength: true,
                            strengthRules: [
                                { regex: /.{12,}/, label: "At least 12 characters" },
                                { regex: /[0-9]/,  label: "At least one number" },
                                { regex: /[A-Z]/,  label: "At least one uppercase letter" },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Submit"
                    layout="stack"
                />
            </ExampleBlock>
            <PropsTable
                title="PasswordFieldConfig props"
                rows={[
                    { name: "component", type: '"password"', description: "Field type discriminator" },
                    { name: "showStrength", type: "boolean", default: "false", description: "Renders strength bar + requirements checklist" },
                    { name: "strengthRules", type: "{ regex: RegExp; label: string }[]", description: "Custom strength rules (defaults: 8 chars, number, lowercase, uppercase, special)" },
                    { name: "icon", type: "ElementType", description: "Leading icon inside the input" },
                    { name: "inputClassName", type: "string", description: "CSS classes on the input element" },
                ]}
            />
        </div>
    );
}

// ─── Type definition ──────────────────────────────────────────────────────────

const PASSWORD_TYPE = `\
type PasswordFieldConfig = BaseFieldConfig & {
    component: "password";
    showStrength?: boolean;                          // default: false
    strengthRules?: { regex: RegExp; label: string }[];
    // defaults to 5 built-in rules:
    // /.{8,}/        -> "At least 8 characters"
    // /[0-9]/        -> "At least one number"
    // /[a-z]/        -> "At least one lowercase letter"
    // /[A-Z]/        -> "At least one uppercase letter"
    // /[^A-Za-z0-9]/ -> "At least one special character"
};

// Shared by all field types:
interface BaseFieldConfig {
    name: string;
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;  // CSS classes on the input element itself
    colSpan?: 1 | 2 | 3;
    icon?: ElementType;
    hidden?: boolean | ((values: FieldValues) => boolean);
}`;

// ─── Code snippets ────────────────────────────────────────────────────────────

const SIMPLE_CODE = `\
<SchemaForm
    schema={z.object({ password: z.string().min(8) })}
    fields={[
        { name: "password", component: "password", label: "Password" },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const STRENGTH_CODE = `\
<SchemaForm
    schema={z.object({
        password: z.string().min(8)
            .regex(/[0-9]/, "Include a number")
            .regex(/[A-Z]/, "Include an uppercase letter")
            .regex(/[^a-zA-Z0-9]/, "Include a special character"),
    })}
    fields={[
        { name: "password", component: "password", label: "Password", showStrength: true },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const CUSTOM_RULES_CODE = `\
<SchemaForm
    schema={z.object({ password: z.string().min(12) })}
    fields={[
        {
            name: "password",
            component: "password",
            label: "Password",
            showStrength: true,
            strengthRules: [
                { regex: /.{12,}/, label: "At least 12 characters" },
                { regex: /[0-9]/,  label: "At least one number" },
                { regex: /[A-Z]/,  label: "At least one uppercase letter" },
            ],
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;
