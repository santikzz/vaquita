import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const COUNTRY_OPTIONS = [
    { label: "Argentina",      value: "ar" },
    { label: "Australia",      value: "au" },
    { label: "Brazil",         value: "br" },
    { label: "Canada",         value: "ca" },
    { label: "Chile",          value: "cl" },
    { label: "Colombia",       value: "co" },
    { label: "France",         value: "fr" },
    { label: "Germany",        value: "de" },
    { label: "India",          value: "in" },
    { label: "Japan",          value: "jp" },
    { label: "Mexico",         value: "mx" },
    { label: "Netherlands",    value: "nl" },
    { label: "Spain",          value: "es" },
    { label: "United Kingdom", value: "gb" },
    { label: "United States",  value: "us" },
];

const schema = z.object({
    status:  z.enum(["active", "inactive", "draft"]),
    country: z.string().min(1, "Select a country"),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function SelectSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="Select - plain dropdown"
                badge="select"
                description="Native-style dropdown using shadcn Select primitives."
                code={PLAIN_CODE}
            >
                <SchemaForm
                    schema={z.object({ status: z.enum(["active", "inactive", "draft"]) })}
                    fields={[
                        {
                            name: "status",
                            component: "select",
                            label: "Status",
                            placeholder: "Select a status",
                            options: [
                                { label: "Active",   value: "active" },
                                { label: "Inactive", value: "inactive" },
                                { label: "Draft",    value: "draft" },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Submit"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="Select - searchable combobox"
                badge="select · searchable"
                description="Same API - add searchable: true to get a Command-powered combobox with a search field."
                code={SEARCHABLE_CODE}
            >
                <SchemaForm
                    schema={z.object({ country: z.string().min(1, "Select a country") })}
                    fields={[
                        {
                            name: "country",
                            component: "select",
                            label: "Country",
                            placeholder: "Select a country",
                            searchable: true,
                            searchPlaceholder: "Search countries...",
                            emptyText: "No country found.",
                            options: COUNTRY_OPTIONS,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Submit"
                    layout="stack"
                />
            </ExampleBlock>
            <PropsTable
                title="SelectFieldConfig props"
                rows={[
                    { name: "component", type: '"select"', description: "Field type discriminator" },
                    { name: "options", type: "{ label: string; value: string }[]", description: "Static options list" },
                    { name: "searchable", type: "boolean", default: "false", description: "Use a searchable combobox instead of plain select" },
                    { name: "searchPlaceholder", type: "string", description: "Placeholder in the search input (combobox mode)" },
                    { name: "emptyText", type: "string", description: "Text shown when no options match the search" },
                    { name: "inputClassName", type: "string", description: "CSS classes on the trigger element" },
                ]}
            />
        </div>
    );
}

const PLAIN_CODE = `\
const schema = z.object({
    status: z.enum(["active", "inactive", "draft"]),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "status", component: "select", label: "Status",
          placeholder: "Select a status",
          options: [
              { label: "Active",   value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Draft",    value: "draft" },
          ],
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const SEARCHABLE_CODE = `\
<SchemaForm
    schema={z.object({ country: z.string().min(1) })}
    fields={[
        { name: "country", component: "select", label: "Country",
          searchable: true,
          searchPlaceholder: "Search countries...",
          options: COUNTRY_OPTIONS,
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;
