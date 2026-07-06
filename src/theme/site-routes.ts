// 907's site-owned, non-concept public routes: the four bare routes the site resolver cannot see,
// since none is a concept entry. sitemapView folds these in ahead of every concept url, and the
// unlisted-route test (src/tests/content/sitemap.test.ts) fails the build if a route directory
// under (site) ever drifts out of sync with this list. Theme-owned, not chassis: the chassis's
// content.ts (site/posts/ORIGIN/SITE_DESCRIPTION) knows nothing about a site's own route tree.
export const EXTRA_ROUTES = ['/', '/about', '/archives', '/tags'];
