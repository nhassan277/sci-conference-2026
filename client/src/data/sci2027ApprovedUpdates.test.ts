import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sci2027Content } from "./sci2027Content";

const recipients = "cou@sci.cu.edu.eg,sci2027@sci.cu.edu.eg";
const remainingNames = [
  "Prof. Walid Rahouma", "Prof. Mohamed Qarny", "Mrs. Manar Mohamed",
  "Dr. Nahla Osama", "Assoc. Prof. Rania Ali", "Dr. Nourhan Hassan",
  "Prof. Azza Shoukry", "Dr. Dina Amr",
];

describe("11 November confirmed committee, days and email corrections", () => {
  it("removes only Hoda's active card and keeps the other eight members in their approved order", () => {
    const unit = sci2027Content.conferenceOrganizationUnit;
    expect(unit.members.map(member => member.name)).toEqual(remainingNames);
    expect(unit.leaders.map(leader => leader.name)).toEqual(remainingNames);
    expect(unit.members.some(member => member.name === "Prof. Hoda Abu Shady")).toBe(false);
    expect(unit.leaders.some(leader => leader.name === "Prof. Hoda Abu Shady")).toBe(false);
    expect(unit.members.find(member => member.name === "Prof. Azza Shoukry")).toMatchObject({
      department: "Chemistry", role: "Public Relations & Sponsorship Committee",
      summary: "Supports public relations, institutional outreach and sponsor engagement for the Unit’s scientific conferences and events.",
    });
    expect(unit.leaders.every(leader => leader.photo.startsWith("https://files.manuscdn.com/"))).toBe(true);
    expect(unit.leaders.find(leader => leader.name === "Dr. Nourhan Hassan")?.assistants).toEqual([
      "Youssef Saher Sayed (4th year student)", "Ziad Ahmed (4th year student)",
    ]);
  });

  it("counts four conference/workshop days without relabelling the museum visit or moving any dates", () => {
    expect(sci2027Content.impact.at(-1)).toEqual({
      value: "4", label: { en: "Conference & Workshop Days", ar: "أيام المؤتمر والورش" },
    });
    expect(sci2027Content.identity.dates.en).toBe("7–8 April 2027");
    expect(sci2027Content.workshopProgramme.preConference.date).toBe("6 April 2027");
    expect(sci2027Content.workshopProgramme.postConference.date).toBe("10 April 2027");
    expect(sci2027Content.workshopProgramme.culturalVisit.date).toBe("9 April 2027");
    expect(sci2027Content.programme.map(day => day.date)).toEqual([
      "6 April 2027", "7 April 2027", "8 April 2027", "9 April 2027", "10 April 2027",
    ]);
  });

  it("replaces every central public Gmail destination with both approved institutional mailboxes", () => {
    expect(sci2027Content.contact.officialEmails).toEqual(["cou@sci.cu.edu.eg", "sci2027@sci.cu.edu.eg"]);
    expect(sci2027Content.contact.email).toBe(recipients);
    expect(sci2027Content.sponsorship.contactEmail).toBe(recipients);
    expect(sci2027Content.registrationFees.payment.confirmationEmail).toBe(recipients);
    expect(JSON.stringify(sci2027Content)).not.toContain("sci.conf.2027@gmail.com");
  });

  it("shows the two institutional addresses once each in the footer with shared two-recipient routing", () => {
    const footer = readFileSync(resolve(process.cwd(), "client/src/components/Sci2027Footer.tsx"), "utf8");
    expect(footer).toContain("contact.officialEmails.map");
    expect(footer).toContain("mailto:${contact.email}");
    expect(footer).toContain(">{officialEmail}</a>");
    expect(footer).not.toContain(">{contact.email}</a>");
    expect(footer).not.toContain("mailto:${officialEmail}");
  });
});
