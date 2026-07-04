import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

const sizes = {
    sm: 'size-7 text-[10px]',
    md: 'size-9 text-xs',
    lg: 'size-13 text-base',
};

interface Props {
    name: string;
    avatar?: string | null;
    size?: keyof typeof sizes;
    className?: string;
}

export function MemberAvatar({ name, avatar, size = 'md', className }: Props) {
    const getInitials = useInitials();

    return (
        <Avatar className={cn(sizes[size], 'border border-border', className)}>
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback className="bg-secondary font-semibold">{getInitials(name)}</AvatarFallback>
        </Avatar>
    );
}
