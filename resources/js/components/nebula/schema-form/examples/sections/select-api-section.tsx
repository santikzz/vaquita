import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    category_id: z.string().min(1, "Select a category").nullable(),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function SelectApiSection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Select with API search"
            badge="select-api"
            description={
                "Fetches options from a URL with live debounced search (300ms). " +
                "AbortController cancels in-flight requests. " +
                "Includes an inline clear button and error state. " +
                "The demo below uses /api/categories - replace with any JSON endpoint returning [{id, name}]."
            }
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                fields={[
                    {
                        name: "category_id",
                        component: "select-api",
                        label: "Category",
                        route: "/api/categories",
                        labelKey: "name",
                        valueKey: "id",
                        placeholder: "Search categories...",
                        description: "Requires a backend route - see code tab for the Laravel pattern.",
                    },
                ]}
                onSubmit={onSubmit}
                submitLabel="Submit"
                layout="stack"
            />
        </ExampleBlock>
        <PropsTable
            title="SelectApiFieldConfig props"
            rows={[
                { name: "component", type: '"select-api"', description: "Field type discriminator" },
                { name: "route", type: "string", description: "URL endpoint returning JSON array" },
                { name: "labelKey", type: "string", default: '"name"', description: "Key in each item for display label" },
                { name: "valueKey", type: "string", default: '"id"', description: "Key in each item for stored value" },
                { name: "inputClassName", type: "string", description: "CSS classes on the trigger button" },
            ]}
        />
        </div>
    );
}

const CODE = `\
// Frontend
const schema = z.object({
    category_id: z.string().nullable(),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "category_id", component: "select-api", label: "Category",
          route: "/api/categories",
          labelKey: "name",
          valueKey: "id",
          placeholder: "Search categories..." },
    ]}
    onSubmit={(data) => console.log(data)}
/>

// Backend (Laravel) - routes/api.php or web.php
Route::get("/api/categories", function (Request $request) {
    return Category::query()
        ->when($request->q, fn ($q, $s) => $q->where("name", "ilike", "%{$s}%"))
        ->limit($request->limit ?? 10)
        ->get(["id", "name"]);
});`;
