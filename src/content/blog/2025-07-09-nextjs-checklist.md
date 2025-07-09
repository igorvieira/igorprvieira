---
title: Next.js 15 – Practical Optimization Checklist
pubDate: "JUl 09 2025"
description: "NextJS Checklist for improving your application!"
category: nextjs, react, frontend
heroImage: /tools.jpg
---

 

I found this [`article`](https://www.linkedin.com/posts/rkhael_mais-uma-vez-peguei-um-projeto-criado-em-activity-7340759192430948352-1LP3/?utm_medium=ios_app&rcm=ACoAABIQAKQBGUNkQvsx2FPd91Nw03-P8wzWw5c&utm_source=social_share_send&utm_campaign=copy_link) so good and useful that I decided to create a checklist with ChatGPT of things to review and ensure I'm getting the most out of my Next.js application.

If you're interested, the list is below. I truly believe it's worth going through each point and seeing what you can improve to make your app faster and more efficient.

## Initial analysis

- [ ] Run next build && ANALYZE=true to inspect bundle size
- [ ] Test Lighthouse, WebPageTest, and Chrome UX Report
- [ ] Analyze Vercel logs (server cache, headers, CDN hits)
- [ ] Use React Profiler and Chrome flamegraph
- [ ] Focus on reducing initial bundle size and INP

## Common issues found

- [ ] Overuse of "use client" on all components
- [ ] Data fetching with axios inside useEffect
- [ ] Too many global Context Providers
- [ ] No loading indicators (loading.tsx missing)
- [ ] Large libraries imported on client (chart.js, xlsx, moment)
- [ ] No cache strategy (server or client)
- [ ] Initial bundle size > 5MB (brotli)

## Fixes & improvements

- [ ] Use Server Components wherever possible
- [ ] Remove "use client" from pure UI components
- [ ] Fetch data directly in server components with fetch()
- [ ] Enable caching  with fetch(..., { next: { revalidate: 300 } })
- [ ] Use cache: 'no-store' for dynamic data
- [ ] Apply ISR and revalidate for semi-static routes
- [ ] Use next/dynamic to load heavy libraries only when needed
- [ ] Replace moment.js with date-fns or dayjs
- [ ] Implement Server Actions for form submissions
- [ ] Reduce unnecessary useState and useEffect
- [ ] Run logic on Edge Runtime where applicable
- [ ] Add loading.tsx and Suspense boundaries
- [ ] Create middleware for routing logic or feedback
- [ ] Final bundle target: ~700KB (brotli)
- [ ] Target INP < 200ms (ideal: ~100ms)

## Bonus ideas

- [ ] Explore islands architecture
- [ ] Look into resumability frameworks (e.g. Qwik)
- [ ] Experiment with React 19 features (use, time slicing, transitions)

---

Original article: https://shorturl.at/biCkN

See ya!
