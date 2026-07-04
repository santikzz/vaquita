import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
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
const invite = {
    regenerate: Object.assign(regenerate, regenerate),
}

export default invite