# SchemaForm

Schema-driven forms built on **React Hook Form** + **Zod** + **shadcn/ui**.  
Define your fields once as a typed config array and get a fully validated, accessible form - labels, errors, responsive grid layout, and submit handling included.

---

## Quick start

```tsx
import { z } from "zod";
import { SchemaForm } from "@/components/nebula/schema-form";

const schema = z.object({
    name:  z.string().min(2, "At least 2 characters"),
    email: z.string().email(),
    role:  z.enum(["admin", "editor", "viewer"]),
});

export default function CreateUserPage() {
    return (
        <SchemaForm
            schema={schema}
            fields={[
                { name: "name",  component: "input",  label: "Full name", required: true },
                { name: "email", component: "input",  label: "Email",     type: "email" },
                { name: "role",  component: "select", label: "Role",
                  options: [
                      { label: "Admin",  value: "admin"  },
                      { label: "Editor", value: "editor" },
                      { label: "Viewer", value: "viewer" },
                  ],
                },
            ]}
            onSubmit={(data) => console.log(data)}
            submitLabel="Create user"
        />
    );
}
```

---

## With Inertia (Laravel)

### Basic submit

```tsx
import { router, usePage } from "@inertiajs/react";

const { errors } = usePage().props;

const onSubmit = (data) => {
    router.post(route("users.update", user.id), data);
};

<SchemaForm
    schema={schema}
    fields={fields}
    defaultValues={user}          // edit mode: pre-populate from server
    serverErrors={errors}         // auto-mapped to the right fields
    loading={processing}
    onlySubmitIfDirty             // keep submit disabled until a value changes
    submitLabel="Save changes"
    onSubmit={onSubmit}           // set submit handler
/>
```

### File uploads (FormData)

Use `toFormData` when the form includes `file` fields - it handles Files, arrays,
booleans, and Dates correctly so you don't have to write the conversion by hand.

```tsx
import { SchemaForm, toFormData } from "@/components/nebula/schema-form";

const onSubmit = (data) => {
    router.post(route("products.store"), toFormData(data)); // convert to FormData for file uploads
};

<SchemaForm
    schema={schema}
    fields={fields}
    onSubmit={onSubmit}
/>
```

`toFormData` conversion rules:

| Value type | FormData output |
|---|---|
| `null` / `undefined` | skipped |
| `File` / `Blob` | appended as-is |
| `boolean` | `"1"` / `"0"` |
| `Date` | ISO string |
| `Array` | each item appended as `key[]` |
| plain object | `JSON.stringify(value)` |
| everything else | `String(value)` |

---

## Layout

Fields are placed in a responsive CSS grid. On mobile they always collapse to 1 column.

```tsx
<SchemaForm layout="grid" columns={2} ... />  // default - 2 columns on md+
<SchemaForm layout="grid" columns={3} ... />  // 3 columns on lg+
<SchemaForm layout="stack" ... />             // linear, no grid
```

Stretch a field across columns with `colSpan`:

```tsx
{ name: "notes", component: "textarea", colSpan: 2 }  // full width in 2-col grid
{ name: "bio",   component: "textarea", colSpan: 3 }  // full width in any grid
```

---

## SchemaForm props

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `FieldConfig[]` | - | Ordered field descriptors |
| `schema` | `ZodSchema` | - | Zod validation schema |
| `defaultValues` | `object` | - | Initial field values (create mode or edit mode pre-population) |
| `onSubmit` | `(data) => void \| Promise` | - | Called with fully validated data on successful submit |
| `serverErrors` | `Record<string, string>` | - | Inertia `errors` - auto-mapped to matching field names |
| `loading` | `boolean` | `false` | Spinner on submit button + all inputs disabled |
| `submitLabel` | `string` | `"Submit"` | Submit button label |
| `submitIcon` | `ElementType` | - | Lucide icon rendered inside the submit button |
| `submitVariant` | `ButtonVariant` | `"default"` | Submit button variant |
| `layout` | `"grid" \| "stack"` | `"grid"` | Field layout mode |
| `columns` | `1 \| 2 \| 3` | `2` | Grid columns (always 1 on mobile) |
| `disabled` | `boolean` | `false` | Disable all inputs and submit |
| `onlySubmitIfDirty` | `boolean` | `false` | Keep submit disabled until at least one value changes |
| `onlySubmitIfValid` | `boolean` | `false` | Keep submit disabled while the form has validation errors |
| `focusFirstError` | `boolean` | `true` | Scroll to and focus the first errored field on submit |
| `showRequiredIndicator` | `boolean` | `true` | Red `*` after labels for `required: true` fields |
| `onCancel` | `() => void` | - | Renders a Cancel button that calls this handler |
| `cancelLabel` | `string` | `"Cancel"` | Cancel button label |
| `before` | `ReactNode` | - | Rendered above the field grid |
| `after` | `ReactNode` | - | Rendered below the field grid, above the action buttons |
| `formClassName` | `string` | - | Extra classes on the `<form>` element |
| `actionsClassName` | `string` | - | Extra classes on the button row |

---

## Base props (all field types)

| Prop | Type | Description |
|---|---|---|
| `name` | `string` | Must match a key in your Zod schema |
| `label` | `string` | Field label - omit to hide |
| `description` | `string` | Helper text rendered below the input |
| `placeholder` | `string` | Input placeholder |
| `required` | `boolean` | Shows `*` indicator - still enforce in Zod |
| `disabled` | `boolean` | Disables this field only |
| `className` | `string` | Extra classes on the `FormItem` wrapper |
| `inputClassName` | `string` | Extra classes on the input/control element itself (e.g. `min-h-[200px]`) |
| `colSpan` | `1 \| 2 \| 3` | Grid column span |
| `icon` | `ElementType` | Leading icon (supported by `input`, `password`) |
| `hidden` | `boolean \| (values) => boolean` | Hide field conditionally |

---

## Adding a new field type

Four files to touch, nothing else changes.

### 1. Define the config type in `types.ts`

Add a new type extending `BaseFieldConfig`. Use a unique `component` literal - this is the discriminant for the union.

```ts
// types.ts
export type ColorFieldConfig = BaseFieldConfig & {
    component: "color";
    format?: "hex" | "rgb";   // any extra props your field needs
};
```

Then add it to the `FieldConfig` union at the bottom of the file:

```ts
export type FieldConfig =
    | InputFieldConfig
    | ...
    | ColorFieldConfig;   // ← add here
```

### 2. Create the field component in `fields/`

```tsx
// fields/color-field.tsx
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import type { ColorFieldConfig } from "../types";

interface Props {
    config: ColorFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function ColorField({ config, field, isDisabled }: Props) {
    return (
        <input
            type="color"
            {...field}
            value={field.value ?? "#000000"}
            disabled={isDisabled}
        />
    );
}
```

### 3. Add the case in `field-renderer.tsx`

```tsx
import { ColorField } from "./fields/color-field";

// inside the switch:
case "color": return <ColorField config={config} field={field} isDisabled={isDisabled} />;
```

That's it - `SchemaForm`, `FieldWrapper`, and `types.ts` union are the only required touches.

### Inline card layout (optional)

If your field uses the horizontal card layout (control on the right, label on the left - like `switch`/`checkbox`), add the component name to the `isInline` check in `schema-form.tsx`:

```tsx
// schema-form.tsx - FieldWrapper
const isInline = config.component === "switch"
    || config.component === "checkbox"
    || config.component === "color";   // ← add here
```

### Gallery example (optional)

Add a section under `examples/sections/` following the pattern of any existing section (e.g. `slider-section.tsx`) and import it in `examples/index.tsx`.

---

## Backend notes

- Server-side validation lives in `app/Http/Requests/` or inline `$request->validate([...])`.
- The Zod schema mirrors the backend rules - keep them in sync manually.
- For `select-api` fields, the route must return a JSON array:
  ```php
  public function index(Request $request) {
      return Category::query()
          ->when($request->q, fn($q, $s) => $q->where('name', 'ilike', "%{$s}%"))
          ->limit($request->limit ?? 10)
          ->get(['id', 'name']);
  }
  ```
