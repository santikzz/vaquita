import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const switchSchema = z.object({
    is_public:      z.boolean().default(false),
    email_notify:   z.boolean().default(true),
    dark_mode:      z.boolean().default(false),
});

const checkboxSchema = z.object({
    accept_terms:   z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
    newsletter:     z.boolean().default(false),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function ToggleSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="Switch"
                badge="switch"
                description="Horizontal card layout - label + description on the left, toggle on the right."
                code={SWITCH_CODE}
            >
                <SchemaForm
                    schema={switchSchema}
                    defaultValues={{ is_public: false, email_notify: true, dark_mode: false }}
                    fields={[
                        { name: "is_public",    component: "switch", label: "Public profile",        description: "Your profile will be visible to everyone.",     colSpan: 2 },
                        { name: "email_notify", component: "switch", label: "Email notifications",   description: "Receive updates about your account activity.",   colSpan: 2 },
                        { name: "dark_mode",    component: "switch", label: "Dark mode",             description: "Toggle dark interface theme.",                   colSpan: 2 },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Save preferences"
                    columns={2}
                />
            </ExampleBlock>

            <ExampleBlock
                title="Checkbox"
                badge="checkbox"
                description="Same inline card layout as switch. Use z.literal(true) to make acceptance mandatory."
                code={CHECKBOX_CODE}
            >
                <SchemaForm
                    schema={checkboxSchema}
                    defaultValues={{ newsletter: false }}
                    fields={[
                        { name: "accept_terms", component: "checkbox", label: "I accept the Terms of Service and Privacy Policy", required: true,  colSpan: 2 },
                        { name: "newsletter",   component: "checkbox", label: "Subscribe to product updates and newsletter",                        colSpan: 2 },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Create account"
                    columns={2}
                />
            </ExampleBlock>
            <PropsTable
                title="Switch & Checkbox props"
                rows={[
                    { name: "component", type: '"switch" | "checkbox"', description: "Field type discriminator" },
                    { name: "inputClassName", type: "string", description: "CSS classes on the switch/checkbox element" },
                ]}
            />
        </div>
    );
}

const SWITCH_CODE = `\
const schema = z.object({
    is_public:    z.boolean().default(false),
    email_notify: z.boolean().default(true),
    dark_mode:    z.boolean().default(false),
});

<SchemaForm
    schema={schema}
    defaultValues={{ is_public: false, email_notify: true, dark_mode: false }}
    fields={[
        { name: "is_public",    component: "switch", label: "Public profile",
          description: "Your profile will be visible to everyone.", colSpan: 2 },
        { name: "email_notify", component: "switch", label: "Email notifications",
          description: "Receive updates about your account activity.", colSpan: 2 },
        { name: "dark_mode",    component: "switch", label: "Dark mode",
          description: "Toggle dark interface theme.", colSpan: 2 },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;

const CHECKBOX_CODE = `\
const schema = z.object({
    // z.literal(true) makes acceptance mandatory
    accept_terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
    newsletter:   z.boolean().default(false),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "accept_terms", component: "checkbox", label: "I accept the Terms of Service", required: true, colSpan: 2 },
        { name: "newsletter",   component: "checkbox", label: "Subscribe to product updates", colSpan: 2 },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
