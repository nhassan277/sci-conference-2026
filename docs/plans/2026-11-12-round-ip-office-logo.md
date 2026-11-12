# Round IP Office Logo Implementation Plan

**Goal:** Display the office logo in its natural circular form without the surrounding white rectangle, keeping the full border, lettering and artwork, only on Workshops.

**Architecture:** Create a separate lossless transparent derivative from the existing user upload. Keep the white interior and every meaningful original artwork pixel, and remove the exterior rectangular margin only. Update only the workshop logo URL and dimensions in central content; existing object-contain UI remains unchanged. Preserve source upload and other pages/assets.

**Tech Stack:** Pillow/OpenCV for deterministic pixel-preserving transparency/trim, React/TypeScript, Vitest, Puppeteer.

## Steps

1. Prepare isolated circular transparent derivative; validate retained artwork pixels and alpha corners, unchanged original SHA256; host separately and verify byte/dimension/alpha equality. Never reopen original attachment with file tools.
2. Before altering app data, extend `client/src/data/sci2027Workshops.test.ts` to reject old rectangular asset and require square transparent-derivative dimensions while retaining logo/source/text and object-contain contracts. Run focused tests and confirm expected RED.
3. Replace only workshop logo URL/dimensions in `client/src/data/sci2027Content.ts`; no JSX crop, CSS clip or extra circular container. Run focused and full tests, typecheck, build and diff checks.
4. Review one derived preview and desktop/mobile screenshots. Verify native square sizing, transparent corners, complete circular border/text, unchanged workshop details and no restored announcement. Compare all other central data and files with HEAD, original hash unchanged, then mark active tasks complete and save checkpoint.

## Completed verification

- Created a 1056×1056 lossless RGBA PNG using only an existing-pixel crop and circular alpha outside the complete mark. White inside the logo remains opaque; all four corners are fully transparent. All 276,292 numerically identified meaningful source pixels are fully opaque and unmodified, including the gold/navy border and lettering. The original JPEG SHA256 remains unchanged.
- Hosted PNG HTTP 200; remote bytes, decoded RGBA and alpha exactly match the derivative. No originals or prior assets deleted. Source and hosted verification recorded in `/tmp/sci2027-round-ip-logo/manifest.json`.
- Expected TDD RED: previous rectangular logo URL rejected (one failed / six passed). After replacing only the workshop logo URL and dimensions, seven focused tests and all 160 tests across eight files passed. TypeScript, production build and git diff --check passed. Existing pnpm settings and build chunk-size warnings remain non-blocking.
- Desktop1920/mobile375 screenshots confirm the natural circular mark on the existing ivory card with no rectangular white corners, full border/lettering and no CSS cropping. Native/display ratios square, object-contain, no clip-path, no horizontal overflow or runtime page errors. Workshop facts, logo alt/source, scheduling/registration TBA/Coming soon and removed-poster state unchanged.
- QA hash-compared 765 other tracked files against HEAD: all byte-identical. Restoring only the prior logo data block makes central data exactly equal to HEAD, demonstrating no other conference data changed. No JSX/CSS/route/backend/admin/archive/form/fee/date changes. Review evidence `/tmp/sci2027-round-logo-ui-results.json`.
