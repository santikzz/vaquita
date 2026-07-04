import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MemberController::store
 * @see app/Http/Controllers/MemberController.php:11
 * @route '/groups/{group}/members'
 */
export const store = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups/{group}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemberController::store
 * @see app/Http/Controllers/MemberController.php:11
 * @route '/groups/{group}/members'
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
* @see \App\Http\Controllers\MemberController::store
 * @see app/Http/Controllers/MemberController.php:11
 * @route '/groups/{group}/members'
 */
store.post = (args: { group: string | { uuid: string } } | [group: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberController::update
 * @see app/Http/Controllers/MemberController.php:27
 * @route '/groups/{group}/members/{member}'
 */
export const update = (args: { group: string | { uuid: string }, member: string | { uuid: string } } | [group: string | { uuid: string }, member: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/groups/{group}/members/{member}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemberController::update
 * @see app/Http/Controllers/MemberController.php:27
 * @route '/groups/{group}/members/{member}'
 */
update.url = (args: { group: string | { uuid: string }, member: string | { uuid: string } } | [group: string | { uuid: string }, member: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    member: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: typeof args.group === 'object'
                ? args.group.uuid
                : args.group,
                                member: typeof args.member === 'object'
                ? args.member.uuid
                : args.member,
                }

    return update.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberController::update
 * @see app/Http/Controllers/MemberController.php:27
 * @route '/groups/{group}/members/{member}'
 */
update.post = (args: { group: string | { uuid: string }, member: string | { uuid: string } } | [group: string | { uuid: string }, member: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberController::destroy
 * @see app/Http/Controllers/MemberController.php:70
 * @route '/groups/{group}/members/{member}'
 */
export const destroy = (args: { group: string | { uuid: string }, member: string | { uuid: string } } | [group: string | { uuid: string }, member: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/groups/{group}/members/{member}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MemberController::destroy
 * @see app/Http/Controllers/MemberController.php:70
 * @route '/groups/{group}/members/{member}'
 */
destroy.url = (args: { group: string | { uuid: string }, member: string | { uuid: string } } | [group: string | { uuid: string }, member: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                    member: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: typeof args.group === 'object'
                ? args.group.uuid
                : args.group,
                                member: typeof args.member === 'object'
                ? args.member.uuid
                : args.member,
                }

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberController::destroy
 * @see app/Http/Controllers/MemberController.php:70
 * @route '/groups/{group}/members/{member}'
 */
destroy.delete = (args: { group: string | { uuid: string }, member: string | { uuid: string } } | [group: string | { uuid: string }, member: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const members = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default members