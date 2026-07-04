import { useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";

/** Inline tag input - used as a `custom` field example */
function TagInput({
    value,
    onChange,
}: {
    value: string[];
    onChange: (v: string[]) => void;
}) {
    const [input, setInput] = useState("");

    const addTag = () => {
        const trimmed = input.trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
        setInput("");
    };

    const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag();
                        }
                        if (e.key === "Backspace" && !input && value.length) {
                            removeTag(value[value.length - 1]);
                        }
                    }}
                    placeholder="Type and press Enter or comma..."
                />
            </div>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 pr-1.5 font-normal">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-0.5 rounded-sm text-muted-foreground hover:text-foreground"
                                aria-label={`Remove ${tag}`}
                            >
                                <X size={11} />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

const schema = z.object({
    title: z.string().min(3, "At least 3 characters"),
    tags:  z.array(z.string()).min(1, "Add at least one tag"),
});

function onSubmit(data: unknown) {
    alert(JSON.stringify(data, null, 2));
}

export function CustomSection() {
    return (
        <ExampleBlock
            title="Custom field"
            badge="custom"
            description={
                "Full escape hatch. The render() function receives the RHF field, all current values, " +
                "and the form instance. Use it for any component that doesn't map to a built-in type " +
                "- tag inputs, colour pickers, rich text editors, image croppers, etc."
            }
            code={CODE}
        >
            <SchemaForm
                schema={schema}
                defaultValues={{ tags: [] }}
                fields={[
                    {
                        name: "title",
                        component: "input",
                        label: "Post title",
                        placeholder: "My awesome post",
                        colSpan: 2,
                    },
                    {
                        name: "tags",
                        component: "custom",
                        label: "Tags",
                        description: "Press Enter or comma to add. Backspace removes the last tag.",
                        colSpan: 2,
                        render: (field) => (
                            <TagInput
                                value={field.value ?? []}
                                onChange={field.onChange}
                            />
                        ),
                    },
                ]}
                onSubmit={onSubmit}
                submitLabel="Publish"
                columns={2}
            />
        </ExampleBlock>
    );
}

const CODE = `\
// 1. Build your component however you like
function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
    const [input, setInput] = useState("");
    const addTag = () => { /* ... */ };
    return (
        <div>
            <Input value={input} onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && addTag()} />
            {value.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
    );
}

// 2. Drop it into a "custom" field
<SchemaForm
    schema={z.object({ tags: z.array(z.string()).min(1) })}
    defaultValues={{ tags: [] }}
    fields={[
        { name: "tags", component: "custom", label: "Tags", colSpan: 2,
          // field  -> RHF ControllerRenderProps  (value, onChange, onBlur, ref)
          // values -> all current form values    (read siblings)
          // form   -> full UseFormReturn          (setValue, trigger, etc.)
          render: (field, values, form) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} />
          ),
        },
    ]}
    onSubmit={(data) => console.log(data)}
    columns={2}
/>`;
