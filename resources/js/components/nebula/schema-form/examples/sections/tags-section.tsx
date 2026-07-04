import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    skills:     z.array(z.string()).min(1, "Add at least one skill"),
    categories: z.array(z.string()).optional(),
    framework:  z.array(z.string()).optional(),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function TagsSection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Tags input"
            badge="tags"
            description="Free-form tag entry (Enter / comma) or searchable autocomplete from a fixed options list."
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                fields={[
                    {
                        name: "skills",
                        component: "tags",
                        label: "Skills",
                        description: "Press Enter or comma to add. Backspace removes the last tag.",
                        placeholder: "e.g. TypeScript",
                        required: true,
                    },
                    {
                        name: "categories",
                        component: "tags",
                        label: "Categories (max 3)",
                        description: "Free-form, max 3 tags.",
                        max: 3,
                    },
                    {
                        name: "framework",
                        component: "tags",
                        label: "Framework (searchable)",
                        description: "Pick from the list - only listed values allowed.",
                        options: ["React", "Vue", "Angular", "Svelte", "Solid", "Qwik", "Astro", "Next.js", "Nuxt", "Remix"],
                        strict: true,
                        colSpan: 2,
                    },
                ]}
                onSubmit={onSubmit}
                submitLabel="Submit"
                columns={2}
            />
        </ExampleBlock>
        <PropsTable
            title="TagsFieldConfig props"
            rows={[
                { name: "component", type: '"tags"', description: "Field type discriminator" },
                { name: "options", type: "string[]", description: "Autocomplete suggestions - enables dropdown" },
                { name: "strict", type: "boolean", default: "false", description: "Only allow values from the options list" },
                { name: "max", type: "number", description: "Maximum number of tags allowed" },
                { name: "inputClassName", type: "string", description: "CSS classes on the tags container" },
            ]}
        />
        </div>
    );
}

const CODE = `\
import { z } from "zod";
import { SchemaForm } from "@/components/nebula/schema-form";

const schema = z.object({
    skills:     z.array(z.string()).min(1),
    categories: z.array(z.string()).optional(),
    framework:  z.array(z.string()).optional(),
});

<SchemaForm
    schema={schema}
    fields={[
        {
            name: "skills",
            component: "tags",
            label: "Skills",
            placeholder: "e.g. TypeScript",
            required: true,
        },
        {
            name: "categories",
            component: "tags",
            label: "Categories",
            max: 3,
        },
        {
            name: "framework",
            component: "tags",
            label: "Framework",
            options: ["React", "Vue", "Angular", "Svelte", "Solid"],
            strict: true,
            colSpan: 2,
        },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
