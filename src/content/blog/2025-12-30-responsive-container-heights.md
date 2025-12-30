---

title: "Responsive Container Heights: Why max() Beats calc() for Scroll Control" 
pubDate: "Dec 29 2025"
description: "Practical UX improvements for tables and tabs on small screens"
heroImage: "https://images.unsplash.com/photo-1766445318570-1dc4bf3f5d79?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
category: css, html
---



You have a landing page with absolutely positioned elements. The content needs around 1000px of vertical space, but on smaller screens (like a MacBook 14"), users can't scroll to see everything.

A common quick fix looks like this:

```css
.container {
  min-height: calc(100vh + 300px);
}
```

This forces scroll by adding 300px to the viewport height. **It works, but it's not the right solution.**

## Why `calc(100vh + 300px)` Falls Short

The problem with this approach is that it's **always additive**, regardless of screen size:

| Viewport Height | Result | Issue |
|-----------------|--------|-------|
| 800px | 1100px | ✓ Content fits |
| 982px | 1282px | ✓ Content fits |
| 1200px | 1500px | ✗ 200px of unnecessary scroll |
| 1440px | 1740px | ✗ 440px of wasted space |

On larger screens, users are forced to scroll through empty space. It's a poor user experience.

## The Better Approach: `max()`

Instead of blindly adding pixels, use `max()` to pick the larger value:

```css
.container {
  min-height: max(100vh, 1030px);
}
```

This reads as: *"Be at least as tall as the viewport OR 1030px, whichever is greater."*

| Viewport Height | Result | Behavior |
|-----------------|--------|----------|
| 800px | 1030px | Content fits, scroll enabled |
| 982px | 1030px | Content fits, minimal scroll |
| 1200px | 1200px | No scroll needed |
| 1440px | 1440px | No scroll needed |

## Visual Comparison

Here's what happens on a large viewport (1200px):

```css
    calc(100vh + 300px)              max(100vh, 1030px)

    ┌──────────────────┐             ┌──────────────────┐
    │                  │             │                  │
    │     Content      │             │     Content      │
    │                  │             │                  │
    │                  │             │                  │
    ├──────────────────┤ 1200px      └──────────────────┘ 1200px
    │░░░░░░░░░░░░░░░░░░│                    ↑
    │░░░ Empty Space ░░│                 No wasted
    │░░░░░░░░░░░░░░░░░░│                  scroll
    └──────────────────┘ 1500px
            ↑
      300px of forced
       useless scroll
```

And on a small viewport (800px):

```css
    calc(100vh + 300px)              max(100vh, 1030px)

    ┌──────────────────┐             ┌──────────────────┐
    │                  │             │                  │
    │     Content      │             │     Content      │
    │                  │             │                  │
    │                  │             │                  │
    │                  │             │                  │
    └──────────────────┘ 1100px      └──────────────────┘ 1030px
            ↑                                ↑
       Both work,                     Exactly what's
      but calc adds                      needed
       extra 70px
```

The difference is clear: `calc()` always adds unnecessary space, while `max()` adapts intelligently to each viewport.

## How to Calculate the Fixed Value

The magic number (1030px in this example) comes from measuring your actual content:

```css
Top offset of lowest element:     238px
+ Internal offset:                138px
+ Element height:                 535px
+ Bottom breathing room:          ~120px
─────────────────────────────────────────
Total:                            ~1030px
```

Audit your layout, find the lowest point of your content, add some margin, and use that value.

## Tailwind CSS Implementation

If you're using Tailwind, both approaches work with arbitrary values:

```html
<!-- ❌ Avoid -->
<div class="min-h-[calc(100vh+300px)]">

<!-- ✅ Prefer -->
<div class="min-h-[max(100vh,1030px)]">
```

## Key Takeaway

When dealing with fixed-position content that extends beyond the viewport:

- **Don't** blindly add pixels to viewport height
- **Do** use `max()` to set a content-aware minimum
- **Result**: Scroll when needed, no scroll when not

The `max()` function gives you precise control—ensuring your content always fits while respecting larger viewports. It's a small change that significantly improves the user experience across all screen sizes.

---

*Quick tip: If you find yourself frequently fighting scroll issues with absolute positioning, consider whether your layout could benefit from natural document flow using Flexbox or Grid instead.*
