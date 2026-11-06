import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(fileURLToPath(new URL(`../../../${path}`, import.meta.url)), "utf8");

describe("SCI 2027 request entry points", () => {
  it("offers separate SCI 2027 request routes while retaining legacy media and the three official forms", () => {
    const app = source("client/src/App.tsx");
    expect(app).toContain('<Route path={"/media-registration-2027"} component={Sci2027MediaRegistration} />');
    expect(app).toContain('<Route path={"/sponsor-registration-2027"} component={Sci2027SponsorRegistration} />');
    expect(app).toContain('<Route path={"/media-registration"} component={MediaRegistration} />');
    const home = source("client/src/pages/Sci2027Home.tsx");
    const registration = home.slice(home.indexOf('<section id="registration"'), home.indexOf('<section className="py-14"'));
    expect(registration).toContain('href="/media-registration-2027"');
    expect(registration).toContain("Media Registration");
    expect(home).toContain("sci2027Content.registration.general,");
    expect(home).toContain("sci2027Content.registration.speaker,");
    expect(home).toContain("sci2027Content.registration.studentResearch,");
    expect(registration).toContain('href={option.url} target="_blank"');
  });

  it("links sponsor registration in the sponsorship hero and contact section without replacing the prospectus email", () => {
    const sponsor = source("client/src/pages/Sci2027Sponsorship.tsx");
    expect((sponsor.match(/href="\/sponsor-registration-2027"/g) ?? [])).toHaveLength(2);
    expect(sponsor).toContain("Sponsor &amp; Partner Registration");
    expect(sponsor).toContain("href={requestHref}");
    expect(sponsor).toContain("sponsorship.ctaLabel");
  });
});
