import { router } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { PaginatedData, TableFilters } from '@/types/pagination';
import { Button } from '../ui/button';

interface DataTableProps<TData> {
    data: PaginatedData<TData>;
    columns: ColumnDef<TData>[];
    filters: TableFilters;
    searchPlaceholder?: string;
    filterOptions?: {
        key: string;
        label: string;
        options: { value: string; label: string }[];
    }[];
    createButton?: React.ReactNode;
}

export function DataTable<TData>({
    data,
    columns,
    filters,
    searchPlaceholder = 'Search...',
    filterOptions = [],
    createButton = null,
}: DataTableProps<TData>) {
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        pageCount: data.last_page,
    });

    const updateFilters = useCallback(
        (newFilters: Partial<TableFilters>) => {
            const merged = { ...filters, ...newFilters };

            Object.keys(merged).forEach((key) => {
                if (merged[key] === '' || merged[key] === undefined) {
                    delete merged[key];
                }
            });

            router.get(window.location.pathname, merged, {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setIsSearching(true),
                onFinish: () => setIsSearching(false),
            });
        },
        [filters]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                updateFilters({ search, page: undefined });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleSort = (column: string) => {
        const isCurrentSort = filters.sort === column;
        const newDirection = isCurrentSort && filters.direction === 'asc' ? 'desc' : 'asc';
        updateFilters({ sort: column, direction: newDirection });
    };

    const handlePageChange = (page: number) => {
        router.get(
            window.location.pathname,
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const getSortIcon = (column: string) => {
        if (filters.sort !== column) return <ChevronsUpDown className="size-4" />;
        return filters.direction === 'asc' ? (
            <ChevronUp className="size-4" />
        ) : (
            <ChevronDown className="size-4" />
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                {createButton}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {filterOptions.map((filter) => (
                    <Select
                        key={filter.key}
                        value={filters[filter.key]?.toString() || ''}
                        onValueChange={(value) =>
                            updateFilters({ [filter.key]: value === 'all' ? '' : value })
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common:all')}</SelectItem>
                            {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}

                {/* <Select
                    value={filters.per_page?.toString() || '50'}
                    onValueChange={(value) => updateFilters({ per_page: parseInt(value) })}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 15, 25, 50].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size} rows
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.columnDef.enableSorting !== false;
                                    const sortKey = header.column.columnDef.meta?.sortKey as string | undefined;

                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : canSort && sortKey ? (
                                                <button
                                                    className="flex items-center gap-1 hover:text-foreground"
                                                    onClick={() => handleSort(sortKey)}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {getSortIcon(sortKey)}
                                                </button>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isSearching ? 'Loading...' : 'No results.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination
                currentPage={data.current_page}
                lastPage={data.last_page}
                from={data.from}
                to={data.to}
                total={data.total}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

interface TablePaginationProps {
    currentPage: number;
    lastPage: number;
    from: number | null;
    to: number | null;
    total: number;
    onPageChange: (page: number) => void;
}

function TablePagination({
    currentPage,
    lastPage,
    from,
    to,
    total,
    onPageChange,
}: TablePaginationProps) {
    const pages = generatePaginationPages(currentPage, lastPage);

    return (
        <div className="flex items-center justify-between px-2">
            <p className="text-sm text-muted-foreground">
                {from && to ? `${from}-${to} of ${total}` : `${total} total`}
            </p>
            <div className="flex items-center gap-1">
                <PaginationButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </PaginationButton>

                {pages.map((page, i) =>
                    page === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <PaginationButton
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            active={currentPage === page}
                        >
                            {page}
                        </PaginationButton>
                    )
                )}

                <PaginationButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                >
                    Next
                </PaginationButton>
            </div>
        </div>
    );
}

function PaginationButton({
    children,
    onClick,
    disabled = false,
    active = false,
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
                'hover:bg-hover hover:text-accent-foreground',
                'disabled:pointer-events-none disabled:opacity-50',
                active && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
        >
            {children}
        </button>
    );
}

function generatePaginationPages(current: number, last: number): (number | string)[] {
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < last - 2) pages.push('...');

    pages.push(last);

    return pages;
}
