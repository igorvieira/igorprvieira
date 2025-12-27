---

title: How I made data tables actually usable on Mobile
pubDate: "Dec 26 2025"
description: "Practical UX improvements for tables and tabs on small screens"
heroImage: "https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
category: react, javascript, tailwind, typescript
---

A few days ago, I ran into a problem that looks simple at first: what do you do when a data table’s action buttons no longer fit and everything starts to break?

The usual answer is “just add horizontal scroll.” But in practice, it’s rarely that simple. On small screens, space is limited, layouts fall apart quickly, and a poorly implemented scroll can make the experience feel clunky instead of helpful.

This is the kind of problem I always end up rediscovering months later, so I decided to document a solution I can confidently reuse.

Picture this: a table with six columns—user data plus action buttons. On desktop, it looks great. On mobile? Total disaster.

And it's not just tables.

* Tab navigation with four or five tabs doesn't fit.
* Action buttons wrap onto multiple lines and look broken.

Users expect smooth, app-like experiences. They want to drag and scroll naturally—not fight against rigid, awkward interfaces.

---

## The Solution: a drag-to-scroll hook

The first thing I built was a custom React hook that lets users click and drag to scroll horizontally—similar to swiping on a phone, but using a mouse.

```javascript
import { useEffect, useRef, useState } from 'react'

const DRAG_SPEED = 1.5 // How fast the scroll follows your drag

const useDragScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const onMouseDown = (e: MouseEvent) => {
      isDown = true
      setIsDragging(true)
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }

    const onMouseUp = () => {
      isDown = false
      setIsDragging(false)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * DRAG_SPEED
      el.scrollLeft = scrollLeft - walk
    }

    const onMouseLeave = () => {
      isDown = false
      setIsDragging(false)
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return { scrollRef, isDragging }
}
```

### Why attach events inside useEffect?

If you attach `onMouseDown` directly in JSX, you’ll likely run into accessibility linting warnings about mouse events on non-interactive elements. Attaching events imperatively inside `useEffect` avoids that problem while keeping the markup clean.

### Why use a local variable instead of state for isDown?

Performance. During a drag operation, `mousemove` fires constantly. If `isDown` were state, you’d trigger re-renders on every pixel of movement. Local variables update instantly without causing unnecessary renders.

---

## Hiding that ugly scrollbar

Scrollbars tend to look clunky—especially when drag-to-scroll is enabled. But you can’t remove scrolling entirely; users still need it.

The trick is simple: hide the *visual* scrollbar while keeping the scroll behavior.

```css
/* Chrome, Safari, Edge */
.scroll-container::-webkit-scrollbar {
  display: none;
}

/* Firefox */
.scroll-container {
  scrollbar-width: none;
}

/* IE (if you still care) */
.scroll-container {
  -ms-overflow-style: none;
}
```

With Tailwind, you can do this inline using arbitrary values:

```jsx
className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
```

It’s not pretty—but it works everywhere.

---

## Putting it together

Here’s how you can wrap a table with drag-to-scroll enabled:

```javascript
const ScrollableTable = ({ children }) => {
  const { scrollRef, isDragging } = useDragScroll()

  return (
    <div
      ref={scrollRef}
      role="region"
      aria-label="Data table"
      className={`
        overflow-x-auto
        [-ms-overflow-style:none]
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
    >
      {children}
    </div>
  )
}

// Usage
<ScrollableTable>
  <Table data={invoices} columns={columns} />
</ScrollableTable>
```

The cursor changes from an open hand to a closed fist while dragging. It’s a small detail, but it makes the interaction feel much more polished.

---

## Scrollable tabs

The same pattern works perfectly for tab navigation:

```javascript
const ScrollableTabs = ({ tabs, activeTab, onSelect }) => {
  const { scrollRef, isDragging } = useDragScroll()

  return (
    <div
      ref={scrollRef}
      className={`
        overflow-x-auto overflow-y-hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
    >
      <ul className="flex w-max gap-2">
        {tabs.map(tab => (
          <li key={tab.id}>
            <button onClick={() => onSelect(tab)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Important:** notice the `w-max` on the inner container. This forces it to grow to fit all tabs, which is what triggers horizontal scrolling on the parent.

---

## Custom breakpoints

I only wanted this scrolling behavior on smaller screens. Above a certain width, everything fits just fine.

```css
@custom-media --wide (min-width: 1460px);
```

Then conditionally apply overflow:

```jsx
className="overflow-x-auto wide:overflow-x-visible"
```

* Below 1460px: scrolling enabled
* Above 1460px: normal layout

Adjust the breakpoint to whatever makes sense for your content.

---

## Keeping action buttons in line

One common annoyance is action buttons wrapping onto multiple lines inside table cells. The fix is simple:

```jsx
<div className="flex gap-2 whitespace-nowrap">
  <Button>Edit</Button>
  <Button>Delete</Button>
</div>
```

`whitespace-nowrap` forces everything onto a single line. The table scrolls instead of the buttons breaking the layout.

---

## Don’t forget accessibility

Even when hiding scrollbars and adding drag behavior, accessibility still matters:

```jsx
<div
  role="region"
  aria-label="Your data list"
  // ... other props
>
```

Screen readers will announce “Your data list, region,” so users know they’re inside a scrollable area.

Keyboard users are also covered: they can tab through elements normally and use arrow keys to scroll when the region is focused.

---

## The result

Tables that scroll smoothly on mobile. Tabs you can drag through. Action buttons that stay aligned. And most importantly, an interface that feels native—not like a clumsy web workaround.

The hook is about 40 lines of code. The CSS is mostly copy‑and‑paste. But the UX improvement is huge.

<br />

You can find the complete demo on GitHub: [drag-scroll-demo](https://github.com/igorvieira/drag-scroll-demo)

