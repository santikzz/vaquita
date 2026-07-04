import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

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
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface SearchableSelectOption {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    label?: string;
    placeholder?: string;
    emptyText?: string;
    searchPlaceholder?: string;
    options: SearchableSelectOption[];
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
    description?: string;
    required?: boolean;
}

export function SearchableSelect({
    label,
    placeholder = "Select an option",
    emptyText = "No option found.",
    searchPlaceholder = "Search...",
    options,
    value,
    onValueChange,
    disabled = false,
    error,
    description,
    required = false,
}: SearchableSelectProps) {
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]",
                            error && "border-destructive"
                        )}
                        id={id}
                        role="combobox"
                        variant="outline"
                        disabled={disabled}
                    >
                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                            {value
                                ? options.find((option) => option.value === value)?.label
                                : placeholder}
                        </span>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="shrink-0 text-muted-foreground/80"
                            size={16}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            onValueChange(option.value === value ? "" : option.value);
                                            setOpen(false);
                                        }}
                                        value={option.value}
                                    >
                                        {option.label}
                                        {value === option.value && (
                                            <CheckIcon className="ml-auto" size={16} />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
