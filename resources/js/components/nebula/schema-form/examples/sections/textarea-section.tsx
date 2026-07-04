import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    bio:     z.string().min(10, "At least 10 characters").max(300),
    notes:   z.string().optional(),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function TextareaSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="Textarea"
                badge="textarea"
                description="Multi-line text input with configurable row height."
                code={CODE}
            >
                <SchemaForm
                    schema={schema}
                    fields={[
                        { name: "bio",   component: "textarea", label: "Bio",   placeholder: "Tell us a little about yourself...", rows: 4, description: "Max 300 characters.", colSpan: 2 },
                        { name: "notes", component: "textarea", label: "Notes", placeholder: "Optional internal notes...", rows: 3, colSpan: 2 },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Submit"
                    columns={2}
                />
            </ExampleBlock>
            <PropsTable
                title="TextareaFieldConfig props"
                rows={[
                    { name: "component", type: '"textarea"', description: "Field type discriminator" },
                    { name: "rows", type: "number", default: "4", description: "Number of visible text rows" },
                    { name: "inputClassName", type: "string", description: 'CSS classes on the textarea (e.g. "min-h-[200px]")' },
                ]}
            />
        </div>
    );
}

const CODE = `\
const schema = z.object({
    bio:   z.string().min(10).max(300),
    notes: z.string().optional(),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "bio",   component: "textarea", label: "Bio",   rows: 4,
          description: "Max 300 characters.", colSpan: 2 },
        { name: "notes", component: "textarea", label: "Notes", rows: 3, colSpan: 2 },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
