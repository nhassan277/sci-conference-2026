# SCI 2027 Partnership and Sponsorship Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only SCI 2027 partnership and sponsorship experience consisting of a concise homepage invitation and a detailed `/sponsorship` page grounded in the supplied official sponsorship prospectus.

**Architecture:** Extend `sci2027Content.ts` with a single sponsorship source of truth for approved credibility figures, packages, the full benefit comparison, special opportunities and the dedicated enquiry email. Render that data in a new public page and a small homepage preview. Route the new page at `/sponsorship`, preserve `/sponsor` and `/sponsors` as public aliases, and surface it in shared navigation.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS, Lucide React, Vitest, Vite.

---

### Task 1: Define verified sponsorship data

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Add assertions for the approved sponsorship facts:

```ts
expect(sci2027Content.sponsorship.contactEmail).toBe("sci.conf.2027@gmail.com");
expect(sci2027Content.sponsorship.packages).toHaveLength(4);
expect(sci2027Content.sponsorship.packages.map((tier) => tier.investment)).toEqual([
  "EGP 500,000",
  "EGP 300,000",
  "EGP 175,000",
  "EGP 100,000",
]);
expect(sci2027Content.sponsorship.specialOpportunities).toHaveLength(10);
expect(sci2027Content.sponsorship.credibility[0].label).toBe("archival registrations recorded");
```

**Step 2: Run test to verify it fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because `sponsorship` is not present.

**Step 3: Write minimal implementation**

Add these prospectus-verified records to `sci2027Content.sponsorship`:

- Email-only CTA: `sci.conf.2027@gmail.com` and the exact button label `Request the Sponsorship Prospectus by Email`.
- The four packages, investments, exhibition footprint, registrations, advert level, social posts and all remaining supplied benefits.
- All ten special opportunities with their stated EGP ranges.
- SCI 2026 visibility figures: `1,088 archival registrations recorded`, `70 verified scientific contributions`, `10 workshops delivered`, and `16 partners`.

Do not add WhatsApp, external participant-institution logos or unsupported confirmed-attendance claims.

**Step 4: Run test to verify it passes**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 2: Add the sponsorship route, preview and detailed page

**Files:**
- Create: `client/src/pages/Sci2027Sponsorship.tsx`
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/components/Sci2027Header.tsx`
- Modify: `client/src/components/Sci2027Footer.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Add route and public-presenter expectations:

```ts
expect(existsSync(projectPath("client/src/pages/Sci2027Sponsorship.tsx"))).toBe(true);
expect(appSource).toContain('path={"/sponsorship"} component={Sci2027Sponsorship}');
expect(homeSource).toContain('href="/sponsorship"');
expect(sponsorshipSource).toContain("benefitMatrix");
expect(sponsorshipSource).toContain("specialOpportunities");
expect(sponsorshipSource).toContain("Request the Sponsorship Prospectus by Email");
```

Add the new page to `englishOnlyPublicFiles` so it cannot introduce Arabic visual copy, RTL markup or an Arabic brochure action.

**Step 2: Run test to verify it fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the page and `/sponsorship` route do not exist.

**Step 3: Write minimal implementation**

Create a fully English sponsorship page following the existing SCI 2027 editorial navy/gold style:

1. A partnership hero with the invitation to request the prospectus by email.
2. A transparent SCI 2026 visibility section with archival wording for registrations.
3. Four tier cards showing Platinum, Gold, Silver and Bronze investments.
4. A responsive full benefit-comparison matrix, retaining all benefits from the prospectus.
5. A special-opportunity section containing all ten contribution ranges.
6. An email-only final CTA; no WhatsApp or partner logos.

Add a homepage section with sponsorship value proposition, tier investment range and a link to `/sponsorship`. Add Sponsorship to the header and footer navigation. Map `/sponsorship`, `/sponsor` and `/sponsors` to the new public page so legacy public sponsor URLs no longer show SCI 2026 content.

**Step 4: Run test to verify it passes**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Expected: 0 failed tests, 0 TypeScript errors, a successful production build and no whitespace errors.

**Step 2: Visual review**

Capture desktop views of `/` and `/sponsorship`, plus a mobile full-page screenshot of `/sponsorship`. Verify the header/footer link, homepage preview, benefit matrix, all special opportunities and email-only CTA.

**Step 3: Update tracking and checkpoint**

Mark the sponsorship feature tasks complete in `todo.md`, leaving the distinct publishing task pending unless a live-domain check independently confirms the SCI 2027 release. Save a new WebDev checkpoint after the verification pass.
