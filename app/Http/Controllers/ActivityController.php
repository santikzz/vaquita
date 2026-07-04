<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Member;
use App\Models\Settlement;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Recent activity across all the user's groups: expenses added and
 * payments recorded, newest first.
 */
class ActivityController extends Controller
{
    private const LIMIT = 30;

    public function index(Request $request)
    {
        $groupIds = Member::where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->pluck('group_id');

        $expenses = Expense::whereHas('event', fn ($q) => $q->whereIn('group_id', $groupIds))
            ->with(['payer.user', 'event.group'])
            ->latest()
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (Expense $expense) => [
                'type' => 'expense',
                'actor' => $expense->payer->display_name,
                'description' => $expense->description,
                'amount_minor' => $expense->amount_minor,
                'currency' => $expense->event->group->currency,
                'group_name' => $expense->event->group->name,
                'event_name' => $expense->event->name,
                'created_at' => $expense->created_at,
            ]);

        $settlements = Settlement::whereHas('event', fn ($q) => $q->whereIn('group_id', $groupIds))
            ->with(['fromMember.user', 'toMember.user', 'event.group'])
            ->latest()
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (Settlement $settlement) => [
                'type' => 'settlement',
                'actor' => $settlement->fromMember->display_name,
                'target' => $settlement->toMember->display_name,
                'amount_minor' => $settlement->amount_minor,
                'currency' => $settlement->event->group->currency,
                'group_name' => $settlement->event->group->name,
                'event_name' => $settlement->event->name,
                'created_at' => $settlement->created_at,
            ]);

        $items = $expenses->concat($settlements)
            ->sortByDesc('created_at')
            ->take(self::LIMIT)
            ->values()
            ->map(function (array $item) {
                $item['created_at'] = $item['created_at']->toIso8601String();

                return $item;
            });

        return Inertia::render('activity', ['items' => $items]);
    }
}
