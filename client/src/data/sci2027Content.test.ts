import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sci2027Content } from "./sci2027Content";

const projectPath = (...segments: string[]) => resolve(process.cwd(), ...segments);

const hostedAssetKeys = [
  "detailedPoster",
  "simplePoster",
  "sci2027Logo",
] as const;

const localAssetKeys = [
  "cairoUniversityLogo",
  "conferenceUnitLogo",
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

  it("provides ten balanced specialties for every track and renders the full lists directly", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");

    expect(sci2027Content.tracks.every((track) => track.topics.length === 10)).toBe(true);
    expect(sci2027Content.tracks[0].topics).toContain("Synthetic biology and biodesign");
    expect(sci2027Content.tracks[1].topics).toContain("Circular economy and resource recovery");
    expect(sci2027Content.tracks[2].topics).toContain("Chemical sensors, spectroscopy and surface science");
    expect(sci2027Content.tracks[3].topics).toContain("Quantum science and technology");
    expect(sci2027Content.tracks[4].topics).toContain("Robotics, automation and intelligent systems");
    expect(sci2027Content.tracks[5].topics).toContain("Research commercialization and startup development");
    expect(homeSource).toContain("Specialties");
    expect(homeSource).toContain("track.topics.map((topic)");
    expect(homeSource).not.toContain("track.topics.slice(0, 3)");
  });

  it("uses real licensed photography for every track, the Unit and partnerships without sacrificing text-safe rendering", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const sponsorshipSource = readFileSync(projectPath("client/src/pages/Sci2027Sponsorship.tsx"), "utf8");
    const visuals = [
      ...sci2027Content.tracks.map((track) => track.visual),
      sci2027Content.conferenceOrganizationUnit.visual,
      sci2027Content.sponsorship.visual,
    ].filter(Boolean);

    expect(visuals).toHaveLength(8);
    expect(visuals.every((visual) => visual.url.startsWith("https://"))).toBe(true);
    expect(visuals.every((visual) => visual.alt.length > 20)).toBe(true);
    expect(visuals.every((visual) => visual.source === "Unsplash")).toBe(true);
    expect(visuals.every((visual) => visual.licenseUrl === "https://unsplash.com/license")).toBe(true);
    expect(homeSource).toContain("track.visual.url");
    expect(homeSource).toContain("track.visual.alt");
    expect(homeSource).toContain("conferenceOrganizationUnit.visual.url");
    expect(homeSource).toContain("sponsorship.visual.url");
    expect(homeSource).toContain("object-cover");
    expect(sponsorshipSource).toContain("sponsorship.visual.url");
    expect(sponsorshipSource).toContain("bg-[#062f52]/");
  });

  it("includes the approved student research, thesis and graduation-project registration form", () => {
    expect(sci2027Content.registration.studentResearch.url).toBe("https://forms.gle/fmXUzEQ85hbXnLFp8");
    expect(sci2027Content.registration.studentResearch.name.en).toBe("Student Research, Thesis & Graduation Project Registration");
    expect(sci2027Content.registration.studentResearch.description.en).toBe("For undergraduate and postgraduate students presenting student research, thesis work, or graduation projects.");
    expect(sci2027Content.registration.studentResearch.notice.en).toBe("Submission deadline and abstract requirements will be announced.");
  });

  it("sets 6 and 9 April aside for workshops without publishing workshop topics yet", () => {
    const publicProgrammeSources = [
      "client/src/data/sci2027Content.ts",
      "client/src/pages/Sci2027Home.tsx",
      "client/src/pages/Sci2027Programme.tsx",
    ].map((file) => readFileSync(projectPath(file), "utf8"));

    expect(sci2027Content.programme.map((day) => day.date)).toEqual([
      "6 April 2027",
      "7 April 2027",
      "8 April 2027",
      "9 April 2027",
    ]);
    expect(sci2027Content.workshopProgramme.preConference.date).toBe("6 April 2027");
    expect(sci2027Content.workshopProgramme.postConference.date).toBe("9 April 2027");
    expect(sci2027Content.workshopProgramme.status).toContain("to be announced");
    expect(sci2027Content.workshopProgramme.postConference.optionalActivity).toContain("Grand Egyptian Museum");

    for (const source of publicProgrammeSources) {
      expect(source).not.toContain("Next-Generation Sequencing data analysis and bioinformatics");
      expect(source).not.toContain("Machine learning for researchers in science");
      expect(source).not.toContain("GIS and remote sensing for environmental monitoring");
    }
  });

  it("announces keynote and invited speakers without publishing unconfirmed details", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const programmeSource = readFileSync(projectPath("client/src/pages/Sci2027Programme.tsx"), "utf8");

    expect(sci2027Content.speakers.status).toBe("Keynote and invited speakers will be announced soon.");
    expect(sci2027Content.speakers.groups.map((group) => group.title)).toEqual([
      "Keynote Speakers",
      "Invited Speakers",
    ]);
    expect(sci2027Content.speakers.groups.every((group) => group.status === "To be announced")).toBe(true);
    expect(sci2027Content.impact.some((item) => item.label.en.includes("keynote"))).toBe(false);
    expect(homeSource).toContain("speakers.groups");
    expect(programmeSource).toContain("speakers.groups");

    for (const source of [homeSource, programmeSource]) {
      expect(source).not.toContain("two international keynote speakers");
      expect(source).not.toContain("Invited-speaker lectures in six parallel halls");
    }
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

  it("renders consistent professional portraits for both Distinguished Patronage cards", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const portraits = sci2027Content.patronage.map((patron) => patron.photo).filter(Boolean);

    expect(sci2027Content.patronage).toHaveLength(2);
    expect(portraits).toHaveLength(2);
    expect(portraits.every((photo) => photo.url.startsWith("https://"))).toBe(true);
    expect(portraits.every((photo) => photo.alt.length > 20)).toBe(true);
    expect(sci2027Content.patronage.map((patron) => patron.name)).toEqual([
      "Prof. Mohamed Sami Abdel-Sadek",
      "Prof. Sohair Ramadan Fahmy",
    ]);
    expect(homeSource).toContain("patron.photo.url");
    expect(homeSource).toContain("patron.photo.alt");
    expect(homeSource).toContain("aspect-[4/5]");
    expect(homeSource).toContain("object-cover");
  });

  it("provides the official Conference Organization Unit description, objectives and external Faculty links", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unit = sci2027Content.conferenceOrganizationUnit;

    expect(unit.title).toBe("Conference Organization Unit");
    expect(unit.institution).toBe("Faculty of Science, Cairo University");
    expect(unit.description).toBe(
      "The Conference Organization Unit at the Faculty of Science, Cairo University supports the planning, coordination, and professional management of scientific conferences and events, fostering academic and research collaboration locally and internationally.",
    );
    expect(unit.objectives).toHaveLength(4);
    expect(unit.objectives.map((objective) => objective.title)).toEqual([
      "Organizational Excellence",
      "Scientific Excellence",
      "Partnerships and International Collaboration",
      "Sustainability and Development",
    ]);
    expect(unit.facultyUrl).toBe("https://scicu.net/");
    expect(unit.unitUrl).toBe("https://scicu.net/Important%20Links/conference-organization");
    expect("memberStatus" in unit).toBe(false);
    expect(homeSource).toContain("conferenceOrganizationUnit");
    expect(homeSource).toContain("Visit the Faculty of Science Website");
    expect(homeSource).toContain("Learn More About the Unit");
    expect(homeSource).toContain('target="_blank"');
    expect(homeSource).toContain('rel="noreferrer"');
    expect(homeSource).not.toContain("info@sci.cu.edu.eg");
    expect(homeSource).not.toContain("+20 2 3567 6000");
  });

  it("publishes the updated nine-member Conference Organization Unit roster without meeting-record or contact details", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unit = sci2027Content.conferenceOrganizationUnit;

    expect(unit.members).toHaveLength(9);
    expect(unit.members.map((member) => `${member.name} | ${member.role}`)).toEqual([
      "Prof. Walid Rahouma | Director of the Unit",
      "Prof. Mohamed Qarny | Secretary of the Unit",
      "Mrs. Manar Mohamed | Administrative Secretary to the Unit",
      "Dr. Nahla Osama | Scientific Programme Lead",
      "Prof. Rania Ali | Media & Marketing Lead",
      "Dr. Nourhan Hassan | Sponsorship, Funding & Conference Website Lead",
      "Prof. Rasha El-Nashar | Public Relations Lead",
      "Prof. Azza Shoukry | Registration & Operations Lead",
      "Dr. Dina Amr | Logistics Lead",
    ]);
    expect(unit.members).not.toContainEqual(expect.objectContaining({ name: "Prof. Heba Mohamed Fahmy" }));
    expect(unit.members.map((member) => member.name)).not.toEqual(expect.arrayContaining([
      "Prof. Walid Ali Rahouma",
      "Prof. Mohamed Qarny Ismail",
      "Dr. Nahla Osama Mohamed Moussa",
      "Prof. Rania Ali Hassan",
    ]));
    const azza = unit.members.find((member) => member.name === "Prof. Azza Shoukry");
    const dina = unit.members.find((member) => member.name === "Dr. Dina Amr");

    expect(azza).toMatchObject({ department: "Chemistry", role: "Registration & Operations Lead" });
    expect(azza?.summary).toMatch(/participant registration, reception and participant flow/u);
    expect(dina).toMatchObject({ department: "Biotechnology", role: "Logistics Lead" });
    expect(dina?.summary).toMatch(/venues, equipment, hospitality, accommodation, transport/u);
    expect(unit.members).toContainEqual(expect.objectContaining({ name: "Mrs. Manar Mohamed", department: "Conference Organization Unit" }));
    expect(unit.members.find((member) => member.name === "Dr. Nourhan Hassan")?.summary).toMatch(/website design, content, user experience and ongoing updates/u);
    expect(unit.members.every((member) => member.department.length > 0 && member.summary.length > 0)).toBe(true);
    expect(homeSource).toContain("Meet the Unit");
    expect(homeSource).toContain("conferenceOrganizationUnit.members.map");
    expect(homeSource).not.toContain("memberStatus");
    expect(homeSource).not.toMatch(/info@sci\.cu\.edu\.eg|\+20 2 3567 6000|13 September 2026/u);
    expect(homeSource).not.toContain("<img src={member");
  });

  it("gives the Unit Director the same single-column card width while retaining the navy and gold director treatment", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");

    expect(homeSource).toContain("mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3");
    expect(homeSource).toContain('index === 0 ? "border-[#063760] bg-[#063760] text-white"');
    expect(homeSource).toContain('index === 0 ? "text-[#f0ca57]"');
    expect(homeSource).not.toContain("md:col-span-2");
    expect(homeSource).not.toContain("xl:col-span-2");
  });

  it("uses the approved short display spelling for the Unit Director in the conference introduction and Unit roster", () => {
    const director = sci2027Content.conferenceOrganizationUnit.members[0];

    expect(director.name).toBe("Prof. Walid Rahouma");
    expect(sci2027Content.organizer.head.en).toBe("Unit Head: Prof. Walid Rahouma");
  });

  it("uses the approved circular Conference Organization Unit logo in a larger white rounded container", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unitLogo = sci2027Content.assets.conferenceUnitLogo;

    expect(unitLogo).toMatch(/^\/sci-2027\/logos\/conference-unit-logo\.[a-f0-9]{8}\.png$/);
    expect(existsSync(projectPath("client/public", unitLogo.slice(1)))).toBe(true);
    expect(homeSource).toContain("src={assets.conferenceUnitLogo}");
    expect(homeSource).toContain("h-20 w-20");
    expect(homeSource).toContain("rounded-[1.75rem]");
  });

  it("uses the user-approved SCI 2027 logo from managed hosting at its native aspect without circular treatment or cropping", () => {
    const logo = sci2027Content.assets.sci2027Logo;
    const logoSources = [
      { source: readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8"), reference: "sci2027Content.assets.sci2027Logo", size: "h-11" },
      { source: readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8"), reference: "assets.sci2027Logo", size: "h-24" },
      { source: readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8"), reference: "sci2027Content.assets.sci2027Logo", size: "h-20" },
    ];

    expect(logo).toMatch(/^https:\/\//);
    expect(existsSync(projectPath("client/public/sci-2027/logos/sci2027-logo.142ad3d1.png"))).toBe(false);

    for (const { source, reference, size } of logoSources) {
      const logoLine = source.split("\n").find((line) => line.includes(`src={${reference}}`)) ?? "";

      expect(logoLine).toContain(reference);
      expect(logoLine).toContain(size);
      expect(logoLine).toContain("w-auto");
      expect(logoLine).toContain("object-contain");
      expect(logoLine).not.toContain("rounded-full");
      expect(logoLine).not.toContain("bg-white");
      expect(logoLine).not.toContain("p-1");
      expect(logoLine).not.toContain("object-cover");
    }
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

  it("replaces public SCI 2026 certificate access with an interactive conference-moments archive gallery", () => {
    const archiveSource = readFileSync(projectPath("client/src/pages/Sci2026Archive.tsx"), "utf8");
    const appSource = readFileSync(projectPath("client/src/App.tsx"), "utf8");

    expect(sci2027Content.archive.description.en).not.toContain("certificate");
    expect("certificateUrl" in sci2027Content.archive).toBe(false);
    expect(archiveSource).toContain("SCI 2026 in Moments");
    expect(archiveSource).toContain("GALLERY_PHOTOS");
    expect(archiveSource).toContain("featuredGalleryIndices");
    expect(archiveSource).toContain("setSelectedPhoto");
    expect(archiveSource).toContain('href="/live-gallery"');
    expect(archiveSource).not.toContain("Certificate requests");
    expect(archiveSource).not.toContain("certificate-request");
    expect(appSource).not.toContain("CertificateRequest");
    expect(appSource).not.toContain('path={"/certificate-request"}');
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
