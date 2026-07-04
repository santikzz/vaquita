import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::store
 * @see app/Http/Controllers/GroupController.php:152
 * @route '/groups/quick'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups/quick',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
 * @see app/Http/Controllers/GroupController.php:152
 * @route '/groups/quick'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
 * @see app/Http/Controllers/GroupController.php:152
 * @route '/groups/quick'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const quick = {
    store: Object.assign(store, store),
}

export default quick