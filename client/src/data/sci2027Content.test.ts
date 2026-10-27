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
  "client/src/pages/Sci2027Sponsorship.tsx",
  "client/src/pages/Sci2027Videos.tsx",
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

  it("provides the approved sponsorship tiers, visibility data and email-only prospectus contact", () => {
    expect(sci2027Content.sponsorship.contactEmail).toBe("sci.conf.2027@gmail.com");
    expect(sci2027Content.sponsorship.ctaLabel).toBe("Request the Sponsorship Prospectus by Email");
    expect(sci2027Content.sponsorship.packages).toHaveLength(4);
    expect(sci2027Content.sponsorship.packages.map((tier) => tier.investment)).toEqual([
      "EGP 500,000",
      "EGP 300,000",
      "EGP 175,000",
      "EGP 100,000",
    ]);
    expect(sci2027Content.sponsorship.credibility[0].label).toBe("archival registrations recorded");
    expect(sci2027Content.sponsorship.credibility[0].note).toContain("not confirmed attendance");
    expect(sci2027Content.sponsorship.benefitMatrix).toHaveLength(13);
    expect(sci2027Content.sponsorship.specialOpportunities).toHaveLength(10);
  });

  it("uses the approved SCI 2027 inbox for all public conference enquiries", () => {
    expect(sci2027Content.contact.email).toBe("sci.conf.2027@gmail.com");
    expect(sci2027Content.contact.email).toBe(sci2027Content.sponsorship.contactEmail);
  });

  it("provides four hosted SCI 2027 promotional videos with poster frames and verified gallery details", () => {
    expect(sci2027Content.videos).toHaveLength(4);
    expect(sci2027Content.videos.every((video) => video.url.startsWith("https://"))).toBe(true);
    expect(sci2027Content.videos.every((video) => video.posterUrl.startsWith("https://"))).toBe(true);
    expect(sci2027Content.videos.map((video) => video.title)).toEqual([
      "Experience SCI 2027: Discover, Create, Connect",
      "SCI 2027: Science at the Core of Innovation",
      "Looking Ahead to SCI 2027: Building on Innovation",
      "SCI 2027: Save the Date & Conference Overview",
    ]);
    expect(sci2027Content.videos.find((video) => video.language === "Arabic voice-over")?.duration).toBe("45 seconds");
    expect(sci2027Content.videos.find((video) => video.aspect === "portrait")?.duration).toBe("29 seconds");
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

  it("provides an English-only sponsorship page with a full benefits and opportunities offering", () => {
    const sponsorshipPage = projectPath("client/src/pages/Sci2027Sponsorship.tsx");
    const source = existsSync(sponsorshipPage) ? readFileSync(sponsorshipPage, "utf8") : "";

    expect(existsSync(sponsorshipPage)).toBe(true);
    expect(source).toContain("sponsorship.benefitMatrix");
    expect(source).toContain("sponsorship.specialOpportunities");
    expect(source).toContain("sponsorship.ctaLabel");
  });

  it("provides an English-only click-to-play SCI 2027 promotional-video gallery", () => {
    const videosPage = projectPath("client/src/pages/Sci2027Videos.tsx");
    const source = existsSync(videosPage) ? readFileSync(videosPage, "utf8") : "";

    expect(existsSync(videosPage)).toBe(true);
    expect(source).toContain("sci2027Content.videos");
    expect(source).toContain("playsInline");
    expect(source).toContain("controls");
    expect(source).not.toContain("autoPlay");
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

  it("links the homepage and shared navigation to the SCI 2027 sponsorship offering", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const headerSource = readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8");
    const footerSource = readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8");

    expect(homeSource).toContain('href="/sponsorship"');
    expect(headerSource).toContain('label: "Sponsorship"');
    expect(footerSource).toContain('href="/sponsorship"');
  });

  it("links the homepage and shared navigation to the SCI 2027 promotional-video gallery", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const headerSource = readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8");
    const footerSource = readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8");

    expect(homeSource).toContain('href="/videos"');
    expect(homeSource).toContain("featuredVideo");
    expect(headerSource).toContain('label: "Videos"');
    expect(footerSource).toContain('href="/videos"');
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
    expect(appSource).toContain('path={"/sponsorship"} component={Sci2027Sponsorship}');
    expect(appSource).toContain('path={"/sponsor"} component={Sci2027Sponsorship}');
    expect(appSource).toContain('path={"/sponsors"} component={Sci2027Sponsorship}');
    expect(appSource).toContain('path={"/videos"} component={Sci2027Videos}');
  });
});
