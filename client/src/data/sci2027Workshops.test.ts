import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sci2027Content } from "./sci2027Content";

const path = (file: string) => fileURLToPath(new URL(`../../../${file}`, import.meta.url));
const source = (file: string) => existsSync(path(file)) ? readFileSync(path(file), "utf8") : "";

const title = "Patents: when is your research protectable, and how to prepare and file";
const provider = "Cairo University Intellectual Property Protection Office";

describe("SCI 2027 Workshops", () => {
  it("adds a standalone Workshops route and shared tab directly after Programme", () => {
    const app = source("client/src/App.tsx");
    const header = source("client/src/components/Sci2027Header.tsx");
    expect(app).toContain('import Sci2027Workshops from "./pages/Sci2027Workshops";');
    expect(app).toContain('<Route path={"/workshops"} component={Sci2027Workshops} />');
    expect(header).toMatch(/\{ href: "\/programme", label: "Programme" \},\s*\{ href: "\/workshops", label: "Workshops" \}/);
    expect((header.match(/navigation\.map/g) ?? [])).toHaveLength(2);
  });

  it("publishes only the confirmed half-day patent workshop and leaves scheduling and registration unconfirmed", () => {
    const workshops = Reflect.get(sci2027Content, "workshops");
    expect(workshops).toBeDefined();
    expect(workshops.title).toBe("Workshops");
    expect(workshops.additionalStatus).toBe("To be announced");
    expect(workshops.items).toHaveLength(1);
    const workshop = workshops.items[0];
    expect(workshop.id).toBe("patents");
    expect(workshop.title).toBe(title);
    expect(workshop.provider).toBe(provider);
    expect(workshop.format).toBe("Half-day hands-on workshop");
    expect(workshop.capacity).toBe(30);
    expect(workshop.fee).toBe("EGP 200");
    expect(workshop.dateAndTime).toBe("To be announced");
    expect(workshop.venue).toBe("To be announced");
    expect(workshop.registration).toEqual({ status: "Coming soon", url: null });
    expect(workshop).not.toHaveProperty("scheduleNote");
    expect(workshop).not.toHaveProperty("announcement");
    expect(workshop).not.toHaveProperty("speakers");
    expect(workshop).not.toHaveProperty("paymentUrl");
  });

  it("retains the complete hosted office logo with English alt text", () => {
    const workshops = Reflect.get(sci2027Content, "workshops");
    expect(workshops).toBeDefined();
    for (const image of [workshops.items[0].logo]) {
      expect(image.url).toMatch(/^https:\/\/files\.manuscdn\.com\/.+\.webp$/);
      expect(image.alt).toContain(provider);
      expect(image.alt).not.toMatch(/[\u0600-\u06FF]/u);
      expect(image.source).toBe("User-supplied official artwork");
      expect(image.width).toBeGreaterThan(1000);
      expect(image.height).toBeGreaterThan(1000);
    }
  });

  it("renders English workshop details without invented date, fake registration button or image cropping", () => {
    const page = source("client/src/pages/Sci2027Workshops.tsx");
    expect(page).not.toBe("");
    expect(page).toContain('lang="en"');
    expect(page).toContain("<Sci2027Header />");
    expect(page).toContain("<Sci2027Footer />");
    expect(page).toContain("workshops.items.map");
    expect(page).toContain("{workshop.title}");
    expect(page).toContain("{workshop.provider}");
    expect(page).toContain("{workshop.format}");
    expect(page).toContain("{workshop.capacity} seats only");
    expect(page).toContain("{workshop.fee}");
    expect(page).toContain("{workshop.dateAndTime}");
    expect(page).toContain("{workshop.venue}");
    expect(page).toContain("{workshop.registration.status}");
    expect(page).toContain("{workshop.logo.url}");
    expect(page).toContain('className="block h-auto w-full object-contain"');
    expect(page).not.toContain("object-cover");
    expect(page).not.toContain("<form");
    expect(page).not.toContain("<button");
    expect(page).not.toContain('href="#"');
    expect(page).not.toContain("href={workshop.registration.url}");
    expect(page).not.toMatch(/[\u0600-\u06FF]/u);
  });

  it("removes the partnership poster, caption and date note without leaving an empty poster column", () => {
    const page = source("client/src/pages/Sci2027Workshops.tsx");
    expect(page).not.toContain("workshop.announcement");
    expect(page).not.toContain("workshop.scheduleNote");
    expect(page).not.toContain("<figure");
    expect(page).not.toContain("<figcaption");
    expect(page).not.toContain("Official partnership announcement");
    expect(page).not.toContain("xl:grid-cols-[1.15fr_0.85fr]");
    expect(page).toContain('className="p-6 sm:p-8"');
  });

  it("links from footer and programme pages while preserving conference dates, existing registration fees and routes", () => {
    for (const file of ["client/src/components/Sci2027Footer.tsx", "client/src/pages/Sci2027Programme.tsx", "client/src/pages/Sci2027ProgrammeWorkshops.tsx"]) {
      expect(source(file)).toContain('href="/workshops"');
    }
    expect(sci2027Content.workshopProgramme.preConference.date).toBe("6 April 2027");
    expect(sci2027Content.workshopProgramme.culturalVisit.date).toBe("9 April 2027");
    expect(sci2027Content.workshopProgramme.postConference.date).toBe("10 April 2027");
    expect(source("client/src/App.tsx")).toContain('<Route path={"/programme-workshops"} component={Sci2027ProgrammeWorkshops} />');
    expect(source("client/src/App.tsx")).toContain('<Route path={"/programme"} component={Sci2027Programme} />');
    expect(JSON.stringify(sci2027Content.registrationFees)).not.toContain("EGP 200");
  });
});
