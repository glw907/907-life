import { parseSiteConfig, extractMenu } from '@glw907/cairn-cms';
import raw from './site.config.yaml?raw';

/** The site's canonical config, read from the git-committed YAML at build time (Pass L). */
export const siteConfig = parseSiteConfig(raw);

export const SITE_URL                = siteConfig.url ?? '';
export const SITE_TITLE              = siteConfig.siteName;
export const SITE_DESCRIPTION        = siteConfig.description ?? '';
export const SITE_AUTHOR             = siteConfig.author ?? '';
export const SITE_LOCALE             = siteConfig.locale ?? 'en-US';
// `settings` and `email` arrive through SiteConfig's index signature as `unknown`; read them
// through narrow shapes rather than chaining off `unknown`.
const settings = siteConfig.settings as
  | { feedMaxItems?: number; homepageFeaturedCount?: number; ogImage?: string }
  | undefined;

/** The contact-form sender identity, read from the site config. */
export const SITE_EMAIL = (siteConfig.email as
  | { sender?: string; senderName?: string }
  | undefined) ?? {};

export const FEED_MAX_ITEMS          = settings?.feedMaxItems ?? 20;  // 0 = include all posts
export const HOMEPAGE_FEATURED_COUNT = settings?.homepageFeaturedCount ?? 1;

/** Site-wide default OG image path, empty when unset. Threaded to the public head. */
export const SITE_OG_IMAGE = settings?.ogImage ?? '';

/** The primary header navigation, read from the site config (Pass L). */
export const PRIMARY_NAV = extractMenu(siteConfig, 'primary', 2);
