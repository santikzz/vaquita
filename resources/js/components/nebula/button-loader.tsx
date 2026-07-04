import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

interface ButtonLoaderProps {
    loading?: boolean;
    icon?: React.ElementType;
}

export const ButtonLoader = ({
    loading = false,
    children,
    className,
    disabled,
    icon: Icon,
    ...props
}: ButtonLoaderProps &
    React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) => {
    return (
        <Button
            className={cn('cursor-pointer', className)}
            disabled={disabled || loading}
            {...props}
        >
            {children}
            {loading ? <Loader2 className="animate-spin" /> : Icon && <Icon className="size-5" />}
        </Button>
    )
}