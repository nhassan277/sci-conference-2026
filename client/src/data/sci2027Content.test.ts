import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sci2027Content } from "./sci2027Content";

const projectPath = (...segments: string[]) => resolve(process.cwd(), ...segments);

const hostedAssetKeys = [
  "detailedPoster",
  "simplePoster",
  "conferenceUnitLogo",
  "sci2027Logo",
] as const;

const localAssetKeys = [
  "cairoUniversityLogo",
  "conferenceUnitMark",
  "sciMasterLogo",
  "brochureEnglish",
  "brochureArabic",
] as const;

const englishOnlyPublicFiles = [
  "client/src/pages/Sci2027Home.tsx",
  "client/src/components/Sci2027Header.tsx",
  "client/src/components/Sci2027Footer.tsx",
  "client/src/pages/Sci2027Programme.tsx",
  "client/src/pages/Sci2026Archive.tsx",
] as const;

describe("SCI 2027 public content", () => {
  it("provides a dedicated source-of-truth content module", () => {
    expect(existsSync(projectPath("client/src/data/sci2027Content.ts"))).toBe(true);
  });

  it("uses the verified 2027 identity, six-track structure, and current official registration forms", () => {
    expect(sci2027Content.identity.edition).toBe("SCI 2027");
    expect(sci2027Content.identity.dates.en).toBe("7–8 April 2027");
    expect(sci2027Content.tracks).toHaveLength(6);
    expect(sci2027Content.registration.general.url).toBe("https://forms.gle/mr2gE9nsbdPrha9r6");
    expect(sci2027Content.registration.speaker.url).toBe("https://forms.gle/FRiza6zpfiQLrgrh8");
    expect(sci2027Content.sourceNote).not.toContain("SCI 2026");
  });

  it("includes the approved student research, thesis and graduation-project registration form", () => {
    expect(sci2027Content.registration.studentResearch.url).toBe("https://forms.gle/fmXUzEQ85hbXnLFp8");
    expect(sci2027Content.registration.studentResearch.name.en).toBe("Student Research, Thesis & Graduation Project Registration");
    expect(sci2027Content.registration.studentResearch.description.en).toBe("For undergraduate and postgraduate students presenting student research, thesis work, or graduation projects.");
    expect(sci2027Content.registration.studentResearch.notice.en).toBe("Submission deadline and abstract requirements will be announced.");
  });

  it("uses hosted public URLs for oversized images and retains the remaining approved assets locally", () => {
    for (const key of hostedAssetKeys) {
      const assetPath = sci2027Content.assets[key];

      expect(assetPath).toMatch(/^https:\/\//);
      expect(existsSync(projectPath("client/public", assetPath.slice(1)))).toBe(false);
    }

    for (const key of localAssetKeys) {
      const assetPath = sci2027Content.assets[key];

      expect(existsSync(projectPath("client/public", assetPath.slice(1)))).toBe(true);
    }
  });

  it("provides a dedicated SCI 2027 home page", () => {
    expect(existsSync(projectPath("client/src/pages/Sci2027Home.tsx"))).toBe(true);
  });

  it("renders the current SCI 2027 public experience in English only", () => {
    for (const file of englishOnlyPublicFiles) {
      const source = readFileSync(projectPath(file), "utf8");

      expect(source).not.toMatch(/[\u0600-\u06FF]/u);
      expect(source).not.toContain('dir="rtl"');
      expect(source).not.toContain("brochureArabic");
    }
  });

  it("renders the student research form as a third responsive registration option", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");

    expect(homeSource).toContain("sci2027Content.registration.studentResearch");
    expect(homeSource).toContain("lg:grid-cols-3");
    expect(homeSource).toContain("option.notice.en");
  });

  it("uses the SCI 2027 page for the public root route", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Home.tsx"), "utf8");

    expect(homeSource).toContain("Sci2027Home");
  });

  it("defines the SCI 2027 visual system and browser metadata", () => {
    const stylesheet = readFileSync(projectPath("client/src/index.css"), "utf8");
    const html = readFileSync(projectPath("client/index.html"), "utf8");

    expect(stylesheet).toContain(".sci-network");
    expect(stylesheet).toContain(".sci-eyebrow");
    expect(html).toContain("SCI 2027");
  });

  it("provides programme and archive routes for the two conference editions", () => {
    const appSource = readFileSync(projectPath("client/src/App.tsx"), "utf8");

    expect(existsSync(projectPath("client/src/pages/Sci2027Programme.tsx"))).toBe(true);
    expect(existsSync(projectPath("client/src/pages/Sci2026Archive.tsx"))).toBe(true);
    expect(appSource).toContain('path={"/programme"}');
    expect(appSource).toContain('path={"/archive-2026"}');
    expect(appSource).toContain('path={"/schedule"} component={Sci2027Programme}');
  });
});
