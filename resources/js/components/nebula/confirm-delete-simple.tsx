import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useState } from "react";

interface ConfirmDeleteSimpleDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onConfirm: () => void;
    className?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode; // Optional trigger content
}

export const ConfirmDeleteSimpleDialog = ({
    open,
    onOpenChange,
    onConfirm,
    className = '',
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone',
    children,
}: ConfirmDeleteSimpleDialogProps) => {

    const [isControlled] = useState(open !== undefined && onOpenChange !== undefined);

    const handleOpenChange = (newOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(newOpen);
        }
    };

    const dialogProps = isControlled
        ? { open, onOpenChange: handleOpenChange }
        : { onOpenChange: handleOpenChange };

    return (
        <Dialog {...dialogProps}>
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild className="flex-1">
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {isControlled ? (
                        <Button
                            className="flex-1"
                            onClick={onConfirm}
                        >
                            Confirm
                        </Button>
                    ) : (
                        <DialogClose asChild className="flex-1">
                            <Button
                                onClick={onConfirm}
                            >
                                Confirm
                            </Button>
                        </DialogClose>
                    )}
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
