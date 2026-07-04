import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface ConfirmDeleteDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onConfirm: () => void;
    className?: string;
    title?: string;
    description?: string;
    /** Require the user to type a word before confirming. @default true */
    requireConfirmation?: boolean;
    /** Word the user must type to enable the confirm button. Defaults to a localized "DELETE". */
    confirmationText?: string;
    /** Label shown above the confirmation input. Supports `{{text}}` interpolation. */
    promptLabel?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** @default "destructive" */
    confirmVariant?: ButtonVariant;
    children?: React.ReactNode; // Optional trigger content
}

export const ConfirmDeleteDialog = ({
    open,
    onOpenChange,
    onConfirm,
    className = '',
    title = t('common:confirm_title'),
    description = t('common:confirm_description'),
    requireConfirmation = true,
    confirmationText = t('common:delete_confirm_word'),
    promptLabel = t('common:confirm_delete_prompt', { text: confirmationText }),
    confirmLabel = t('common:confirm'),
    cancelLabel = t('common:cancel'),
    confirmVariant = 'destructive',
    children,
}: ConfirmDeleteDialogProps) => {

    const [inputValue, setInputValue] = useState('');
    const [isControlled] = useState(open !== undefined && onOpenChange !== undefined);

    const isConfirmDisabled = requireConfirmation && inputValue !== confirmationText;

    const handleConfirm = () => {
        if (!isConfirmDisabled) {
            onConfirm();
            setInputValue(''); // Reset input after confirmation

            // Close dialog in both controlled and uncontrolled modes
            if (onOpenChange) {
                onOpenChange(false); // Close dialog if controlled
            } else {
                // For uncontrolled mode, we need to manually trigger the close
                // This will be handled by making the confirm button a DialogClose
            }
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setInputValue(''); // Reset input when dialog closes
        }
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

                {requireConfirmation && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-normal">{promptLabel}</label>
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={confirmationText}
                            className="font-mono"
                            autoComplete="off"
                        />
                    </div>
                )}

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild className="flex-1">
                        <Button variant="outline">{cancelLabel}</Button>
                    </DialogClose>
                    {isControlled ? (
                        <Button
                            className="flex-1"
                            variant={confirmVariant}
                            onClick={handleConfirm}
                            disabled={isConfirmDisabled}
                        >
                            {confirmLabel}
                        </Button>
                    ) : (
                        <DialogClose asChild className="flex-1">
                            <Button
                                variant={confirmVariant}
                                onClick={handleConfirm}
                                disabled={isConfirmDisabled}
                            >
                                {confirmLabel}
                            </Button>
                        </DialogClose>
                    )}
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )

}
