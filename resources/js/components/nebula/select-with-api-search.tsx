import { useState, useEffect } from "react"
import { CheckIcon, ChevronDownIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import axios from "axios"
import useDebounce from "@/hooks/nebula/use-debounce"

interface ApiItem {
    [key: string]: any;
}

interface SelectWithApiSearchProps {
    route: string;
    placeholder?: string;
    label?: string;
    onChange: (item: ApiItem | null) => void;
    labelKey?: string;
    valueKey?: string;
    value?: any;
    className?: string;
}

export const SelectWithApiSearch = ({
    route,
    placeholder = "Select an option",
    label,
    onChange,
    labelKey = "name",
    valueKey = "id",
    value,
    className = '',
}: SelectWithApiSearchProps) => {

    const [open, setOpen] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [items, setItems] = useState<ApiItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null)

    const fetchItems = async (query: string = "") => {
        setLoading(true)
        try {
            const params = query ? { q: query, limit: 10 } : { limit: 10 }
            const response = await axios.get(route, { params })
            setItems(response.data)
        } catch (error) {
            console.error("Error fetching items:", error)
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedFetch = () => {
        fetchItems(searchQuery)
    }

    const [isReady, cancel] = useDebounce(debouncedFetch, 300, [searchQuery])

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        if (value && items.length > 0) {
            const item = items.find(item => item[valueKey] === value)
            setSelectedItem(item || null)
        } else if (!value) {
            setSelectedItem(null)
        }
    }, [value, items, valueKey])

    const handleSelect = (item: ApiItem) => {
        setSelectedItem(item)
        onChange(item)
        setOpen(false)
    }

    const handleClear = () => {
        setSelectedItem(null)
        onChange(null)
        setOpen(false)
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && <Label>{label}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between rounded-md border bg-input/30 px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1 cursor-pointer"
                    >
                        <span className={cn("truncate", !selectedItem && "text-muted-foreground")}>
                            {selectedItem ? selectedItem[labelKey] : placeholder}
                        </span>
                        <ChevronDownIcon
                            size={16}
                            className="text-muted-foreground/80 shrink-0"
                            aria-hidden="true"
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="border w-full p-0 min-w-[var(--radix-popper-anchor-width)]"
                    // align="start"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={`Search ${placeholder.toLowerCase()}...`}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {loading ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="animate-spin" size={16} />
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty>No items found.</CommandEmpty>
                                    <CommandGroup>
                                        {selectedItem && (
                                            <CommandItem
                                                value="clear"
                                                onSelect={handleClear}
                                                className="text-muted-foreground"
                                            >
                                                Clear selection
                                            </CommandItem>
                                        )}
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item[valueKey]}
                                                value={item[valueKey]?.toString()}
                                                onSelect={() => handleSelect(item)}
                                            >
                                                {item[labelKey]}
                                                {selectedItem && selectedItem[valueKey] === item[valueKey] && (
                                                    <CheckIcon size={16} className="ml-auto" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
