import { z } from "zod";
import { AtSignIcon, GlobeIcon, SearchIcon } from "lucide-react";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    username:  z.string().min(2, "At least 2 characters"),
    email:     z.string().email("Invalid email"),
    website:   z.string().url("Invalid URL").optional().or(z.literal("")),
    handle:    z.string().min(1, "Required"),
    price:     z.number({ invalid_type_error: "Enter a number" }).min(0),
    weight:    z.number({ invalid_type_error: "Enter a number" }).min(0),
    query:     z.string().optional(),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function InputSection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Input"
            badge="input"
            description="Text, number, email, url inputs - with icons, prefixes and suffixes."
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                fields={[
                    { name: "username", component: "input", label: "Plain text",       placeholder: "johndoe" },
                    { name: "email",    component: "input", label: "With icon",        type: "email", icon: AtSignIcon, placeholder: "you@example.com" },
                    { name: "website",  component: "input", label: "URL with icon",    type: "url",   icon: GlobeIcon,  placeholder: "https://example.com" },
                    { name: "handle",   component: "input", label: "Text prefix (@)",  prefix: "@",   placeholder: "yourhandle" },
                    { name: "price",    component: "input", label: "Number + suffix",  type: "number", min: 0, step: 0.01, suffix: "USD" },
                    { name: "weight",   component: "input", label: "Number + suffix",  type: "number", min: 0, suffix: "kg" },
                    { name: "query",    component: "input", label: "Search with icon", icon: SearchIcon, placeholder: "Search..." },
                ]}
                onSubmit={onSubmit}
                submitLabel="Submit"
                columns={2}
            />
        </ExampleBlock>
        <PropsTable
            title="InputFieldConfig props"
            rows={[
                { name: "component", type: '"input"', description: "Field type discriminator" },
                { name: "type", type: '"text" | "email" | "number" | "url" | "tel"', default: '"text"', description: "HTML input type" },
                { name: "min", type: "number", description: "Minimum value (number type)" },
                { name: "max", type: "number", description: "Maximum value (number type)" },
                { name: "step", type: "number", description: "Step increment (number type)" },
                { name: "prefix", type: "string", description: 'Leading text adornment (e.g. "$", "https://")' },
                { name: "suffix", type: "string", description: 'Trailing text adornment (e.g. "USD", "%", "kg")' },
                { name: "icon", type: "ElementType", description: "Leading icon (takes priority over prefix)" },
                { name: "inputClassName", type: "string", description: "CSS classes on the input element" },
            ]}
        />
        </div>
    );
}

const CODE = `\
import { z } from "zod";
import { AtSignIcon, GlobeIcon, SearchIcon } from "lucide-react";
import { SchemaForm } from "@/components/nebula/schema-form";

const schema = z.object({
    username: z.string().min(2),
    email:    z.string().email(),
    website:  z.string().url().optional().or(z.literal("")),
    handle:   z.string().min(1),
    price:    z.number().min(0),
    weight:   z.number().min(0),
    query:    z.string().optional(),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "username", component: "input", label: "Plain text",      placeholder: "johndoe" },
        { name: "email",    component: "input", label: "With icon",       type: "email", icon: AtSignIcon },
        { name: "website",  component: "input", label: "URL with icon",   type: "url",   icon: GlobeIcon },
        { name: "handle",   component: "input", label: "Text prefix (@)", prefix: "@" },
        { name: "price",    component: "input", label: "Number + suffix", type: "number", min: 0, suffix: "USD" },
        { name: "weight",   component: "input", label: "Number + suffix", type: "number", min: 0, suffix: "kg" },
        { name: "query",    component: "input", label: "Search",          icon: SearchIcon },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
