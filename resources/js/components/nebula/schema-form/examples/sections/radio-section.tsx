import { CreditCardIcon } from "lucide-react";
import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function RadioSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="Radio - vertical (with descriptions)"
                badge="radio"
                description="Stacked list. Each option can have an optional description line."
                code={VERTICAL_CODE}
                typeCode={RADIO_TYPE}
            >
                <SchemaForm
                    schema={z.object({ plan: z.enum(["free", "pro", "enterprise"]) })}
                    fields={[
                        {
                            name: "plan",
                            component: "radio",
                            label: "Subscription plan",
                            options: [
                                { label: "Free",       value: "free",       description: "Up to 3 products, community support." },
                                { label: "Pro",        value: "pro",        description: "Unlimited products, priority support, analytics." },
                                { label: "Enterprise", value: "enterprise", description: "Custom limits, SLA, dedicated account manager." },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Continue"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="Radio - horizontal"
                badge="radio · horizontal"
                description="Inline row layout. Best for short labels or size pickers."
                code={HORIZONTAL_CODE}
            >
                <SchemaForm
                    schema={z.object({ size: z.enum(["sm", "md", "lg", "xl"]) })}
                    fields={[
                        {
                            name: "size",
                            component: "radio",
                            label: "Size",
                            orientation: "horizontal",
                            options: [
                                { label: "Small",       value: "sm" },
                                { label: "Medium",      value: "md" },
                                { label: "Large",       value: "lg" },
                                { label: "Extra large", value: "xl" },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Add to cart"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="Radio - plan cards"
                badge="radio · variant: cards"
                description="Bordered stacked list with optional badge and right-aligned metadata."
                code={PLAN_CARDS_CODE}
            >
                <SchemaForm
                    schema={z.object({ plan: z.enum(["hobby", "plus", "team", "enterprise"]) })}
                    fields={[
                        {
                            name: "plan",
                            component: "radio",
                            label: "Choose plan",
                            variant: "cards",
                            options: [
                                { label: "Hobby",      value: "hobby",      meta: "$9/mo" },
                                { label: "Plus",       value: "plus",       meta: "$29/mo", badge: "Popular" },
                                { label: "Team",       value: "team",       meta: "$49/mo" },
                                { label: "Enterprise", value: "enterprise", meta: "Custom" },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Continue"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="Radio - icon cards"
                badge="radio · variant: cards · icon"
                description="One card per option with an icon, sublabel, and description. Triggered automatically when any option has an icon."
                code={ICON_CARDS_CODE}
            >
                <SchemaForm
                    schema={z.object({ method: z.enum(["card", "paypal", "bank"]) })}
                    fields={[
                        {
                            name: "method",
                            component: "radio",
                            label: "Payment method",
                            variant: "cards",
                            options: [
                                {
                                    label: "Credit card",
                                    value: "card",
                                    sublabel: "Visa, Mastercard",
                                    description: "Charged immediately. Refunds take 3–5 business days.",
                                    icon: <CreditCardIcon size={24} className="text-muted-foreground" />,
                                },
                                {
                                    label: "PayPal",
                                    value: "paypal",
                                    sublabel: "PayPal balance or linked card",
                                    description: "Redirects to PayPal to complete payment.",
                                    icon: <CreditCardIcon size={24} className="text-muted-foreground" />,
                                },
                                {
                                    label: "Bank transfer",
                                    value: "bank",
                                    sublabel: "ACH / SEPA",
                                    description: "Takes 2–3 business days to process.",
                                    icon: <CreditCardIcon size={24} className="text-muted-foreground" />,
                                },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Continue"
                    layout="stack"
                />
            </ExampleBlock>
            <PropsTable
                title="RadioFieldConfig props"
                rows={[
                    { name: "component", type: '"radio"', description: "Field type discriminator" },
                    { name: "options", type: "RadioOption[]", description: "Options with label, value, description, sublabel, badge, meta, icon" },
                    { name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Layout direction (default variant only)" },
                    { name: "variant", type: '"default" | "cards"', default: '"default"', description: "Visual style - cards uses bordered list" },
                    { name: "inputClassName", type: "string", description: "CSS classes on the radio group container" },
                ]}
            />
        </div>
    );
}

// ─── Type definition ──────────────────────────────────────────────────────────

const RADIO_TYPE = `\
type RadioFieldConfig = BaseFieldConfig & {
    component: "radio";
    options: {
        label: string;
        value: string;
        description?: string;  // helper text below the label (all variants)
        sublabel?: string;     // small text appended in parentheses (icon cards)
        badge?: string;        // inline badge e.g. "Popular" (cards variant)
        meta?: string;         // right-aligned text e.g. "$29/mo" (cards variant)
        icon?: ReactNode;      // leading icon - triggers icon card layout (cards variant)
    }[];
    orientation?: "horizontal" | "vertical";  // default variant only - default: "vertical"
    variant?: "default" | "cards";            // default: "default"
};

// Shared by all field types:
interface BaseFieldConfig {
    name: string;
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    colSpan?: 1 | 2 | 3;
    icon?: ElementType;
    hidden?: boolean | ((values: FieldValues) => boolean);
}`;

// ─── Code snippets ────────────────────────────────────────────────────────────

const VERTICAL_CODE = `\
<SchemaForm
    schema={z.object({ plan: z.enum(["free", "pro", "enterprise"]) })}
    fields={[
        { name: "plan", component: "radio", label: "Plan",
          options: [
              { label: "Free",       value: "free",       description: "Up to 3 products." },
              { label: "Pro",        value: "pro",        description: "Unlimited products." },
              { label: "Enterprise", value: "enterprise", description: "Custom limits." },
          ],
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const HORIZONTAL_CODE = `\
<SchemaForm
    schema={z.object({ size: z.enum(["sm", "md", "lg", "xl"]) })}
    fields={[
        { name: "size", component: "radio", label: "Size", orientation: "horizontal",
          options: [
              { label: "Small",  value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large",  value: "lg" },
              { label: "XL",     value: "xl" },
          ],
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const PLAN_CARDS_CODE = `\
<SchemaForm
    schema={z.object({ plan: z.enum(["hobby", "plus", "team", "enterprise"]) })}
    fields={[
        { name: "plan", component: "radio", label: "Choose plan", variant: "cards",
          options: [
              { label: "Hobby",      value: "hobby",      meta: "$9/mo" },
              { label: "Plus",       value: "plus",       meta: "$29/mo", badge: "Popular" },
              { label: "Team",       value: "team",       meta: "$49/mo" },
              { label: "Enterprise", value: "enterprise", meta: "Custom" },
          ],
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;

const ICON_CARDS_CODE = `\
<SchemaForm
    schema={z.object({ method: z.enum(["card", "paypal", "bank"]) })}
    fields={[
        { name: "method", component: "radio", label: "Payment method", variant: "cards",
          options: [
              { label: "Credit card",   value: "card",   sublabel: "Visa, Mastercard",
                description: "Charged immediately.",
                icon: <CreditCardIcon size={24} />,
              },
              { label: "PayPal",        value: "paypal", sublabel: "PayPal balance or linked card",
                description: "Redirects to PayPal.",
                icon: <PaypalIcon size={24} />,
              },
              { label: "Bank transfer", value: "bank",   sublabel: "ACH / SEPA",
                description: "Takes 2–3 business days.",
                icon: <BankIcon size={24} />,
              },
          ],
        },
    ]}
    onSubmit={(data) => console.log(data)}
/>`;
