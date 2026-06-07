# Live QA Checklist - Yellow City Creator Studio

Use this before merging the production upgrade branch into main.

## Deployment
- Vercel preview deployment is READY.
- Preview URL opens in a browser.
- No runtime error, warning, or fatal logs appear during testing.
- Direct route refresh returns the app instead of a 404.

## Public landing page
- Homepage loads visually.
- Yellow City Custom Tees branding appears correctly.
- Start Your Order opens the upgraded studio experience.
- Get a Quote opens the upgraded studio experience.

## Upgraded studio
- Command Center renders.
- Active pipeline metric displays.
- Ready pickups metric displays.
- Low stock metric displays.
- Repeat value metric displays.

## Quote intake
- Start Order opens Quote Intake.
- Name and contact fields accept input.
- Project type selection works.
- Quantity updates the estimate.
- Deadline selection works.
- Artwork status selection works.
- Notes field accepts longer text.
- Submit quote request creates a lead.
- After submit, the app moves to Lead Queue.

## Lead queue
- Submitted lead appears with generated YCCT lead ID.
- Lead estimate is formatted as currency.
- Lead status shows New.

## Production board
- Production Board renders all stages.
- Orders appear under the correct stages.
- Horizontal layout works on smaller screens.

## Growth engines
- Route 66 booth mode card renders.
- Team stores card renders.
- Customer reorders card renders.
- Graduation campaigns card renders.
- Business uniforms card renders.
- Marketing proof card renders.

## Inventory ops
- Inventory table renders.
- Low-stock count appears.
- SKU, item, stock, reorder, and best-for fields are visible.

## Proof pack
- Proof Pack renders.
- GitHub and Vercel proof items display.
- Business value statement displays.

## Merge readiness
- GitHub Actions quality check passes.
- Vercel preview passes.
- Critical audit gate passes or a documented exception exists.
- Manual click-through is complete.
- Pull request is moved from draft to ready for review.
