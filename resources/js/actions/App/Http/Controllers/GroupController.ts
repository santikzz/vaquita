import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::index
 * @see app/Http/Controllers/GroupController.php:20
 * @route '/groups'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::index
 * @see app/Http/Controllers/GroupController.php:20
 * @route '/groups'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::index
 * @see app/Http/Controllers/GroupController.php:20
 * @route '/groups'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GroupController::index
 * @see app/Http/Controllers/GroupController.php:20
 * @route '/groups'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::create
 * @see app/Http/Controllers/GroupController.php:41
 * @route '/groups/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/groups/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::create
 * @see app/Http/Controllers/GroupController.php:41
 * @route '/groups/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::create
 * @see app/Http/Controllers/GroupController.php:41
 * @route '/groups/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GroupController::create
 * @see app/Http/Controllers/GroupController.php:41
 * @route '/groups/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::quick
 * @see app/Http/Controllers/GroupController.php:145
 * @route '/groups/quick'
 */
export const quick = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: quick.url(options),
    method: 'get',
})

quick.definition = {
    methods: ["get","head"],
    url: '/groups/quick',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::quick
 * @see app/Http/Controllers/GroupController.php:145
 * @route '/groups/quick'
 */
quick.url = (options?: RouteQueryOptions) => {
    return quick.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::quick
 * @see app/Http/Controllers/GroupController.php:145
 * @route '/groups/quick'
 */
quick.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: quick.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GroupController::quick
 * @see app/Http/Controllers/GroupController.php:145
 * @route '/groups/quick'
 */
quick.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: quick.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::storeQuick
 * @see app/Http/Controllers/GroupController.php:152
 * @route '/groups/quick'
 */
export const storeQuick = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeQuick.url(options),
    method: 'post',
})

storeQuick.definition = {
    methods: ["post"],
    url: '/groups/quick',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::storeQuick
 * @see app/Http/Controllers/GroupController.php:152
 * @route '/groups/quick'
 */
storeQuick.url = (options?: RouteQueryOptions) => {
    return storeQuick.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::storeQuick
 * @see app/Http/Controllers/GroupController.php:152
 * @route '/groups/quick'
 */
storeQuick.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeQuick.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
 * @see app/Http/Controllers/GroupController.php:48
 * @route '/groups'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
 * @see app/Http/Controllers/GroupController.php:48
 * @route '/groups'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
 * @see app/Http/Controllers/GroupController.php:48
 * @route '/groups'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::show
 * @see app/Http/Controllers/GroupController.php:72
 * @route '/groups/{group}'
 */
export const show = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/groups/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::show
 * @see app/Http/Controllers/GroupController.php:72
 * @route '/groups/{group}'
 */
show.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::show
 * @see app/Http/Controllers/GroupController.php:72
 * @route '/groups/{group}'
 */
show.get = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GroupController::show
 * @see app/Http/Controllers/GroupController.php:72
 * @route '/groups/{group}'
 */
show.head = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::edit
 * @see app/Http/Controllers/GroupController.php:108
 * @route '/groups/{group}/edit'
 */
export const edit = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/groups/{group}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::edit
 * @see app/Http/Controllers/GroupController.php:108
 * @route '/groups/{group}/edit'
 */
edit.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::edit
 * @see app/Http/Controllers/GroupController.php:108
 * @route '/groups/{group}/edit'
 */
edit.get = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GroupController::edit
 * @see app/Http/Controllers/GroupController.php:108
 * @route '/groups/{group}/edit'
 */
edit.head = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::update
 * @see app/Http/Controllers/GroupController.php:117
 * @route '/groups/{group}'
 */
export const update = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/groups/{group}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::update
 * @see app/Http/Controllers/GroupController.php:117
 * @route '/groups/{group}'
 */
update.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::update
 * @see app/Http/Controllers/GroupController.php:117
 * @route '/groups/{group}'
 */
update.post = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::destroy
 * @see app/Http/Controllers/GroupController.php:131
 * @route '/groups/{group}'
 */
export const destroy = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/groups/{group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::destroy
 * @see app/Http/Controllers/GroupController.php:131
 * @route '/groups/{group}'
 */
destroy.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::destroy
 * @see app/Http/Controllers/GroupController.php:131
 * @route '/groups/{group}'
 */
destroy.delete = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const GroupController = { index, create, quick, storeQuick, store, show, edit, update, destroy }

export default GroupController