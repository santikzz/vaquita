import type { ElementType, ReactNode } from "react";
import type { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import type { z, ZodType } from "zod";

// ─── Base config shared by all field variants ────────────────────────────────

interface BaseFieldConfig {
    /** Must match the key in your Zod schema */
    name: string;
    label?: string;
    /** Helper text rendered below the input */
    description?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    /** Extra CSS classes on the wrapping FormItem */
    className?: string;
    /**
     * Extra CSS classes applied directly to the input/control element.
     * Use for styling like `min-h-[200px]` on a textarea or custom widths.
     * @example inputClassName: "min-h-[200px]"
     */
    inputClassName?: string;
    /**
     * Number of grid columns this field occupies.
     * Only relevant when SchemaForm uses layout="grid".
     * @default 1
     */
    colSpan?: 1 | 2 | 3;
    /** Leading icon rendered inside the input (not all field types support this) */
    icon?: ElementType;
    /**
     * Hide this field entirely.
     * Pass a function to hide it conditionally based on current form values.
     * @example hidden: (values) => values.type !== 'physical'
     */
    hidden?: boolean | ((values: FieldValues) => boolean);
}

// ─── Field variants ───────────────────────────────────────────────────────────

export type InputFieldConfig = BaseFieldConfig & {
    component: "input";
    /** @default "text" */
    type?: "text" | "email" | "number" | "url" | "tel";
    min?: number;
    max?: number;
    step?: number;
    /** Leading text adornment when no icon is set (e.g. "$", "https://") */
    prefix?: string;
    /** Trailing text adornment (e.g. "USD", "%", "kg") */
    suffix?: string;
};

export type PasswordFieldConfig = BaseFieldConfig & {
    component: "password";
    /**
     * Renders strength bar + requirements checklist below the input.
     * @default false
     */
    showStrength?: boolean;
    /**
     * Custom strength rules. Each rule needs a regex and a display label.
     * Defaults to: min 8 chars, number, lowercase, uppercase, special char.
     */
    strengthRules?: { regex: RegExp; label: string }[];
};

export type TextareaFieldConfig = BaseFieldConfig & {
    component: "textarea";
    rows?: number;
};

export type SelectFieldConfig = BaseFieldConfig & {
    component: "select";
    options: { label: string; value: string }[];
    /**
     * Use a searchable combobox instead of a plain native select.
     * @default false
     */
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyText?: string;
};

export type SelectApiFieldConfig = BaseFieldConfig & {
    component: "select-api";
    /** Full URL or Ziggy route helper result - fetched with axios */
    route: string;
    /** Key in each item to use as the display label. @default "name" */
    labelKey?: string;
    /** Key in each item to use as the stored value. @default "id" */
    valueKey?: string;
};

export type SwitchFieldConfig = BaseFieldConfig & {
    component: "switch";
};

export type CheckboxFieldConfig = BaseFieldConfig & {
    component: "checkbox";
};

export type RadioFieldConfig = BaseFieldConfig & {
    component: "radio";
    options: {
        label: string;
        value: string;
        description?: string;
        /** Small text shown below the label in cards variant */
        sublabel?: string;
        /** Badge text shown inline with the label (e.g. "Popular") */
        badge?: string;
        /** Right-aligned metadata (e.g. "$29/mo") - shown in cards variant */
        meta?: string;
        /** Leading icon/svg - when any option has icon, cards variant uses icon layout */
        icon?: ReactNode;
    }[];
    /** @default "vertical" */
    orientation?: "horizontal" | "vertical";
    /**
     * "default" - simple list with radio + label
     * "cards"   - bordered card list; uses icon layout when options include icons
     * @default "default"
     */
    variant?: "default" | "cards";
};

export type FileFieldConfig = BaseFieldConfig & {
    component: "file";
    /** Passed to the <input accept> attribute, e.g. "image/*" or ".stl,.zip" */
    accept?: string;
    multiple?: boolean;
    /**
     * Show an image thumbnail preview when a file is selected.
     * When the existing field value is a URL string, it is shown as the current preview.
     * @default true
     */
    preview?: boolean;
    /** Max allowed file size in MB - shown in the upload zone label */
    maxSizeMb?: number;
};

export type PhoneFieldConfig = BaseFieldConfig & {
    component: "phone";
};

export type OtpFieldConfig = BaseFieldConfig & {
    component: "otp";
    /** Total number of digits. Rendered as two equal groups separated by a dash. @default 6 */
    length?: number;
};

export type SliderFieldConfig = BaseFieldConfig & {
    component: "slider";
    min?: number;
    max?: number;
    step?: number;
    /** Display the current value to the right of the track. @default false */
    showValue?: boolean;
};

export type CurrencyFieldConfig = BaseFieldConfig & {
    component: "currency";
    /**
     * Symbol shown on the left (e.g. "€", "$", "£").
     * Omit to show a plain numeric input with only the code suffix.
     */
    currencySymbol?: string;
    /**
     * ISO code shown on the right (e.g. "EUR", "USD").
     * Omit to show only the leading symbol.
     */
    currencyCode?: string;
};

export type DateFieldConfig = BaseFieldConfig & {
    component: "date";
    /**
     * Override the date-fns Locale used for this field.
     * Defaults to the active i18n language, falling back to enUS.
     */
    locale?: import("date-fns").Locale;
    /**
     * date-fns format string used to display the selected date in the trigger button.
     * @default "PPP"  (e.g. "April 3, 2026")
     * @see https://date-fns.org/docs/format
     */
    displayFormat?: string;
    /**
     * How the value is stored in the form state.
     * - "iso"      -> "2026-04-03"  (default, works directly as a Laravel date column)
     * - "datetime" -> full ISO-8601 string
     * - "date"     -> raw JS Date object
     * @default "iso"
     */
    valueFormat?: "iso" | "datetime" | "date";
    /** react-day-picker `disabled` prop - pass a Matcher or array of Matchers */
    disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
    /**
     * Earliest year shown in the year dropdown.
     * @default 1900
     */
    startYear?: number;
    /**
     * Latest year shown in the year dropdown.
     * @default current year + 10
     */
    endYear?: number;
};

export type TagsFieldConfig = BaseFieldConfig & {
    component: "tags";
    /**
     * Autocomplete suggestions - enables a searchable dropdown when provided.
     * Without options, the user types freely and presses Enter or comma to add tags.
     */
    options?: string[];
    /**
     * Only allow values that exist in `options`. Requires `options` to be set.
     * @default false
     */
    strict?: boolean;
    /** Maximum number of tags the user can add */
    max?: number;
};

export type CustomFieldConfig = BaseFieldConfig & {
    component: "custom";
    /**
     * Full control - return any JSX.
     * The `field` object is the RHF ControllerRenderProps (value, onChange, onBlur, ref).
     * Use `formValues` to read sibling field values for dependent logic.
     *
     * @example
     * render: (field, values, form) => (
     *   <TagInput value={field.value} onChange={field.onChange} />
     * )
     */
    render: (
        field: ControllerRenderProps<FieldValues, string>,
        formValues: FieldValues,
        form: UseFormReturn<FieldValues>,
    ) => ReactNode;
};

// ─── Union ────────────────────────────────────────────────────────────────────

export type FieldConfig =
    | InputFieldConfig
    | PasswordFieldConfig
    | TextareaFieldConfig
    | CurrencyFieldConfig
    | DateFieldConfig
    | TagsFieldConfig
    | SelectFieldConfig
    | SelectApiFieldConfig
    | SwitchFieldConfig
    | CheckboxFieldConfig
    | RadioFieldConfig
    | FileFieldConfig
    | PhoneFieldConfig
    | OtpFieldConfig
    | SliderFieldConfig
    | CustomFieldConfig;

// ─── SchemaForm props ─────────────────────────────────────────────────────────

export interface SchemaFormProps<T extends ZodType = ZodType> {
    /** Ordered list of field descriptors */
    fields: FieldConfig[];
    /**
     * Zod schema used for client-side validation.
     * All field `name` values should correspond to keys in this schema.
     */
    schema: T;
    /** Pre-populate form fields (create mode) or load existing data (edit mode) */
    defaultValues?: Partial<z.infer<T>>;
    /**
     * Called with fully validated, typed data when the form is successfully submitted.
     * The data type is inferred from the Zod schema.
     */
    onSubmit: (data: z.infer<T>) => void | Promise<void>;
    /**
     * Server-side validation errors.
     * Pass `usePage().props.errors` from Inertia - keys are auto-mapped to fields.
     */
    serverErrors?: Record<string, string>;
    /** Shows a loading spinner on the submit button and disables all inputs */
    loading?: boolean;
    /** @default "Submit" */
    submitLabel?: string;
    /** Lucide icon (or any React component) rendered next to the submit label */
    submitIcon?: ElementType;
    submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    /** @default "grid" */
    layout?: "stack" | "grid";
    /**
     * Number of columns in grid layout. Fields can span multiple columns via `colSpan`.
     * Responsive: always 1 column on mobile.
     * @default 2
     */
    columns?: 1 | 2 | 3;
    /** Disables every input and the submit button */
    disabled?: boolean;
    /**
     * Keep the submit button disabled until at least one field value has changed.
     * Ideal for edit/update forms to avoid redundant submissions.
     * @default false
     */
    onlySubmitIfDirty?: boolean;
    /**
     * Keep the submit button disabled while the form has validation errors.
     * @default false
     */
    onlySubmitIfValid?: boolean;
    /**
     * After a failed submit attempt, scroll to and focus the first field with an error.
     * @default true
     */
    focusFirstError?: boolean;
    /**
     * Show a red asterisk (*) after labels for fields marked `required: true`.
     * @default true
     */
    showRequiredIndicator?: boolean;
    /** Show a Cancel button that calls this handler */
    onCancel?: () => void;
    /** @default "Cancel" */
    cancelLabel?: string;
    /** Rendered above the field grid */
    before?: ReactNode;
    /** Rendered below the field grid, above the action buttons */
    after?: ReactNode;
    /** Extra CSS classes on the <form> element */
    formClassName?: string;
    /** Extra CSS classes on the actions row (submit / cancel buttons) */
    actionsClassName?: string;
}
