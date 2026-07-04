import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function SliderSection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Slider"
            badge="slider"
            description="Range slider with optional live value display. Configure min, max, and step."
            code={CODE}
        >
            <SchemaForm
                schema={z.object({
                    volume:   z.number().min(0).max(100),
                    discount: z.number().min(0).max(50),
                    rating:   z.number().min(1).max(5),
                })}
                defaultValues={{ volume: 60, discount: 10, rating: 3 }}
                fields={[
                    {
                        name: "volume",
                        component: "slider",
                        label: "Volume",
                        min: 0, max: 100, step: 1,
                        showValue: true,
                        description: "0 – 100",
                    },
                    {
                        name: "discount",
                        component: "slider",
                        label: "Max discount",
                        min: 0, max: 50, step: 5,
                        showValue: true,
                        description: "Applied at checkout (steps of 5).",
                    },
                    {
                        name: "rating",
                        component: "slider",
                        label: "Min rating filter",
                        min: 1, max: 5, step: 1,
                        showValue: true,
                        description: "Show products rated at least this.",
                    },
                ]}
                onSubmit={onSubmit}
                submitLabel="Apply"
                columns={2}
            />
        </ExampleBlock>
        <PropsTable
            title="SliderFieldConfig props"
            rows={[
                { name: "component", type: '"slider"', description: "Field type discriminator" },
                { name: "min", type: "number", default: "0", description: "Minimum value" },
                { name: "max", type: "number", default: "100", description: "Maximum value" },
                { name: "step", type: "number", default: "1", description: "Step increment" },
                { name: "showValue", type: "boolean", default: "false", description: "Display current value to the right of the track" },
                { name: "inputClassName", type: "string", description: "CSS classes on the slider element" },
            ]}
        />
        </div>
    );
}

const CODE = `\
const schema = z.object({
    volume:   z.number().min(0).max(100),
    discount: z.number().min(0).max(50),
});

<SchemaForm
    schema={schema}
    defaultValues={{ volume: 60, discount: 10 }}
    fields={[
        { name: "volume",   component: "slider", label: "Volume",
          min: 0, max: 100, step: 1, showValue: true },
        { name: "discount", component: "slider", label: "Max discount (%)",
          min: 0, max: 50,  step: 5, showValue: true,
          description: "Applied at checkout (steps of 5)." },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
