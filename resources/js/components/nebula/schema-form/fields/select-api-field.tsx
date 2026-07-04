import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CheckIcon, ChevronDownIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import type { SelectApiFieldConfig } from "../types";

interface ApiItem {
    [key: string]: unknown;
}

interface Props {
    config: SelectApiFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

/**
 * Searchable select that fetches options from a JSON endpoint.
 *
 * Improvements over the original SelectWithApiSearch:
 * - AbortController cancels in-flight requests when a new search fires
 * - Error state with user-friendly message
 * - Clear button on the trigger (no need to open the dropdown to deselect)
 * - Direct setTimeout/clearTimeout debounce (no custom hook needed)
 * - Cleanup on unmount
 */
export function SelectApiField({ config, field, isDisabled }: Props) {
    const vKey = config.valueKey ?? "id";
    const lKey = config.labelKey ?? "name";

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<ApiItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const fetchItems = useCallback(
        async (q: string) => {
            // Cancel the previous in-flight request
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            setLoading(true);
            setHasError(false);
            try {
                const params: Record<string, unknown> = { limit: 10 };
                if (q) params.q = q;
                const res = await axios.get(config.route, {
                    params,
                    signal: abortRef.current.signal,
                });
                setItems(res.data);
            } catch (err) {
                if (!axios.isCancel(err)) setHasError(true);
            } finally {
                setLoading(false);
            }
        },
        [config.route],
    );

    // Initial load
    useEffect(() => {
        fetchItems("");
        return () => abortRef.current?.abort();
    }, [fetchItems]);

    // Debounced search on query change
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchItems(query), 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, fetchItems]);

    // Sync selectedItem when value changes or items load
    useEffect(() => {
        if (field.value == null) { setSelectedItem(null); return; }
        const found = items.find((item) => item[vKey] === field.value);
        if (found) setSelectedItem(found);
    }, [field.value, items, vKey]);

    const handleSelect = (item: ApiItem) => {
        setSelectedItem(item);
        field.onChange(item[vKey]);
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedItem(null);
        field.onChange(null);
    };

    return (
        <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) field.onBlur(); }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={isDisabled}
                    className={cn("border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between rounded-md border bg-input/30 px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-normal", config.inputClassName)}
                >
                    <span className={cn("truncate text-left flex-1", !selectedItem && "text-muted-foreground")}>
                        {selectedItem ? String(selectedItem[lKey]) : (config.placeholder ?? "Select an option")}
                    </span>
                    <span className="flex items-center gap-1 ml-2 shrink-0">
                        {selectedItem && !isDisabled && (
                            <span
                                role="button"
                                tabIndex={-1}
                                onClick={handleClear}
                                aria-label="Clear selection"
                                className="rounded p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                            >
                                <X size={13} />
                            </span>
                        )}
                        <ChevronDownIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 min-w-[var(--radix-popper-anchor-width)] border-input">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search...`}
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="animate-spin size-4 text-muted-foreground" />
                            </div>
                        ) : hasError ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Failed to load options.
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {items.map((item) => {
                                        const isSelected = selectedItem && selectedItem[vKey] === item[vKey];
                                        return (
                                            <CommandItem
                                                key={String(item[vKey])}
                                                value={String(item[vKey])}
                                                onSelect={() => handleSelect(item)}
                                            >
                                                {String(item[lKey])}
                                                {isSelected && <CheckIcon size={16} className="ml-auto shrink-0" />}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
