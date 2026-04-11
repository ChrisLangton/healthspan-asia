# Healthspan.Asia — Landing Page

Marketing landing page for [Healthspan.Asia](https://healthspan.asia), a longevity concierge service for men 50+ across Asia.

## Stack

Plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.

## Files

```
healthspan-asia/
├── index.html   — All page content and SVG icon sprite
├── style.css    — All styles and responsive layout
└── script.js    — Interactions, animations, and canvas particle effect
```

## Sections

- Hero with animated canvas particle background
- Empathy / problem framing
- What is Healthspan? (with animated bar chart)
- What Affects Your Healthspan? (10 factor cards)
- Your Objectives (interactive goal selector)
- What Does Healthspan.Asia Do? (services across 3 dimensions)
- How We Work Together
- Personalisation For You (Science, Art, Tracking)
- About & Mission
- Member Testimonials (paginated, swipeable)
- Plain Language Glossary (accordion)
- Social proof bar
- CTA / contact form
- FAQ accordion

## Hosting

Deployed via [Netlify](https://netlify.com) with automatic deploys on push to `main`. Custom domain managed via GoDaddy DNS.

## Updating the site

Edit the files locally, then:

```bash
git add .
git commit -m "your message"
git push
```

Netlify will deploy the update automatically within ~30 seconds.
