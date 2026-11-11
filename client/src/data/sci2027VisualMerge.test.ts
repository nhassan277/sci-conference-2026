import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sci2027Content } from "./sci2027Content";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const emails = ["cou@sci.cu.edu.eg", "sci2027@sci.cu.edu.eg"] as const;
const recipients = emails.join(",");

describe("approved Lovable presentation merge", () => {
  it("uses the approved committee name without losing existing member responsibilities", () => {
    const unit = sci2027Content.conferenceOrganizationUnit;
    expect(unit.title).toBe("Local Organizing Committee");
    expect(unit.members).toHaveLength(8);
    expect(unit.members.find(member => member.name === "Prof. Hoda Abu Shady")).toBeUndefined();
    expect(unit.members.find(member => member.name === "Prof. Azza Shoukry")).toMatchObject({ department: "Chemistry", role: "Public Relations & Sponsorship Committee" });
    expect(unit.members.find(member => member.name === "Assoc. Prof. Rania Ali")?.role).toBe("Media & Marketing Lead");
    expect(unit.members.find(member => member.name === "Mrs. Manar Mohamed")?.role).toBe("Administrative & Media Officer");
  });

  it("adds the approved Conference Chair after the existing three patronage cards", () => {
    expect(sci2027Content.patronage.map(patron => patron.name)).toEqual([
      "Prof. Mohamed Sami Abdel-Sadek", "Prof. Sohair Ramadan Fahmy", "Prof. Amal Soliman", "Prof. Walid Rahouma",
    ]);
    expect(sci2027Content.patronage.at(-1)?.role).toBe("Conference Chair & Director of the Conference Organizing Unit");
    expect(sci2027Content.conferenceOrganizationUnit.members[0].role).toBe("Conference Chair & Director of the Conference Organizing Unit");
  });

  it("retains eight portrait-ready committee entries and the approved student assistants", () => {
    const leaders = (sci2027Content.conferenceOrganizationUnit as typeof sci2027Content.conferenceOrganizationUnit & {
      leaders?: ReadonlyArray<{ name: string; role: string; photo: string; assistants: readonly string[] }>;
    }).leaders ?? [];
    expect(leaders).toHaveLength(8);
    expect(leaders.map(leader => leader.name)).toEqual(sci2027Content.conferenceOrganizationUnit.members.map(member => member.name));
    expect(leaders.find(leader => leader.name === "Dr. Nourhan Hassan")?.assistants).toEqual([
      "Youssef Saher Sayed (4th year student)", "Ziad Ahmed (4th year student)",
    ]);
    expect(leaders.find(leader => leader.name === "Prof. Hoda Abu Shady")).toBeUndefined();
    for (const leader of leaders.filter(leader => leader.photo)) {
      expect(leader.photo).toMatch(/^(https:\/\/|\/manus-storage\/)/);
      expect(leader.photo).not.toContain("__l5e");
      expect(leader.photo).not.toContain("__lovable_token");
    }
    expect(leaders.filter(leader => leader.photo)).toHaveLength(8);
  });

  it("updates participation to 250 but retains the two actual workshop days", () => {
    expect(sci2027Content.impact.map(item => item.value)).toEqual(["250", "6", "6", "4"]);
    expect(sci2027Content.impact.at(-1)?.label).toEqual({ en: "Conference & Workshop Days", ar: "أيام المؤتمر والورش" });
    expect(sci2027Content.workshopProgramme.preConference.date).toContain("6 April 2027");
    expect(sci2027Content.workshopProgramme.postConference.date).toContain("10 April 2027");
    expect(sci2027Content.workshopProgramme.culturalVisit.date).toContain("9 April 2027");
  });

  it("displays the additional official emails without changing the payment or submission inbox", () => {
    const contact = sci2027Content.contact as typeof sci2027Content.contact & { officialEmails?: readonly string[] };
    expect(contact.officialEmails).toEqual(emails);
    expect(contact.email).toBe(recipients);
    expect(sci2027Content.sponsorship.contactEmail).toBe(recipients);
    expect(sci2027Content.registrationFees.payment.confirmationEmail).toBe(recipients);
    const footerSource = source("client/src/components/Sci2027Footer.tsx");
    expect(footerSource).toContain("contact.officialEmails.map");
    // The two addresses render from one mapped JSX template, without an extra contact row.
    expect((footerSource.match(/href=\{`mailto:\$\{contact\.email\}`\}/g) ?? [])).toHaveLength(1);
    expect(footerSource).not.toMatch(/href=\{`mailto:\$\{officialEmail\}`\}/u);
  });

  it("registers the new details pages while retaining all existing programme and registration routes", () => {
    const app = source("client/src/App.tsx");
    for (const route of ["/venue", "/gala-dinner", "/programme-workshops", "/programme", "/schedule", "/media-registration-2027", "/sponsor-registration-2027", "/admin", "/archive-2026"]) {
      expect(app).toContain(`path={"${route}"}`);
    }
    for (const name of ["Sci2027Venue", "Sci2027GalaDinner", "Sci2027ProgrammeWorkshops"]) {
      expect(existsSync(resolve(process.cwd(), `client/src/pages/${name}.tsx`))).toBe(true);
    }
  });

  it("uses the compact Lovable homepage with real targets for details and about navigation", () => {
    const home = source("client/src/pages/Sci2027Home.tsx");
    expect(home).toContain('href="/venue"');
    expect(home).toContain('href="/gala-dinner"');
    expect(home).toContain('href="/programme-workshops"');
    expect(home).toContain('id="about"');
    expect(home).not.toContain('id="venue"');
    expect(home).not.toContain('id="gala-dinner"');
    expect(home).not.toContain('href="/media-registration-2027"');
    expect(source("client/src/pages/Sci2027Sponsorship.tsx")).toContain('href="/media-registration-2027"');
    expect(home).toContain('href="#registration-fees"');
  });

  it("uses the streamlined sponsorship page with the request form intact and assistants in the committee page", () => {
    const sponsorship = source("client/src/pages/Sci2027Sponsorship.tsx");
    const committee = source("client/src/pages/Sci2027OrganizationUnit.tsx");
    expect(sponsorship).toContain('href="/sponsor-registration-2027"');
    expect(sponsorship).not.toContain("sponsorship.studentSponsorshipAssistants.members.map");
    expect(sponsorship).not.toContain("sponsorship.sponsorshipCommittee.members.map");
    expect(committee).toContain("Student Sponsorship Assistants");
  });

  it("retains official forms and fees during the visual merge", () => {
    expect(sci2027Content.registration.general.url).toBe("https://forms.gle/mr2gE9nsbdPrha9r6");
    expect(sci2027Content.registration.speaker.url).toBe("https://forms.gle/FRiza6zpfiQLrgrh8");
    expect(sci2027Content.registration.studentResearch.url).toBe("https://forms.gle/fmXUzEQ85hbXnLFp8");
    expect(sci2027Content.identity.dates.en).toBe("7–8 April 2027");
    expect(source("client/src/components/Sci2027RequestForm.tsx")).toContain("sci2027Requests");
  });
});
