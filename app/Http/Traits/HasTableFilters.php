<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HasTableFilters
{
    /**
     * Apply search filter to query
     */
    protected function applySearch(Builder $query, Request $request, array $searchableColumns): Builder
    {
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        return $query;
    }

    /**
     * Apply status filter to query
     */
    protected function applyStatusFilter(Builder $query, Request $request, string $column = 'status'): Builder
    {
        if ($status = $request->input('status')) {
            $query->where($column, $status);
        }

        return $query;
    }

    /**
     * Apply generic single column filter to query
     */
    protected function applyFilter(Builder $query, Request $request, string $inputKey, string $column): Builder
    {
        if ($value = $request->input($inputKey)) {
            $query->where($column, $value);
        }

        return $query;
    }

    /**
     * Apply sorting to query
     */
    protected function applySorting(Builder $query, Request $request, array $allowedSorts, string $defaultSort = 'created_at', string $defaultDirection = 'desc'): Builder
    {
        $sortField = $request->input('sort', $defaultSort);
        $sortDirection = $request->input('direction', $defaultDirection);

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        return $query;
    }

    /**
     * Apply relation filter (e.g., role filter for users)
     */
    protected function applyRelationFilter(Builder $query, Request $request, string $inputKey, string $relation): Builder
    {
        if ($value = $request->input($inputKey)) {
            $query->{$relation}($value);
        }

        return $query;
    }

    /**
     * Get pagination parameters
     */
    protected function getPaginationParams(Request $request, int $defaultPerPage = 50): array
    {
        return [
            'per_page' => $request->input('per_page', $defaultPerPage),
        ];
    }

    /**
     * Get filter values for response
     */
    protected function getFilterValues(Request $request, array $filterKeys): array
    {
        return $request->only($filterKeys);
    }
}
