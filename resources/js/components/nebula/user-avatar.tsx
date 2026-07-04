import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials";
import { cn } from "@/lib/utils";
import { Auth, User } from "@/types";
import { usePage } from "@inertiajs/react"
import { useMemo } from "react";

interface UserAvatarProps {
    user?: Partial<User>;
    className?: string;
}

export const UserAvatar = ({
    user: userProp,
    className = ''
}: UserAvatarProps) => {

    const { user: authUser } = usePage().props.auth as Auth;
    const user = userProp ?? authUser;

    const getInitials = useInitials();
    const initials = useMemo(() => getInitials(user?.name || ''), [user?.name]);

    if (!user) return null;

    return (
        <Avatar className={cn('', className)}>
            <AvatarImage src={user.avatar} className="object-cover" />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    )
}