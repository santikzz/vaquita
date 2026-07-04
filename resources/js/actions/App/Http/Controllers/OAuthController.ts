import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OAuthController::redirectToGoogleOAuth
 * @see app/Http/Controllers/OAuthController.php:14
 * @route '/auth/google/redirect'
 */
export const redirectToGoogleOAuth = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToGoogleOAuth.url(options),
    method: 'get',
})

redirectToGoogleOAuth.definition = {
    methods: ["get","head"],
    url: '/auth/google/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OAuthController::redirectToGoogleOAuth
 * @see app/Http/Controllers/OAuthController.php:14
 * @route '/auth/google/redirect'
 */
redirectToGoogleOAuth.url = (options?: RouteQueryOptions) => {
    return redirectToGoogleOAuth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OAuthController::redirectToGoogleOAuth
 * @see app/Http/Controllers/OAuthController.php:14
 * @route '/auth/google/redirect'
 */
redirectToGoogleOAuth.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToGoogleOAuth.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OAuthController::redirectToGoogleOAuth
 * @see app/Http/Controllers/OAuthController.php:14
 * @route '/auth/google/redirect'
 */
redirectToGoogleOAuth.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToGoogleOAuth.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OAuthController::handleGoogleCallback
 * @see app/Http/Controllers/OAuthController.php:19
 * @route '/auth/google/callback'
 */
export const handleGoogleCallback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleGoogleCallback.url(options),
    method: 'get',
})

handleGoogleCallback.definition = {
    methods: ["get","head"],
    url: '/auth/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OAuthController::handleGoogleCallback
 * @see app/Http/Controllers/OAuthController.php:19
 * @route '/auth/google/callback'
 */
handleGoogleCallback.url = (options?: RouteQueryOptions) => {
    return handleGoogleCallback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OAuthController::handleGoogleCallback
 * @see app/Http/Controllers/OAuthController.php:19
 * @route '/auth/google/callback'
 */
handleGoogleCallback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleGoogleCallback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OAuthController::handleGoogleCallback
 * @see app/Http/Controllers/OAuthController.php:19
 * @route '/auth/google/callback'
 */
handleGoogleCallback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: handleGoogleCallback.url(options),
    method: 'head',
})
const OAuthController = { redirectToGoogleOAuth, handleGoogleCallback }

export default OAuthController