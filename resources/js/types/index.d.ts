import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    showForRoles?: string[]; // e.g., ['admin', 'user']
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    unreadNotifications: number;
    flash: {
        success?: string;
        error?: string;
        result?: string;
    };
    [key: string]: unknown;
}

export interface AppNotification {
    id: string;
    data: {
        component: string;
        [key: string]: unknown;
    };
    read_at: string | null;
    created_at: string;
    created_at_ago: string;
}

export interface User {
    id: number;
    uuid: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    permissions?: string[];
    roles?: string[];
    [key: string]: unknown;
}