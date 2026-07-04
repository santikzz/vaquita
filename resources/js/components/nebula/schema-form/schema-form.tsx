import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FieldRenderer } from "./field-renderer";
import type { FieldConfig, SchemaFormProps } from "./types";
import { Loader2 } from "lucide-react";

/**
 * Schema-driven form built on React Hook Form + Zod + shadcn/ui.
 *
 * Define fields once as a typed config array and get a fully validated,
 * accessible form - labels, errors, responsive grid layout, and submit
 * handling included.
 *
 * @see {@link SchemaFormProps} for all available props.
 * @see {@link FieldConfig} for all field type configs.
 */
export function SchemaForm<T extends ZodType = ZodType>({
    fields,
    schema,
    defaultValues,
    onSubmit,
    serverErrors,
    loading = false,
    submitLabel = "Submit",
    submitIcon: SubmitIcon,
    submitVariant = "default",
    layout = "grid",
    columns = 2,
    disabled = false,
    onlySubmitIfDirty = false,
    onlySubmitIfValid = false,
    focusFirstError = true,
    showRequiredIndicator = true,
    onCancel,
    cancelLabel = "Cancel",
    before,
    after,
    formClassName,
    actionsClassName,
}: SchemaFormProps<T>) {

    const form = useForm({
        resolver: zodResolver(schema as never),
        defaultValues: defaultValues as Record<string, unknown>,
        mode: "onTouched",
    });

    const hasConditionalFields = useMemo(
        () => fields.some((f) => typeof f.hidden === "function"),
        [fields],
    );
    const formValues = hasConditionalFields ? form.watch() : ({} as Record<string, unknown>);
    const prevServerErrorKeys = useRef<string[]>([]);

    /*
        Sync server errors -> RHF (e.g. from Inertia)
        Errors object format example must match the form shape and field names:
        {
            title: "Title is already taken",
            tags: "At least one tag is required",
            "author.name": "Author name is too short"
        }
    */
    useEffect(() => {
        if (!serverErrors || Object.keys(serverErrors).length === 0) return;

        // Clear errors from the previous server response
        if (prevServerErrorKeys.current.length > 0) {
            form.clearErrors(prevServerErrorKeys.current as Parameters<typeof form.clearErrors>[0]);
        }

        const keys = Object.keys(serverErrors);
        keys.forEach((key) => {
            form.setError(key as Parameters<typeof form.setError>[0], {
                type: "server",
                message: serverErrors[key],
            });
        });
        prevServerErrorKeys.current = keys;
    }, [serverErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    const isSubmitDisabled = useMemo(() => {
        if (disabled || loading) return true;
        if (onlySubmitIfDirty && !form.formState.isDirty) return true;
        if (onlySubmitIfValid && !form.formState.isValid) return true;
        return false;
    }, [disabled, loading, onlySubmitIfDirty, onlySubmitIfValid, form.formState.isDirty, form.formState.isValid]);

    const handleSubmit = form.handleSubmit(
        async (data) => {
            await onSubmit(data as never);
        },
        focusFirstError
            ? (errors) => {
                const firstKey = Object.keys(errors)[0];
                if (!firstKey) return;
                // Try name attribute first (works for most inputs), fall back to id
                const el =
                    document.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
                    document.getElementById(firstKey);
                if (el) {
                    el.focus({ preventScroll: false });
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
            : undefined,
    );

    const gridClass =
        layout === "grid"
            ? cn(
                "grid items-start gap-x-6 gap-y-5",
                columns === 1 && "grid-cols-1",
                columns === 2 && "grid-cols-1 md:grid-cols-2",
                columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            )
            : "flex flex-col gap-5";

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className={cn("space-y-6", formClassName)} noValidate>
                {before}

                <div className={gridClass}>
                    {fields.map((config) => (
                        <FieldWrapper
                            key={config.name}
                            config={config}
                            form={form}
                            formValues={formValues}
                            layout={layout}
                            globalDisabled={disabled}
                            showRequiredIndicator={showRequiredIndicator}
                        />
                    ))}
                </div>

                {after}

                <div className={cn("flex items-center justify-end gap-3 pt-1", actionsClassName)}>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading || disabled}
                        >
                            {cancelLabel}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className='cursor-pointer'
                        disabled={loading || isSubmitDisabled}
                        variant={submitVariant}
                    >
                        {submitLabel}
                        {loading ? <Loader2 className="animate-spin" />
                            : SubmitIcon && <SubmitIcon className="size-5" />}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

// ─── FieldWrapper ─────────────────────────────────────────────────────────────

interface FieldWrapperProps {
    config: FieldConfig;
    form: ReturnType<typeof useForm>;
    formValues: Record<string, unknown>;
    layout: "stack" | "grid";
    globalDisabled: boolean;
    showRequiredIndicator: boolean;
}

function FieldWrapper({ config, form, formValues, layout, globalDisabled, showRequiredIndicator }: FieldWrapperProps) {
    // Evaluate conditional visibility
    const isHidden =
        typeof config.hidden === "function" ? config.hidden(formValues) : config.hidden;
    if (isHidden) return null;

    // Column span classes (only in grid layout)
    const colSpanClass =
        layout === "grid"
            ? cn(
                config.colSpan === 2 && "md:col-span-2",
                config.colSpan === 3 && "col-span-full",
            )
            : "";

    // Switch and checkbox use a horizontal card layout (control on the left, label on the right)
    const isInline = config.component === "switch" || config.component === "checkbox";

    const RequiredMark = showRequiredIndicator && config.required
        ? <span className="text-destructive ml-0.5">*</span>
        : null;

    if (isInline) {
        return (
            <FormField
                control={form.control as never}
                name={config.name}
                render={({ field }) => (
                    <FormItem
                        className={cn(
                            "flex flex-row items-center justify-between rounded-lg border border-border/50 bg-muted/10 px-4 py-3 shadow-xs",
                            colSpanClass,
                            config.className,
                        )}
                    >
                        <div className="space-y-0.5">
                            {config.label && (
                                <FormLabel className="cursor-pointer text-sm font-medium leading-none">
                                    {config.label}
                                    {RequiredMark}
                                </FormLabel>
                            )}
                            {config.description && (
                                <FormDescription className="text-xs">{config.description}</FormDescription>
                            )}
                            <FormMessage />
                        </div>
                        <FormControl>
                            <FieldRenderer
                                config={config}
                                field={field as never}
                                form={form as never}
                                formValues={formValues}
                                disabled={globalDisabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        );
    }

    return (
        <FormField
            control={form.control as never}
            name={config.name}
            render={({ field }) => (
                <FormItem className={cn(colSpanClass, config.className)}>
                    {config.label && (
                        <FormLabel>
                            {config.label}
                            {RequiredMark}
                        </FormLabel>
                    )}
                    <FormControl>
                        <FieldRenderer
                            config={config}
                            field={field as never}
                            form={form as never}
                            formValues={formValues}
                            disabled={globalDisabled}
                        />
                    </FormControl>
                    {config.description && <FormDescription>{config.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
