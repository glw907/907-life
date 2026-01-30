# Outstanding site Issues

Compare test site (https://907-life.glw907.workers.dev/) with live site (https://907.life/), a micro.blog site with a customized tiny theme.

## Current Issues to Fix

1. **Index page post title font** - Font does not match live site
- Location: Homepage post titles (h2.post-title)
- Need to verify exact font being used

2. **Post dates color** - Should be slightly lighter grey
- Location: Post date links on index page
- Not trying to match the live site in this instance

3. **Primary nav button padding/spacing** - Does not match live site
- Location: Navigation buttons in header
- Check both padding within buttons and margin between buttons

4. **Nav button colors** - Both font and outline color incorrect
- Location: Navigation buttons
- Both the text color and border color need adjustment

5. **Nav button spacing** - Spacing between nav buttons does not match live site.
- Location: Navigation buttons
- Both spacing between buttons and padding inside buttons need adjustment

6. **Post title underline weight** - Too heavy on index page
- Location: Post title links on homepage
- Current underline is thicker than live site

7. **Contact form colors, spacing, and fonts** - Form needs trued to live site
- Location: Contact form on the About page
- Form field colors do not match live site
- Form field outlines do not match live site
- Name, Email, and Subject fields are all required and need validation functionally equivalent to live site.
- Form field font label decoration does not match live site

8. **Section separators do not match live site** - Form needs trued to live site
- Location: Between the About Geoffrey and the Contact section on the about page
- Separator does not match live site

9. **Too much spacing between lines** - Line spacing does not match live site.
- Location: All pages
- Check to make sure spacing for all styles matches live site.

10. **Content examples do not show all style** - Generate a post the demonstrates all available formatting
- Test post on live site here: https://907.life/2026/01/29/formatting-test-post.html
- The markdown I used to create the site is below.

11. **Continue Reading link to pronounced** - Link should not look like a primary navigation button
- Location: Index page at the end of long posts
- Remove "button border" from link
- Add an underline and subtle mouseover effect
- Make font slightly smaller and lighter

## Reference Files

Grab CSS references files from live site and put in /tmp
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
- The final css files, should be clean, well-order, and thoughtfully commented for easy future editing

## Markdown for Formatting Test Post

I used the following markdown for the formatting test post:

---

This post is a comprehensive **Markdown formatting test** intended to reveal how a Micro.blog theme renders common elements, edge cases, and inline HTML. It contains both typical content and awkward cases.

## Headings

# H1: Heading 1
## H2: Heading 2
### H3: Heading 3
#### H4: Heading 4
##### H5: Heading 5
###### H6: Heading 6

## Paragraphs & inline text

A normal paragraph with **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code`.

Hard line break (two spaces at end of line).  
This should appear on the next line.

## Links

- Plain URL: https://micro.blog
- Standard link: [Micro.blog](https://micro.blog)

## Images

![Placeholder](https://via.placeholder.com/640x360.png?text=Micro.blog+Theme+Test)

## Blockquotes

> This is a blockquote.
>
> With multiple paragraphs.

## Lists

- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Second item

- [ ] Task unchecked
- [x] Task checked

## Tables

| Column A | Column B |
|---------:|:---------|
| Right    | Left     |

## Code

Inline code: `const x = 42;`

```js
function hello() {
  console.log("Hello, world");
}
```

## Footnotes

Here is a footnote reference.[^1]

[^1]: This is the footnote text.

## HTML passthrough

<details>
  <summary>Expandable</summary>
  <p>Hidden content.</p>
</details>

---

End of test.

