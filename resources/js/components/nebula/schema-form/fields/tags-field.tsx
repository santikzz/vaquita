import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TagsFieldConfig } from "../types";

interface Props {
    config: TagsFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function TagsField({ config, field, isDisabled }: Props) {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const tags: string[] = Array.isArray(field.value) ? field.value : [];
    const hasOptions = (config.options?.length ?? 0) > 0;

    const filteredOptions = hasOptions
        ? (config.options ?? []).filter(
              (o) => !tags.includes(o) && o.toLowerCase().includes(input.toLowerCase()),
          )
        : [];

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed || tags.includes(trimmed)) return;
        if (config.max !== undefined && tags.length >= config.max) return;
        if (config.strict && hasOptions && !config.options!.includes(trimmed)) return;
        field.onChange([...tags, trimmed]);
        setInput("");
    };

    const removeTag = (tag: string) => {
        field.onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (!config.strict) addTag(input);
        } else if (e.key === "Backspace" && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const containerClass = cn(
        "border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-input/30 px-3 py-1.5 text-sm shadow-xs focus-within:ring-[3px] cursor-text",
        isDisabled && "cursor-not-allowed opacity-50",
        config.inputClassName,
    );

    const tagList = tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
            {tag}
            {!isDisabled && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    className="rounded hover:text-destructive transition-colors"
                    aria-label={`Remove ${tag}`}
                >
                    <X size={10} />
                </button>
            )}
        </Badge>
    ));

    const textInput = (
        <input
            ref={inputRef}
            value={input}
            disabled={isDisabled}
            placeholder={tags.length === 0 ? (config.placeholder ?? "Add tags...") : ""}
            onChange={(e) => { setInput(e.target.value); if (hasOptions) setOpen(true); }}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (!hasOptions) addTag(input); field.onBlur(); }}
            className="min-w-[80px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
    );

    if (hasOptions) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        className={containerClass}
                        onClick={() => { if (!isDisabled) { inputRef.current?.focus(); setOpen(true); } }}
                    >
                        {tagList}
                        {textInput}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <Command>
                        <CommandList>
                            <CommandEmpty className="py-2 text-center text-xs text-muted-foreground">
                                No options found.
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={() => {
                                            addTag(option);
                                            inputRef.current?.focus();
                                        }}
                                    >
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <div
            className={containerClass}
            onClick={() => !isDisabled && inputRef.current?.focus()}
        >
            {tagList}
            {textInput}
        </div>
    );
}
