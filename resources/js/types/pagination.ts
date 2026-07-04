export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
}

export interface TableFilters {
    search?: string;
    status?: string;
    role?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
    [key: string]: string | number | undefined;
}
