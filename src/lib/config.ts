import { parseSiteConfig, extractMenu } from '@glw907/cairn-cms';
import raw from './site.config.yaml?raw';

/** The site's canonical config, read from the git-committed YAML at build time (Pass L). */
export const siteConfig = parseSiteConfig(raw);

export const SITE_URL                = siteConfig.url ?? '';
export const SITE_TITLE              = siteConfig.siteName;
export const SITE_DESCRIPTION        = siteConfig.description ?? '';
export const SITE_AUTHOR             = siteConfig.author ?? '';
export const SITE_LOCALE             = siteConfig.locale ?? 'en-US';
export const FEED_MAX_ITEMS          = siteConfig.settings?.feedMaxItems ?? 20;  // 0 = include all posts
export const HOMEPAGE_FEATURED_COUNT = siteConfig.settings?.homepageFeaturedCount ?? 1;

/** The primary header navigation, read from the site config (Pass L). */
export const PRIMARY_NAV = extractMenu(siteConfig, 'primary', 2);
