import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Enter a valid phone number" })
        .or(z.literal("")),
    emergency_phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Enter a valid phone number" })
        .optional()
        .or(z.literal("")),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function PhoneSection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Phone input"
            badge="phone"
            description="Country flag selector + E.164 formatted input. Validate with isValidPhoneNumber from react-phone-number-input."
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                fields={[
                    {
                        name: "phone",
                        component: "phone",
                        label: "Phone number",
                        placeholder: "+1 555 000 0000",
                        required: true,
                    },
                    {
                        name: "emergency_phone",
                        component: "phone",
                        label: "Emergency contact",
                        placeholder: "+1 555 000 0000",
                        description: "Optional secondary contact.",
                    },
                ]}
                onSubmit={onSubmit}
                submitLabel="Submit"
                columns={2}
            />
        </ExampleBlock>
        <PropsTable
            title="PhoneFieldConfig props"
            rows={[
                { name: "component", type: '"phone"', description: "Field type discriminator" },
                { name: "inputClassName", type: "string", description: "CSS classes on the phone input" },
            ]}
        />
        </div>
    );
}

const CODE = `\
import { isValidPhoneNumber } from "react-phone-number-input";

const schema = z.object({
    phone: z.string()
        .refine(isValidPhoneNumber, { message: "Enter a valid phone number" })
        .or(z.literal("")),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "phone", component: "phone", label: "Phone number",
          placeholder: "+1 555 000 0000", required: true },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;
