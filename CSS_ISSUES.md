# Outstanding CSS Issues

Compare test site (https://907-life.glw907.workers.dev/) with live site (https://907.life/)

## Current Issues to Fix

1. **Index page post title font** - Font does not match live site
   - Location: Homepage post titles (h2.post-title)
   - Need to verify exact font being used

2. **Post dates color** - Should be slightly lighter grey
   - Location: Post date links on index page
   - Currently too dark, needs to be lighter than live site

3. **Primary nav button padding/spacing** - Does not match live site
   - Location: Navigation buttons in header
   - Check both padding within buttons and margin between buttons

4. **Nav button colors** - Both font and outline color incorrect
   - Location: Navigation buttons
   - Both the text color and border color need adjustment

5. **Post title underline weight** - Too heavy on index page
   - Location: Post title links on homepage
   - Current underline is thicker than live site

## Reference Files

Live site CSS files (already downloaded to /tmp):
- `/tmp/live-main.css` - Base Tiny Theme CSS
- `/tmp/live-custom.css` - Custom overrides

## Debugging Approach

For each issue:
1. Use `grep` to find exact values in `/tmp/live-main.css` and `/tmp/live-custom.css`
2. Compare with current values in `static/css/styles.css`
3. Update to match exactly
4. Deploy and verify with hard refresh (Ctrl+Shift+R)

## Notes

- The live site loads three stylesheets: main.css, Font Awesome, custom.css
- Our single styles.css combines main.css and custom.css
- Variable names must match exactly: `--font_neo-grotesque` not `--font-heading`
- CSS specificity matters - check if live site uses more specific selectors
