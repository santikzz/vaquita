import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ExpenseController::create
 * @see app/Http/Controllers/ExpenseController.php:28
 * @route '/groups/{group}/events/{event}/expenses/create'
 */
export const create = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/groups/{group}/events/{event}/expenses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExpenseController::create
 * @see app/Http/Controllers/ExpenseController.php:28
 * @route '/groups/{group}/events/{event}/expenses/create'
 */
create.url = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExpenseController::create
 * @see app/Http/Controllers/ExpenseController.php:28
 * @route '/groups/{group}/events/{event}/expenses/create'
 */
create.get = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExpenseController::create
 * @see app/Http/Controllers/ExpenseController.php:28
 * @route '/groups/{group}/events/{event}/expenses/create'
 */
create.head = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ExpenseController::store
 * @see app/Http/Controllers/ExpenseController.php:39
 * @route '/groups/{group}/events/{event}/expenses'
 */
export const store = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups/{group}/events/{event}/expenses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExpenseController::store
 * @see app/Http/Controllers/ExpenseController.php:39
 * @route '/groups/{group}/events/{event}/expenses'
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
* @see \App\Http\Controllers\ExpenseController::store
 * @see app/Http/Controllers/ExpenseController.php:39
 * @route '/groups/{group}/events/{event}/expenses'
 */
store.post = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExpenseController::edit
 * @see app/Http/Controllers/ExpenseController.php:50
 * @route '/groups/{group}/events/{event}/expenses/{expense}/edit'
 */
export const edit = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/groups/{group}/events/{event}/expenses/{expense}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExpenseController::edit
 * @see app/Http/Controllers/ExpenseController.php:50
 * @route '/groups/{group}/events/{event}/expenses/{expense}/edit'
 */
edit.url = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    event: args[1],
                    expense: args[2],
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
                                expense: typeof args.expense === 'object'
                ? args.expense.uuid
                : args.expense,
                }

    return edit.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExpenseController::edit
 * @see app/Http/Controllers/ExpenseController.php:50
 * @route '/groups/{group}/events/{event}/expenses/{expense}/edit'
 */
edit.get = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExpenseController::edit
 * @see app/Http/Controllers/ExpenseController.php:50
 * @route '/groups/{group}/events/{event}/expenses/{expense}/edit'
 */
edit.head = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ExpenseController::update
 * @see app/Http/Controllers/ExpenseController.php:76
 * @route '/groups/{group}/events/{event}/expenses/{expense}'
 */
export const update = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/groups/{group}/events/{event}/expenses/{expense}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExpenseController::update
 * @see app/Http/Controllers/ExpenseController.php:76
 * @route '/groups/{group}/events/{event}/expenses/{expense}'
 */
update.url = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    event: args[1],
                    expense: args[2],
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
                                expense: typeof args.expense === 'object'
                ? args.expense.uuid
                : args.expense,
                }

    return update.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExpenseController::update
 * @see app/Http/Controllers/ExpenseController.php:76
 * @route '/groups/{group}/events/{event}/expenses/{expense}'
 */
update.post = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExpenseController::destroy
 * @see app/Http/Controllers/ExpenseController.php:87
 * @route '/groups/{group}/events/{event}/expenses/{expense}'
 */
export const destroy = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/groups/{group}/events/{event}/expenses/{expense}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ExpenseController::destroy
 * @see app/Http/Controllers/ExpenseController.php:87
 * @route '/groups/{group}/events/{event}/expenses/{expense}'
 */
destroy.url = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    event: args[1],
                    expense: args[2],
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
                                expense: typeof args.expense === 'object'
                ? args.expense.uuid
                : args.expense,
                }

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExpenseController::destroy
 * @see app/Http/Controllers/ExpenseController.php:87
 * @route '/groups/{group}/events/{event}/expenses/{expense}'
 */
destroy.delete = (args: { group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string }, expense: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const expenses = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default expenses