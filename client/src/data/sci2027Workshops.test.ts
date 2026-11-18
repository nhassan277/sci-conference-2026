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

  it("retains the confirmed patent details, unconfirmed schedule and matching registration form", () => {
    const workshops = Reflect.get(sci2027Content, "workshops");
    expect(workshops).toBeDefined();
    expect(workshops.title).toBe("Workshops");
    expect(workshops.additionalStatus).toBe("To be announced");
    expect(workshops.items).toHaveLength(2);
    const workshop = workshops.items[0];
    expect(workshop.id).toBe("patents");
    expect(workshop.title).toBe(title);
    expect(workshop.provider).toBe(provider);
    expect(workshop.format).toBe("Half-day hands-on workshop");
    expect(workshop.capacity).toBe(30);
    expect(workshop.fee).toBe("EGP 200");
    expect(workshop.dateAndTime).toBe("To be announced");
    expect(workshop.venue).toBe("Abn Sina Hall, Faculty of Science, Cairo University");
    expect(workshop.registration).toEqual({ status: "Registration available", url: "https://forms.gle/FQRgvzyVvRjpdsiLA" });
    expect(workshop).not.toHaveProperty("scheduleNote");
    expect(workshop).not.toHaveProperty("announcement");
    expect(workshop).not.toHaveProperty("speakers");
    expect(workshop).not.toHaveProperty("paymentUrl");
  });

  it("adds the NARSS remote sensing workshop with confirmed participation certificate and no invented details", () => {
    const workshop = Reflect.get(sci2027Content, "workshops").items[1];
    expect(workshop).toBeDefined();
    expect(workshop).toMatchObject({
      id: "remote-sensing",
      title: "Remote Sensing Applications: From Space Science to Geological and Petroleum Exploration",
      provider: "National Authority for Remote Sensing and Space Sciences (NARSS)",
      format: "Half-day hands-on workshop",
      duration: "Half-day",
      capacity: null,
      fee: "EGP 200",
      dateAndTime: "To be announced",
      venue: "Abn Sina Hall, Faculty of Science, Cairo University",
      certificate: "Certificate of participation",
      registration: { status: "Registration available", url: "https://forms.gle/7fhDR3QCDLqEpVi59" },
    });
    expect(workshop.logo).toMatchObject({
      alt: "Logo of the National Authority for Remote Sensing and Space Sciences (NARSS)",
      width: 400,
      height: 393,
      source: "User-supplied official artwork",
    });
    expect(workshop.logo.url).toMatch(/^https:\/\/files\.manuscdn\.com\/.+\.webp$/);
    expect(workshop).not.toHaveProperty("speakers");
    expect(workshop).not.toHaveProperty("announcement");
    expect(workshop).not.toHaveProperty("paymentUrl");
  });

  it("shows the organizer-confirmed format, fee and hall for both workshops without assigning dates", () => {
    expect(sci2027Content.workshops.items.map(workshop => ({
      id: workshop.id,
      format: workshop.format,
      fee: workshop.fee,
      venue: workshop.venue,
      dateAndTime: workshop.dateAndTime,
    }))).toEqual(["patents", "remote-sensing"].map(id => ({
      id,
      format: "Half-day hands-on workshop",
      fee: "EGP 200",
      venue: "Abn Sina Hall, Faculty of Science, Cairo University",
      dateAndTime: "To be announced",
    })));
  });

  it("renders unknown seat counts safely while displaying the NARSS duration and certificate", () => {
    const page = source("client/src/pages/Sci2027Workshops.tsx");
    expect(page).toContain('typeof workshop.capacity === "number"');
    expect(page).toContain('"duration" in workshop');
    expect(page).toContain("{workshop.duration}");
    expect(page).toContain('"certificate" in workshop');
    expect(page).toContain("{workshop.certificate}");
    expect(page).toContain("space-y-10");
    expect(page).not.toContain("Logo coming soon");
  });

  it("uses body-text sizing for unannounced fees without changing confirmed price typography", () => {
    const page = source("client/src/pages/Sci2027Workshops.tsx");
    expect(page).toContain('String(workshop.fee) === "To be announced"');
    expect(page).toContain('? "mt-4 text-sm font-bold leading-6 text-[#063760]"');
    expect(page).toContain(': "mt-4 font-serif text-3xl font-bold text-[#063760]"');
  });

  it("renders real external form buttons with safe new-tab behavior and a no-URL fallback", () => {
    const page = source("client/src/pages/Sci2027Workshops.tsx");
    expect(page).toContain("workshop.registration.url ? (");
    expect(page).toContain("href={workshop.registration.url}");
    expect(page).toContain('target="_blank"');
    expect(page).toContain('rel="noopener noreferrer"');
    expect(page).toContain("Register for this workshop");
    expect(page).toContain("Register for ${workshop.title} (opens in a new tab)");
    expect(page).toContain("focus-visible:outline");
    expect(page).toContain("Google sign-in may be required.");
    expect(page).toContain("The Google Form link will be added here once available.");
  });

  it("retains the complete hosted office logo with English alt text", () => {
    const workshops = Reflect.get(sci2027Content, "workshops");
    expect(workshops).toBeDefined();
    for (const image of [workshops.items[0].logo]) {
      expect(image.url).toMatch(/^https:\/\/files\.manuscdn\.com\/.+\.(?:webp|png)$/);
      expect(image.alt).toContain(provider);
      expect(image.alt).not.toMatch(/[\u0600-\u06FF]/u);
      expect(image.source).toBe("User-supplied official artwork");
      expect(image.width).toBeGreaterThan(1000);
      expect(image.height).toBeGreaterThan(1000);
    }
  });

  it("uses the natural circular logo derivative instead of the white rectangular original", () => {
    const logo = sci2027Content.workshops.items[0].logo;
    expect(logo.url).not.toContain("GbFKanVwgQGkWSYc.webp");
    expect(logo.width).toBe(logo.height);
    expect(source("client/src/pages/Sci2027Workshops.tsx")).not.toContain("clip-path");
    expect(source("client/src/pages/Sci2027Workshops.tsx")).not.toContain("object-cover");
  });

  it("renders English workshop details without invented dates, internal forms or image cropping", () => {
    const page = source("client/src/pages/Sci2027Workshops.tsx");
    expect(page).not.toBe("");
    expect(page).toContain('lang="en"');
    expect(page).toContain("<Sci2027Header />");
    expect(page).toContain("<Sci2027Footer />");
    expect(page).toContain("workshops.items.map");
    expect(page).toContain("{workshop.title}");
    expect(page).toContain("{workshop.provider}");
    expect(page).toContain("{workshop.format}");
    expect(page).toContain("`${workshop.capacity} seats only`");
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
    expect(page).toContain("href={workshop.registration.url}");
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
