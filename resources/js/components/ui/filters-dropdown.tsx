import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronDown, XIcon } from "lucide-react"

type Props = {
  options: string[];
};

type ActionState = {
    [key: string]: "accepted" | "rejected" | null;
};

export function FiltersDropdown({ options }: Props) {
    const [actions, setActions] = useState<ActionState>({});
    
    const handleAccept = (key: string) => {
        setActions((prev) => ({
        ...prev,
        [key]: prev[key] === "accepted" ? null : "accepted",
        }));
    };

    const handleReject = (key: string) => {
        setActions((prev) => ({
        ...prev,
        [key]: prev[key] === "rejected" ? null : "rejected",
        }));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="w-full flex justify-between">
                    All
                    <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[342px] max-h-[356px] overflow-auto" align="start">
                {options.map((option) => (
                <DropdownMenuItem
                    key={option}
                    className="justify-between gap-2 hover:bg-transparent focus:bg-transparent"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Button
                        className="flex-1 justify-start mr-[22px] bg-muted hover:bg-muted focus:bg-muted text-white"
                    >
                        {option}
                    </Button>
                    <div className="flex gap-1">
                    <Button
                        size="icon"
                        className={`h-[30px] w-[30px] text-white ${
                            actions[option] === "accepted" ? "bg-green-500" : "bg-muted hover:bg-muted focus:bg-muted"
                        }`}
                        onClick={() => handleAccept(option)}
                    >
                        <CheckIcon className="h-4 w-4 text-white" />
                    </Button>
                    <div className="h-[13px] w-px bg-muted self-center mx-[5px]"/>
                    <Button
                        size="icon"
                        className={`h-[30px] w-[30px] text-white ${
                            actions[option] === "rejected" ? "bg-red-500" : "bg-muted hover:bg-muted focus:bg-muted"
                        }`}
                        onClick={() => handleReject(option)}
                    >
                        <XIcon className="h-4 w-4 text-white" />
                    </Button>
                    </div>
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}