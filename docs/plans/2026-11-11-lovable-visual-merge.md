# Lovable Visual Merge Implementation Plan

**Goal:** Port the approved Lovable SCI 2027 presentation to the existing Manus application, preserving its backend, forms, administration, archive records, database and DNS.

**Architecture:** Adapt React page markup and Wouter imports, not the external project router/runtime. Retain existing official dates, fees and registration actions. New details pages receive the content moved out of the homepage. Media is re-hosted outside the repository. No database reads/writes, environment changes or DNS operations are part of this work.

**Tech Stack:** Existing React, TypeScript, Wouter, Tailwind, Vite and Vitest.

## Approved exceptions, 11 November 2026

- Local Organizing Committee title; current /conference-organization-unit route.
- Add Prof. Walid Rahouma after the three patronage cards, with Conference Chair & Director of the Conference Organizing Unit role; use same role in his committee card.
- Preserve Prof. Hoda Abu Shady in the nine-member roster; missing portrait remains an honest placeholder.
- Place Youssef Saher Sayed (4th year student) and Ziad Ahmed (4th year student) under Dr. Nourhan Hassan in the streamlined committee layout; retain their names-only central acknowledgement data.
- 250 participants, but TWO workshop days, 6 and 10 April 2027.
- Display cou@sci.cu.edu.eg and sci2027@sci.cu.edu.eg in addition to existing Gmail; submission/payment destination stays sci.conf.2027@gmail.com.
- English remains the public language; no pending Arabic media-form translation or backend change.

## Tasks

1. Record protected-source fingerprints and a regression baseline. Add failing migration assertions for approved content, new routes, retained forms and moved content.
2. Retrieve supplied Lovable portrait bytes using the authorized shared-preview access; validate image types and dimensions, preserve pixels and re-host them. Never place preview tokens or /__l5e asset URLs in production.
3. Port homepage and committee page markup in independently owned files. Preserve nine members and their official role data. Fix abandoned internal anchors through route mappings/targets, rather than leaving dead links.
4. Port /venue, /gala-dinner and /programme-workshops by import adaptation, registering them in App.tsx while retaining all current routes. Maintain programme, videos, sponsorship, archive features and current media/sponsor registrations.
5. Apply the six approved data differences in sci2027Content.ts; adapt shared header/footer. Keep all unrelated central data identical to baseline.
6. Update obsolete source-location regression assertions to the moved sections while keeping meaningful coverage. Run pnpm test, pnpm check, pnpm build and git diff --check.
7. Review desktop and mobile routes, navigation targets, loaded portraits, fee/payment and official-form destinations. Compare protected source hashes. Record any asset blocker explicitly.
8. Complete the active checklist after verification and save a WebDev checkpoint. Do not claim publishing or domain changes without separate evidence.

## Verification completed, 11 November 2026

- Full suite: 148 tests across 6 test files passed. TypeScript, production build and `git diff --check` passed. Existing bundle-size and pnpm configuration warnings are non-blocking; no dependency changes were made.
- 131 protected files match their pre-merge SHA-256 fingerprints. All 37 existing concrete routes remain registered. Central conference data is byte-equivalent after normalizing only the approved data exceptions.
- Browser checks passed for 11 routes at both 1920 px and 375 px, with no page runtime errors or document-level horizontal overflow. Registration links, official Google Forms and payment-proof destination were checked without submitting forms or reading/writing database records.
- All nine supplied PNG assets were recovered through authorized shared-preview access and re-hosted byte-for-byte; eight distinct committee members have supplied photos, plus the identical Walid patronage variant. No preview token or external preview-asset URL was placed in application code. Hoda remains a confirmed member with an explicit photo placeholder.
- No database, backend, admin, auth, application environment, DNS, domain or deployment changes were performed. A saved WebDev checkpoint is the delivery artifact; publication is a separate action.
