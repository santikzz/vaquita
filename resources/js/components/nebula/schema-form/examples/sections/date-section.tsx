import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    birth_date:  z.string().date("Select a date").optional(),
    start_date:  z.string().date("Select a date"),
    appointment: z.string().date("Select a date"),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function DateSection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Date picker"
            badge="date"
            description="Calendar popover with month/year dropdowns. Localized via i18n. Stores ISO strings by default."
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                fields={[
                    {
                        name: "birth_date",
                        component: "date",
                        label: "Date of birth",
                        description: "Month/year dropdowns - no more clicking through months.",
                        placeholder: "Pick a date",
                        startYear: 1920,
                        endYear: new Date().getFullYear(),
                    },
                    {
                        name: "start_date",
                        component: "date",
                        label: "Start date",
                        displayFormat: "dd/MM/yyyy",
                        description: "Custom display format: dd/MM/yyyy",
                        placeholder: "Pick a date",
                        required: true,
                    },
                    {
                        name: "appointment",
                        component: "date",
                        label: "Appointment",
                        description: "Past dates are disabled.",
                        placeholder: "Pick a future date",
                        disabledDates: { before: new Date() },
                        colSpan: 2,
                    },
                ]}
                onSubmit={onSubmit}
                submitLabel="Submit"
                columns={2}
            />
        </ExampleBlock>
        <PropsTable
            title="DateFieldConfig props"
            rows={[
                { name: "component", type: '"date"', description: "Field type discriminator" },
                { name: "displayFormat", type: "string", default: '"PPP"', description: 'date-fns format string for the trigger label (e.g. "dd/MM/yyyy")' },
                { name: "valueFormat", type: '"iso" | "datetime" | "date"', default: '"iso"', description: "How the value is stored in form state" },
                { name: "locale", type: "Locale", default: "i18n lang", description: "date-fns Locale override" },
                { name: "startYear", type: "number", default: "1900", description: "Earliest year in the year dropdown" },
                { name: "endYear", type: "number", default: "now + 10", description: "Latest year in the year dropdown" },
                { name: "disabledDates", type: "Matcher | Matcher[]", description: "react-day-picker disabled prop" },
                { name: "inputClassName", type: "string", description: "CSS classes on the trigger button" },
            ]}
        />
        </div>
    );
}

const CODE = `\
import { z } from "zod";
import { SchemaForm } from "@/components/nebula/schema-form";

const schema = z.object({
    birth_date:  z.string().date().optional(),
    start_date:  z.string().date(),
    appointment: z.string().date(),
});

<SchemaForm
    schema={schema}
    fields={[
        {
            name: "birth_date",
            component: "date",
            label: "Date of birth",
            startYear: 1920,
            endYear: 2025,
        },
        {
            name: "start_date",
            component: "date",
            label: "Start date",
            displayFormat: "dd/MM/yyyy",
            required: true,
        },
        {
            name: "appointment",
            component: "date",
            label: "Appointment",
            disabledDates: { before: new Date() },
            colSpan: 2,
        },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
