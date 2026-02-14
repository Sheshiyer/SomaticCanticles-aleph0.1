
export const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/'

    // If on client side and we have a window, prioritize that to ensure we match the current domain
    if (typeof window !== 'undefined' && window.location.origin) {
        url = window.location.origin
    }
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to include a trailing slash
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
}
