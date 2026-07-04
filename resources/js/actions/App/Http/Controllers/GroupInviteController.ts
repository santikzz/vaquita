import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupInviteController::regenerate
 * @see app/Http/Controllers/GroupInviteController.php:20
 * @route '/groups/{group}/invite/regenerate'
 */
export const regenerate = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerate.url(args, options),
    method: 'post',
})

regenerate.definition = {
    methods: ["post"],
    url: '/groups/{group}/invite/regenerate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupInviteController::regenerate
 * @see app/Http/Controllers/GroupInviteController.php:20
 * @route '/groups/{group}/invite/regenerate'
 */
regenerate.url = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return regenerate.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupInviteController::regenerate
 * @see app/Http/Controllers/GroupInviteController.php:20
 * @route '/groups/{group}/invite/regenerate'
 */
regenerate.post = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupInviteController::show
 * @see app/Http/Controllers/GroupInviteController.php:29
 * @route '/join/{code}'
 */
export const show = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/join/{code}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupInviteController::show
 * @see app/Http/Controllers/GroupInviteController.php:29
 * @route '/join/{code}'
 */
show.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        code: args.code,
                }

    return show.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupInviteController::show
 * @see app/Http/Controllers/GroupInviteController.php:29
 * @route '/join/{code}'
 */
show.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GroupInviteController::show
 * @see app/Http/Controllers/GroupInviteController.php:29
 * @route '/join/{code}'
 */
show.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupInviteController::store
 * @see app/Http/Controllers/GroupInviteController.php:54
 * @route '/join/{code}'
 */
export const store = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/join/{code}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupInviteController::store
 * @see app/Http/Controllers/GroupInviteController.php:54
 * @route '/join/{code}'
 */
store.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        code: args.code,
                }

    return store.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupInviteController::store
 * @see app/Http/Controllers/GroupInviteController.php:54
 * @route '/join/{code}'
 */
store.post = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})
const GroupInviteController = { regenerate, show, store }

export default GroupInviteController