import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

const schema = z.object({
    price_eur:   z.coerce.number().min(0, "Must be ≥ 0"),
    price_usd:   z.coerce.number().min(0, "Must be ≥ 0"),
    amount_only: z.coerce.number().min(0, "Must be ≥ 0"),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function CurrencySection() {
    return (
        <div className="flex flex-col gap-6">
        <ExampleBlock
            title="Currency input"
            badge="currency"
            description="Numeric input with leading currency symbol and trailing ISO code. Normalises to a float on blur."
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                fields={[
                    { name: "price_eur",   component: "currency", label: "Euros",        currencySymbol: "€",  currencyCode: "EUR",  placeholder: "0.00" },
                    { name: "price_usd",   component: "currency", label: "US Dollars",   currencySymbol: "$",  currencyCode: "USD",  placeholder: "0.00" },
                    { name: "amount_only", component: "currency", label: "Symbol only",  currencySymbol: "£",  placeholder: "0.00" },
                ]}
                onSubmit={onSubmit}
                submitLabel="Submit"
                columns={2}
            />
        </ExampleBlock>
        <PropsTable
            title="CurrencyFieldConfig props"
            rows={[
                { name: "component", type: '"currency"', description: "Field type discriminator" },
                { name: "currencySymbol", type: "string", description: 'Leading symbol (e.g. "€", "$", "£")' },
                { name: "currencyCode", type: "string", description: 'Trailing ISO code (e.g. "EUR", "USD")' },
                { name: "inputClassName", type: "string", description: "CSS classes on the input element" },
            ]}
        />
        </div>
    );
}

const CODE = `\
const schema = z.object({
    price_eur:   z.coerce.number().min(0),
    price_usd:   z.coerce.number().min(0),
    amount_only: z.coerce.number().min(0),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "price_eur",   component: "currency", label: "Euros",       currencySymbol: "€", currencyCode: "EUR" },
        { name: "price_usd",   component: "currency", label: "US Dollars",  currencySymbol: "$", currencyCode: "USD" },
        { name: "amount_only", component: "currency", label: "Symbol only", currencySymbol: "£" },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
