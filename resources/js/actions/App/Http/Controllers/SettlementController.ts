import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SettlementController::store
 * @see app/Http/Controllers/SettlementController.php:16
 * @route '/groups/{group}/events/{event}/settlements'
 */
export const store = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups/{group}/events/{event}/settlements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SettlementController::store
 * @see app/Http/Controllers/SettlementController.php:16
 * @route '/groups/{group}/events/{event}/settlements'
 */
store.url = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    event: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: typeof args.group === 'object'
                ? args.group.uuid
                : args.group,
                                event: typeof args.event === 'object'
                ? args.event.uuid
                : args.event,
                }

    return store.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SettlementController::store
 * @see app/Http/Controllers/SettlementController.php:16
 * @route '/groups/{group}/events/{event}/settlements'
 */
store.post = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SettlementController::destroy
 * @see app/Http/Controllers/SettlementController.php:52
 * @route '/groups/{group}/events/{event}/settlements/{settlement}'
 */
export const destroy = (args: { group: string | { uuid: string }, event: string | { uuid: string }, settlement: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, settlement: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/groups/{group}/events/{event}/settlements/{settlement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SettlementController::destroy
 * @see app/Http/Controllers/SettlementController.php:52
 * @route '/groups/{group}/events/{event}/settlements/{settlement}'
 */
destroy.url = (args: { group: string | { uuid: string }, event: string | { uuid: string }, settlement: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, settlement: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    event: args[1],
                    settlement: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: typeof args.group === 'object'
                ? args.group.uuid
                : args.group,
                                event: typeof args.event === 'object'
                ? args.event.uuid
                : args.event,
                                settlement: typeof args.settlement === 'object'
                ? args.settlement.uuid
                : args.settlement,
                }

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SettlementController::destroy
 * @see app/Http/Controllers/SettlementController.php:52
 * @route '/groups/{group}/events/{event}/settlements/{settlement}'
 */
destroy.delete = (args: { group: string | { uuid: string }, event: string | { uuid: string }, settlement: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, settlement: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const SettlementController = { store, destroy }

export default SettlementController