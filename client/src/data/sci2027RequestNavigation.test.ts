import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(fileURLToPath(new URL(`../../../${path}`, import.meta.url)), "utf8");

describe("SCI 2027 request entry points", () => {
  it("retains separate SCI 2027 request routes, legacy media and the three official homepage forms without a media card", () => {
    const app = source("client/src/App.tsx");
    expect(app).toContain('<Route path={"/media-registration-2027"} component={Sci2027MediaRegistration} />');
    expect(app).toContain('<Route path={"/sponsor-registration-2027"} component={Sci2027SponsorRegistration} />');
    expect(app).toContain('<Route path={"/media-registration"} component={MediaRegistration} />');
    const home = source("client/src/pages/Sci2027Home.tsx");
    const registration = home.slice(home.indexOf('<section id="registration"'), home.indexOf('<section className="py-14"'));
    expect(home).not.toContain('href="/media-registration-2027"');
    expect(home).not.toContain("Media Registration");
    expect(home).not.toContain("Press &amp; media");
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

  it("places the unchanged media invitation after the sponsor card in a responsive two-card registration area", () => {
    const sponsor = source("client/src/pages/Sci2027Sponsorship.tsx");
    const start = sponsor.indexOf('<div id="partner-media-registration"');
    expect(start).toBeGreaterThan(-1);
    const cards = sponsor.slice(start, sponsor.indexOf("</section>", start));
    expect(cards).toContain('className="mt-10 grid gap-5 md:grid-cols-2"');
    expect((cards.match(/<article/g) ?? [])).toHaveLength(2);
    expect(cards.indexOf("Sponsor &amp; Partner Registration")).toBeLessThan(cards.indexOf("Media Registration"));
    expect(cards).toContain("Press &amp; media");
    expect(cards).toContain("For media organisations and press professionals interested in covering SCI 2027. Requests are reviewed by the conference team.");
    expect(cards).toContain('href="/media-registration-2027"');
    expect(cards).toContain("Open media form");
    expect(cards).toContain('href="/sponsor-registration-2027"');
  });
});
