import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EventController::create
 * @see app/Http/Controllers/EventController.php:25
 * @route '/groups/{group}/events/create'
 */
export const create = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/groups/{group}/events/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EventController::create
 * @see app/Http/Controllers/EventController.php:25
 * @route '/groups/{group}/events/create'
 */
create.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { group: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: typeof args.group === 'object'
                ? args.group.uuid
                : args.group,
                }

    return create.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventController::create
 * @see app/Http/Controllers/EventController.php:25
 * @route '/groups/{group}/events/create'
 */
create.get = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EventController::create
 * @see app/Http/Controllers/EventController.php:25
 * @route '/groups/{group}/events/create'
 */
create.head = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EventController::store
 * @see app/Http/Controllers/EventController.php:37
 * @route '/groups/{group}/events'
 */
export const store = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups/{group}/events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EventController::store
 * @see app/Http/Controllers/EventController.php:37
 * @route '/groups/{group}/events'
 */
store.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { group: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: typeof args.group === 'object'
                ? args.group.uuid
                : args.group,
                }

    return store.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventController::store
 * @see app/Http/Controllers/EventController.php:37
 * @route '/groups/{group}/events'
 */
store.post = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EventController::show
 * @see app/Http/Controllers/EventController.php:59
 * @route '/groups/{group}/events/{event}'
 */
export const show = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/groups/{group}/events/{event}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EventController::show
 * @see app/Http/Controllers/EventController.php:59
 * @route '/groups/{group}/events/{event}'
 */
show.url = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventController::show
 * @see app/Http/Controllers/EventController.php:59
 * @route '/groups/{group}/events/{event}'
 */
show.get = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EventController::show
 * @see app/Http/Controllers/EventController.php:59
 * @route '/groups/{group}/events/{event}'
 */
show.head = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EventController::edit
 * @see app/Http/Controllers/EventController.php:123
 * @route '/groups/{group}/events/{event}/edit'
 */
export const edit = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/groups/{group}/events/{event}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EventController::edit
 * @see app/Http/Controllers/EventController.php:123
 * @route '/groups/{group}/events/{event}/edit'
 */
edit.url = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventController::edit
 * @see app/Http/Controllers/EventController.php:123
 * @route '/groups/{group}/events/{event}/edit'
 */
edit.get = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EventController::edit
 * @see app/Http/Controllers/EventController.php:123
 * @route '/groups/{group}/events/{event}/edit'
 */
edit.head = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EventController::update
 * @see app/Http/Controllers/EventController.php:141
 * @route '/groups/{group}/events/{event}'
 */
export const update = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/groups/{group}/events/{event}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EventController::update
 * @see app/Http/Controllers/EventController.php:141
 * @route '/groups/{group}/events/{event}'
 */
update.url = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventController::update
 * @see app/Http/Controllers/EventController.php:141
 * @route '/groups/{group}/events/{event}'
 */
update.post = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EventController::destroy
 * @see app/Http/Controllers/EventController.php:168
 * @route '/groups/{group}/events/{event}'
 */
export const destroy = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/groups/{group}/events/{event}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EventController::destroy
 * @see app/Http/Controllers/EventController.php:168
 * @route '/groups/{group}/events/{event}'
 */
destroy.url = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventController::destroy
 * @see app/Http/Controllers/EventController.php:168
 * @route '/groups/{group}/events/{event}'
 */
destroy.delete = (args: { group: string | { uuid: string }, event: string | { uuid: string } } | [group: string | { uuid: string }, event: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const EventController = { create, store, show, edit, update, destroy }

export default EventController