import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Auth, User } from '@/types';
import i18n from '@/i18n';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Check if a user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
    return user !== undefined && user !== null;
}

/**
 * Check if the authenticated user has a specific role
 */
export function hasRole(user: User, role: string): boolean {
    return user?.roles?.includes(role) ?? false;
}

export function getRoles(user: User): string[] {
    return user?.roles ?? [];
}

export function isAdmin(user: User): boolean {
    return isAuthenticated(user) && hasRole(user, 'admin');
}

/**
 * Format bytes as human-readable text.
 * eg: 1024 => 1 KB
 *     1234 => 1.21 KB
 *     123456789 => 117.73 MB
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Ensure decimals is a non-negative number
    const dm = decimals < 0 ? 0 : decimals;

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Decode HTML entities in a string
 * This is useful for displaying text that may contain HTML entities, 
 * such as &amp; for & or &lt; for <. 
 * eg: "Hello &amp; welcome!" => "Hello & welcome!"
 */
export const decodeHtmlEntities = (text: string): string => {
    if (!text) return '';

    try {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    } catch {
        // fallback for basic HTML entities
        return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');
    }
};

/**
 * 
 * Normalize text by decoding HTML entities and trimming whitespace
 * eg: "  Hello &amp; welcome!  " => "Hello & welcome!"
 */
export const normalizeText = (text: string): string => {
    if (!text) return '';
    return decodeHtmlEntities(text).trim();
};

/**
 * Format number in compact notation
 * eg: 1200 => 1.2K
 *    1500000 => 1.5M
 */
export function formatNumberCompact(
    num: number,
    locale: string | null = null,
    minimumFractionDigits: number = 0,
    maximumFractionDigits: number = 1
): string {
    return new Intl.NumberFormat(locale ?? i18n.language, {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits,
        maximumFractionDigits
    }).format(num);
}