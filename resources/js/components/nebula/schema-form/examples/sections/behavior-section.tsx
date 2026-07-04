import { z } from "zod";
import { SaveIcon } from "lucide-react";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";

const schema = z.object({
    name:     z.string().min(2, "At least 2 characters"),
    email:    z.string().email("Invalid email"),
    bio:      z.string().optional(),
});

const defaultValues = {
    name:  "John Doe",
    email: "john@example.com",
    bio:   "Hello world",
};

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function BehaviorSection() {
    return (
        <div className="flex flex-col gap-8">
            <ExampleBlock
                title="onlySubmitIfDirty"
                badge="edit mode"
                description="Submit is disabled until the user changes at least one value. Ideal for update forms to avoid redundant API calls."
                code={DIRTY_CODE}
            >
                <SchemaForm
                    schema={schema}
                    defaultValues={defaultValues}
                    fields={[
                        { name: "name",  component: "input",    label: "Full name" },
                        { name: "email", component: "input",    label: "Email", type: "email" },
                        { name: "bio",   component: "textarea", label: "Bio", colSpan: 2, rows: 3 },
                    ]}
                    onSubmit={onSubmit}
                    onlySubmitIfDirty
                    submitLabel="Save changes"
                    submitIcon={SaveIcon}
                    columns={2}
                />
            </ExampleBlock>

            <ExampleBlock
                title="onlySubmitIfValid"
                badge="real-time lock"
                description="Submit stays disabled while any field has a validation error. Try submitting with an empty or invalid email."
                code={VALID_CODE}
            >
                <SchemaForm
                    schema={schema}
                    fields={[
                        { name: "name",  component: "input", label: "Full name",  required: true },
                        { name: "email", component: "input", label: "Email",      required: true, type: "email" },
                    ]}
                    onSubmit={onSubmit}
                    onlySubmitIfValid
                    submitLabel="Submit (locked until valid)"
                    columns={2}
                />
            </ExampleBlock>

            <ExampleBlock
                title="Conditional field visibility"
                badge="hidden"
                description="Toggle the switch to reveal the hidden field. Controlled by hidden: (values) => boolean."
                code={HIDDEN_CODE}
            >
                <SchemaForm
                    schema={z.object({
                        send_message: z.boolean().default(false),
                        message:      z.string().min(1, "Required").optional(),
                    })}
                    defaultValues={{ send_message: false }}
                    fields={[
                        {
                            name: "send_message",
                            component: "switch",
                            label: "Include a personal message",
                            description: "The recipient will see this message.",
                            colSpan: 2,
                        },
                        {
                            name: "message",
                            component: "textarea",
                            label: "Personal message",
                            placeholder: "Write your message here...",
                            rows: 3,
                            colSpan: 2,
                            hidden: (values) => !values.send_message,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Send"
                    columns={2}
                />
            </ExampleBlock>
        </div>
    );
}

const DIRTY_CODE = `\
// Edit form - submit disabled until user changes something
<SchemaForm
    schema={schema}
    defaultValues={existingUser}
    fields={[...]}
    onSubmit={(data) => router.put(route("users.update", id), data)}
    onlySubmitIfDirty       // <-- the magic prop
    submitLabel="Save changes"
    submitIcon={SaveIcon}
/>`;

const VALID_CODE = `\
// Submit locked while errors exist (fires after first touch)
<SchemaForm
    schema={schema}
    fields={[...]}
    onSubmit={(data) => console.log(data)}
    onlySubmitIfValid       // <-- keeps button disabled while form.isValid === false
/>`;

const HIDDEN_CODE = `\
<SchemaForm
    schema={z.object({
        send_message: z.boolean().default(false),
        message:      z.string().optional(),
    })}
    defaultValues={{ send_message: false }}
    fields={[
        { name: "send_message", component: "switch",   label: "Include a message", colSpan: 2 },
        { name: "message",      component: "textarea", label: "Personal message",  colSpan: 2,
          // Field removed from DOM (and validation) when false
          hidden: (values) => !values.send_message,
        },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
