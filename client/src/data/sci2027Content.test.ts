import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sci2027Content } from "./sci2027Content";

const projectPath = (...segments: string[]) => resolve(process.cwd(), ...segments);

const hostedAssetKeys = [
  "detailedPoster",
  "simplePoster",
  "sci2027Logo",
  "brochureEnglish",
] as const;

const localAssetKeys = [
  "cairoUniversityLogo",
  "conferenceUnitLogo",
  "conferenceUnitMark",
  "sciMasterLogo",
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
  "client/src/pages/Sci2027OrganizationUnit.tsx",
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

  it("publishes the verified Conference Center venue with safe Google Maps directions", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const programmeSource = readFileSync(projectPath("client/src/pages/Sci2027Programme.tsx"), "utf8");
    const venue = sci2027Content.identity.location;

    expect(venue).toMatchObject({
      name: "Conference Center - Cairo University",
      shortAddress: "Beside Students City, Dr. Mikel Bakhoum Rd, Dokki, Giza",
      mapUrl: "https://share.google/pJzENeit3jQYXskJq",
      directionsLabel: "Get directions",
    });
    expect(venue.en).toContain("Conference Center - Cairo University");

    for (const source of [homeSource, programmeSource]) {
      expect(source).toContain("identity.location.name");
      expect(source).toContain("identity.location.mapUrl");
      expect(source).toContain('target="_blank"');
      expect(source).toContain('rel="noreferrer"');
    }
  });

  it("keeps the Venue & Halls content as one concise section above the eight-photo carousel after patronage", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const venue = sci2027Content.identity.location;
    const venueVisuals = (venue as typeof venue & {
      venueVisuals?: Array<{ source: string; caption: string; url: string; alt: string }>;
    }).venueVisuals ?? [];
    const patronagePosition = homeSource.indexOf("Distinguished patronage");
    const venuePosition = homeSource.indexOf('id="venue"');
    const introductionPosition = homeSource.indexOf("Science, partnership and impact");

    expect(venueVisuals).toHaveLength(2);
    expect(venueVisuals.every((visual) => visual.source === "SCI 2027 venue photograph")).toBe(true);
    expect(venueVisuals.every((visual) => visual.url.startsWith("https://") && visual.alt.length > 30)).toBe(true);
    expect(venueVisuals.map((visual) => visual.caption)).toEqual([
      "Main auditorium and meeting facilities at the Conference Center - Cairo University.",
      "Entrance, registration lobby, meeting room and auditorium facilities at the Conference Center - Cairo University.",
    ]);
    expect(venuePosition).toBeGreaterThan(patronagePosition);
    expect(venuePosition).toBeLessThan(introductionPosition);
    expect(homeSource).toContain("Venue &amp; Halls");
    expect(homeSource).toContain("Explore the Conference Center - Cairo University, from its main auditorium and supporting meeting facilities to its entrance, shared spaces, corridors and atrium.");
    expect(homeSource).toContain("identity.location.mapUrl");
    expect(homeSource).not.toContain("identity.location.venueVisuals.map");
    expect(homeSource).not.toContain("visual.caption");
    expect(homeSource).not.toContain("Explore the Venue");
    expect(homeSource).not.toContain("A closer look at the Conference Center.");
    expect(homeSource).not.toContain("A visual walk through the venue’s entrance, shared spaces, corridors and atrium.");
  });

  it("groups the eight supplied Conference Center photographs into two manual four-photo collage pages", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const venue = sci2027Content.identity.location;
    const venueGallery = (venue as typeof venue & {
      venueGallery?: Array<{ source: string; url: string; alt: string; caption?: string }>;
    }).venueGallery ?? [];
    const venueSectionStart = homeSource.indexOf('id="venue"');
    const venueSectionEnd = homeSource.indexOf("</section>", venueSectionStart);
    const gallerySection = homeSource.slice(venueSectionStart, venueSectionEnd);

    expect(venueGallery).toHaveLength(8);
    expect(venueGallery.every((photo) => photo.source === "SCI 2027 venue photograph")).toBe(true);
    expect(venueGallery.every((photo) => photo.url.startsWith("https://") && photo.alt.length > 30)).toBe(true);
    expect(venueGallery.every((photo) => !("caption" in photo))).toBe(true);
    expect(homeSource).toContain('import { useState } from "react";');
    expect(homeSource).toContain("identity.location.venueGallery.slice(0, 4)");
    expect(homeSource).toContain("identity.location.venueGallery.slice(4, 8)");
    expect(homeSource).toContain("const [venueGalleryPage, setVenueGalleryPage] = useState(0)");
    expect(gallerySection).toContain("venueGalleryPages[venueGalleryPage]");
    expect(gallerySection).toContain("grid-cols-2");
    expect(gallerySection).toContain("aspect-square");
    expect(gallerySection).toContain("object-cover");
    expect(gallerySection).toContain('aria-label="Previous venue photographs"');
    expect(gallerySection).toContain('aria-label="Next venue photographs"');
    expect(gallerySection).toContain('aria-label={`Show venue photo group ${pageIndex + 1}`}');
    expect(gallerySection).not.toContain("figcaption");
    expect(gallerySection).not.toContain("{photo.caption}");
    expect(gallerySection).not.toContain("setInterval");
  });

  it("ships a complete navy-and-gold SCI 2027 favicon and mobile icon package", () => {
    const indexSource = readFileSync(projectPath("client/index.html"), "utf8");
    const iconDirectory = projectPath("client/public/sci-2027/icons");
    const manifestPath = `${iconDirectory}/site.webmanifest`;
    const iconFiles = [
      "favicon.ico",
      "favicon-16.png",
      "favicon-32.png",
      "apple-touch-icon.png",
      "icon-192.png",
      "icon-512.png",
    ];

    for (const iconFile of iconFiles) {
      expect(existsSync(`${iconDirectory}/${iconFile}`)).toBe(true);
    }

    expect(existsSync(manifestPath)).toBe(true);
    const manifest = existsSync(manifestPath)
      ? JSON.parse(readFileSync(manifestPath, "utf8"))
      : null;
    expect(manifest).toMatchObject({
      name: "SCI 2027 | Science at the Core of Innovation",
      short_name: "SCI 2027",
      theme_color: "#062f52",
      background_color: "#062f52",
    });
    expect(manifest?.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ src: "/sci-2027/icons/icon-192.png", sizes: "192x192" }),
      expect.objectContaining({ src: "/sci-2027/icons/icon-512.png", sizes: "512x512" }),
    ]));
    expect(indexSource).toContain('/sci-2027/icons/favicon-32.png');
    expect(indexSource).toContain('/sci-2027/icons/apple-touch-icon.png');
    expect(indexSource).toContain('/sci-2027/icons/site.webmanifest');
    expect(indexSource).toContain('/sci-2027/icons/favicon.ico');
    expect(indexSource).toContain('name="theme-color" content="#062f52"');
  });

  it("uses the updated public Google Drive direct-download link for the English brochure while retaining Arabic", () => {
    const retiredEnglishBrochure = projectPath(
      "client/public/sci-2027/documents/SCI2027-Trifold-Brochure-EN.pdf",
    );
    const arabicBrochure = projectPath(
      "client/public",
      sci2027Content.assets.brochureArabic.slice(1),
    );
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const programmeSource = readFileSync(projectPath("client/src/pages/Sci2027Programme.tsx"), "utf8");
    const footerSource = readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8");

    expect(sci2027Content.assets.brochureEnglish).toBe("https://drive.google.com/uc?export=download&id=1XfDPdrLjCDbG44VOjhJBdjiuSjDSNpmv");
    expect(sci2027Content.assets.brochureEnglish).not.toContain("files.manuscdn.com");
    expect(sci2027Content.assets.brochureEnglish).not.toContain("1cw1EwBsOOfSzEHs9nIRPiOahzDZLVfp_");
    expect(existsSync(retiredEnglishBrochure)).toBe(false);
    expect(existsSync(arabicBrochure)).toBe(true);
    for (const source of [homeSource, programmeSource, footerSource]) {
      expect(source).toContain("brochureEnglish");
    }
  });

  it("links the official SCI 2027 YouTube channel from the footer and videos page in a new tab", () => {
    const footerSource = readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8");
    const videosSource = readFileSync(projectPath("client/src/pages/Sci2027Videos.tsx"), "utf8");

    if (!("youtube" in sci2027Content.contact)) {
      expect("youtube" in sci2027Content.contact).toBe(true);
      return;
    }

    expect(sci2027Content.contact.youtube).toEqual({
      url: "https://www.youtube.com/@SCI2027",
      label: "Follow SCI 2027 on YouTube",
      description: "Conference updates, highlights and official videos",
    });
    expect(footerSource).toContain("contact.youtube.url");
    expect(videosSource).toContain("contact.youtube.url");
    expect(footerSource).toContain("Youtube");
    expect(videosSource).toContain("Youtube");
    expect(footerSource).toContain('target="_blank"');
    expect(footerSource).toContain('rel="noreferrer"');
    expect(videosSource).toContain('target="_blank"');
    expect(videosSource).toContain('rel="noreferrer"');
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

  it("offers the approved Global Journal of Scientific Research publication opportunity after Scientific Tracks", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const publication = sci2027Content.publicationOpportunity;

    if (!publication) {
      expect(publication).toBeDefined();
      return;
    }

    expect(publication.title).toBe("Publication Opportunity");
    expect(publication.journalName).toBe("Global Journal of Scientific Research (GJSR)");
    expect(publication.url).toBe("https://gjsr.journals.ekb.eg");
    expect(publication.description).toBe("Researchers participating in SCI 2027 who are interested in publishing their research in the Global Journal of Scientific Research (GJSR) may explore the journal’s scope and submission information.");
    expect(publication.ctaLabel).toBe("Visit Global Journal of Scientific Research");
    expect(publication.notice).toBe("Publication is subject to the journal’s editorial and peer-review process.");
    const publicationCardPosition = homeSource.indexOf("publicationOpportunity.title");
    expect(publicationCardPosition).toBeGreaterThan(homeSource.indexOf("Scientific tracks"));
    expect(publicationCardPosition).toBeLessThan(homeSource.indexOf("Programme & workshops"));
    expect(homeSource).toContain('href={publicationOpportunity.url}');
    expect(homeSource).toContain('target="_blank"');
    expect(homeSource).toContain('rel="noreferrer"');
  });

  it("connects the combined conditional GJSR registration option bidirectionally with the publication opportunity", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const publication = sci2027Content.publicationOpportunity;
    const publicationOption = sci2027Content.registrationFees.publicationOption;

    expect(publication.feeCalloutLabel).toBe("Combined registration & publication option");
    expect(publication.paymentDetailsLinkLabel).toBe("View registration options & payment details");
    expect(publicationOption.title).toBe("Attendance + GJSR publication");
    expect(publicationOption.feeSummary).toBe("Postgraduate: EGP 750 · Prof. & Faculty / Researchers: EGP 2,000");
    expect(publicationOption.combinedWithAttendance).toBe(true);
    expect(publicationOption.payableAfterJournalAcceptance).toBe(true);
    expect(publicationOption.condition).toContain("accepted by GJSR");
    expect(homeSource).toContain('id="publication-opportunity"');
    expect(homeSource).toContain('id="registration-fees"');
    expect(homeSource).toContain('href="#publication-opportunity"');
    expect(homeSource).toContain('href="#registration-fees"');
    expect(homeSource).toContain("registrationFees.publicationOption.feeSummary");
    expect(homeSource).toContain("registrationFees.publicationOption.condition");
    expect(homeSource).not.toContain("registrationFees.publicationFee");
    expect(homeSource).toContain('href={publicationOpportunity.url}');
  });

  it("provides the approved SCI 2027 fee matrix, optional add-ons and unchanged CBE payment-confirmation instructions", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const fees = sci2027Content.registrationFees;

    if (!fees) {
      expect(fees).toBeDefined();
      return;
    }

    expect(fees.title).toBe("Registration Fees & Payment");
    expect(fees.audienceGroups).toEqual([
      "Undergraduate",
      "Postgraduate",
      "Prof. & Faculty / Researchers",
    ]);
    expect(fees.options).toEqual([
      { label: "Attendance", amounts: ["EGP 250", "EGP 400", "EGP 1,000"] },
      { label: "Attendance + presenting", amounts: ["EGP 350", "EGP 500", "EGP 1,500"] },
      { label: "Attendance + GJSR publication", amounts: ["Not available", "EGP 750", "EGP 2,000"] },
    ]);
    expect(fees.publicationOption).toMatchObject({
      title: "Attendance + GJSR publication",
      combinedWithAttendance: true,
      payableAfterJournalAcceptance: true,
    });
    expect(fees.addOns).toEqual([
      { label: "Gala dinner", amount: "EGP 650", detail: "Optional for all registration categories" },
      { label: "Museum visit", amount: "Price to be announced", detail: "Optional add-on" },
    ]);
    expect(fees.payment).toMatchObject({
      method: "InstaPay",
      bank: "Central Bank of Egypt (CBE)",
      identifier: "9450882167",
      confirmationEmail: "sci.conf.2027@gmail.com",
    });
    expect(fees.receiptDetails).toEqual([
      "Full name",
      "Registration category",
      "Transferred amount",
      "A clear image or copy of the transfer receipt",
    ]);
    expect(fees.confirmationNote).toBe("Registration will be confirmed after payment proof is reviewed.");
    expect(homeSource.indexOf("registrationFees.title")).toBeLessThan(homeSource.indexOf('id="registration"'));
    expect(homeSource).toContain("<table");
    expect(homeSource).toContain('scope="col"');
    expect(homeSource).toContain('scope="row"');
    expect(homeSource).toContain("registrationFees.options.map");
    expect(homeSource).toContain("registrationFees.addOns.map");
    expect(homeSource).toContain("overflow-x-auto");
    expect(homeSource).not.toContain("registrationFees.categories.map");
    expect(homeSource).toContain('mailto:${registrationFees.payment.confirmationEmail}');
    expect(homeSource).not.toContain("createCheckoutSession");
  });

  it("routes public Register now and Register actions to fees before retaining official external forms", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const headerSource = readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8");

    expect(homeSource).toContain('href="#registration-fees"');
    expect(homeSource.indexOf('id="registration-fees"')).toBeLessThan(homeSource.indexOf('id="registration"'));
    expect(headerSource).toContain('{ href: "/#registration-fees", label: "Register" }');
    expect(headerSource.match(/href="\/#registration-fees"/g) ?? []).toHaveLength(2);
    expect(headerSource).not.toContain("sci2027Content.registration.general.url");
    expect(homeSource).toContain("const registrationOptions = [");
    expect(homeSource).toContain("sci2027Content.registration.general");
    expect(homeSource).toContain("sci2027Content.registration.speaker");
    expect(homeSource).toContain("sci2027Content.registration.studentResearch");
    expect(homeSource).toContain('href={option.url} target="_blank" rel="noreferrer"');
  });

  it("routes the approved English-only call for abstracts through the speaker and student research forms", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const abstractCall = sci2027Content.abstractCall;

    expect(abstractCall.title.en).toBe("Share your research. Shape the future.");
    expect(abstractCall.description.en).toBe("Researchers, academics, postgraduate and undergraduate students, and industry professionals are invited to submit original research relevant to the six SCI 2027 tracks.");
    expect(abstractCall.requirements).toEqual([
      "Abstracts must be written in English.",
      "Maximum abstract length: 300 words.",
      "Include the title, author names, affiliations and corresponding author contact information.",
      "Provide 3–5 keywords.",
      "Summarise research background, objectives, methodology, principal results and conclusions.",
    ]);
    expect(abstractCall.status.en).toBe("Abstract submissions are accepted through the relevant SCI 2027 form below.");
    expect(abstractCall.submissionOptions).toEqual([
      {
        label: "Submit a Speaker Abstract",
        audience: "For researchers, academics and industry professionals.",
        url: sci2027Content.registration.speaker.url,
      },
      {
        label: "Submit Student Research / Thesis / Project",
        audience: "For undergraduate and postgraduate students.",
        url: sci2027Content.registration.studentResearch.url,
      },
    ]);
    expect(JSON.stringify(abstractCall)).not.toContain("deadline");
    expect(sci2027Content.registration.speaker.name.en).toBe("Speaker & Abstract Submission");
    expect(sci2027Content.registration.speaker.description.en).toBe("For researchers, academics and industry professionals submitting an abstract through the official SCI 2027 form.");
    expect(homeSource).toContain("abstractCall.submissionOptions.map");
    expect(homeSource).toContain('href={option.url}');
    expect(homeSource).toContain('target="_blank"');
    expect(homeSource).toContain('rel="noreferrer"');
  });

  it("uses six original SCI 2027 visuals for tracks while retaining licensed Unsplash imagery for the Unit and partnerships", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unitPagePath = projectPath("client/src/pages/Sci2027OrganizationUnit.tsx");
    const unitPageSource = existsSync(unitPagePath) ? readFileSync(unitPagePath, "utf8") : "";
    const sponsorshipSource = readFileSync(projectPath("client/src/pages/Sci2027Sponsorship.tsx"), "utf8");
    const trackVisuals = sci2027Content.tracks.map((track) => track.visual);
    const retainedUnsplashVisuals = [
      sci2027Content.conferenceOrganizationUnit.visual,
      sci2027Content.sponsorship.visual,
    ].filter(Boolean);

    expect(trackVisuals).toHaveLength(6);
    expect(trackVisuals.every((visual) => visual.url.startsWith("https://"))).toBe(true);
    expect(trackVisuals.every((visual) => visual.alt.length > 20)).toBe(true);
    expect(trackVisuals.every((visual) => visual.source === "SCI 2027 Original")).toBe(true);
    expect(trackVisuals.every((visual) => visual.licenseUrl === undefined)).toBe(true);
    expect(retainedUnsplashVisuals).toHaveLength(2);
    expect(retainedUnsplashVisuals.every((visual) => visual.source === "Unsplash")).toBe(true);
    expect(retainedUnsplashVisuals.every((visual) => visual.licenseUrl === "https://unsplash.com/license")).toBe(true);
    expect(homeSource).toContain("track.visual.url");
    expect(homeSource).toContain("track.visual.alt");
    expect(homeSource).toContain('track.visual.source === "SCI 2027 Original"');
    expect(homeSource).toContain("Original SCI 2027 visual");
    expect(unitPageSource).toContain("conferenceOrganizationUnit.visual.url");
    expect(homeSource).toContain("sponsorship.visual.url");
    expect(homeSource).toContain("object-cover");
    expect(sponsorshipSource).toContain("sponsorship.visual.url");
    expect(sponsorshipSource).toContain("bg-[#062f52]/");
  });

  it("includes the approved student research, thesis and graduation-project registration form", () => {
    expect(sci2027Content.registration.studentResearch.url).toBe("https://forms.gle/fmXUzEQ85hbXnLFp8");
    expect(sci2027Content.registration.studentResearch.name.en).toBe("Student Research, Thesis & Graduation Project Registration");
    expect(sci2027Content.registration.studentResearch.description.en).toBe("For undergraduate and postgraduate students presenting student research, thesis work, or graduation projects.");
    expect(sci2027Content.registration.studentResearch.notice.en).toBe("Abstract submissions are accepted through this form. A submission deadline has not yet been announced.");
  });

  it("sets workshops on 6 and Saturday 10 April while retaining the 7–8 April main conference", () => {
    const centralContentSource = readFileSync(projectPath("client/src/data/sci2027Content.ts"), "utf8");
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const programmeSource = readFileSync(projectPath("client/src/pages/Sci2027Programme.tsx"), "utf8");
    const publicProgrammeSources = [centralContentSource, homeSource, programmeSource];

    expect(sci2027Content.programme.map((day) => day.date)).toEqual([
      "6 April 2027",
      "7 April 2027",
      "8 April 2027",
      "10 April 2027",
    ]);
    expect(sci2027Content.programme.at(-1)?.day.en).toBe("Post-conference workshops · Saturday");
    expect(sci2027Content.workshopProgramme.preConference.date).toBe("6 April 2027");
    expect(sci2027Content.workshopProgramme.postConference.date).toBe("10 April 2027");
    expect(sci2027Content.identity.dates.en).toBe("7–8 April 2027");
    expect(sci2027Content.identity.workshopDate.en).toContain("6 and 10 April 2027");
    expect(sci2027Content.identity.workshopDate.en).toContain("optional cultural visit: 10 April 2027");
    expect(sci2027Content.workshopProgramme.status).toContain("to be announced");
    expect(sci2027Content.workshopProgramme.postConference.optionalActivity).toContain("Grand Egyptian Museum");
    expect(homeSource).toContain("Workshop days: 6 and 10 April");
    expect(homeSource).toContain("6–10 April 2027 overview");
    expect(programmeSource).toContain("6–10 April 2027");
    expect(programmeSource).toContain('"10 April 2027": [');
    expect(programmeSource).toContain("Main conference: 7–8 April");

    for (const source of publicProgrammeSources) {
      expect(source).not.toContain("9 April");
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

  it("renders three approved Distinguished Patronage cards with the Vice Dean portrait fully visible", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const patronage = sci2027Content.patronage as ReadonlyArray<
      (typeof sci2027Content.patronage)[number] & {
        photo: { url: string; alt: string; fit?: "cover" | "contain" };
      }
    >;
    const portraits = patronage.map((patron) => patron.photo).filter(Boolean);

    expect(patronage).toHaveLength(3);
    expect(portraits).toHaveLength(3);
    expect(portraits.every((photo) => photo.url.startsWith("https://"))).toBe(true);
    expect(portraits.every((photo) => photo.alt.length > 20)).toBe(true);
    expect(patronage.map((patron) => patron.name)).toEqual([
      "Prof. Mohamed Sami Abdel-Sadek",
      "Prof. Sohair Ramadan Fahmy",
      "Prof. Amal Soliman",
    ]);
    expect(patronage[2]).toMatchObject({
      role: "Vice Dean for Postgraduate Studies and Research, Faculty of Science, Cairo University",
      photo: {
        alt: "Prof. Amal Soliman, Vice Dean for Postgraduate Studies and Research, Faculty of Science, Cairo University.",
        fit: "contain",
      },
    });
    expect(homeSource).toContain("patron.photo.url");
    expect(homeSource).toContain("patron.photo.alt");
    expect(homeSource).toContain("aspect-[4/5]");
    expect(homeSource).toContain('patron.photo.fit === "contain"');
    expect(homeSource).toContain("object-contain");
    expect(homeSource).toContain("object-cover");
  });

  it("places Distinguished Patronage immediately after the Hero", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const patronagePosition = homeSource.indexOf("Distinguished patronage");
    const introductionPosition = homeSource.indexOf("Science, partnership and impact");

    expect(patronagePosition).toBeGreaterThan(homeSource.indexOf("<main>"));
    expect(patronagePosition).toBeLessThan(introductionPosition);
  });

  it("announces the Scientific and Organizing Committees after patronage without duplicating the Unit roster", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const committeesPosition = homeSource.indexOf('id="conference-committees"');

    expect(committeesPosition).toBeGreaterThan(homeSource.indexOf("sci2027Content.patronage.map"));
    expect(committeesPosition).toBeLessThan(homeSource.indexOf('id="venue"'));
    expect(homeSource).toContain("Scientific Committee");
    expect(homeSource).toContain("To be announced.");
    expect(homeSource).toContain("Organizing Committee");
    expect(homeSource).toContain("Conference Organization Unit and its members.");
    expect(homeSource).toContain('<Link href="/conference-organization-unit"');
    expect(homeSource).toContain("Meet the Conference Organization Unit");
    expect(homeSource).not.toContain("conferenceOrganizationUnit.members.map");
  });

  it("moves the Conference Organization Unit content to its own routed page and navigation tab", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unitPagePath = projectPath("client/src/pages/Sci2027OrganizationUnit.tsx");
    const unitPageSource = existsSync(unitPagePath) ? readFileSync(unitPagePath, "utf8") : "";
    const appSource = readFileSync(projectPath("client/src/App.tsx"), "utf8");
    const headerSource = readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8");
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
    expect(existsSync(unitPagePath)).toBe(true);
    expect(unitPageSource).toContain("conferenceOrganizationUnit");
    expect(unitPageSource).toContain("Visit the Faculty of Science Website");
    expect(unitPageSource).toContain("Learn More About the Unit");
    expect(unitPageSource).toContain("conferenceOrganizationUnit.objectives.map");
    expect(unitPageSource).toContain('target="_blank"');
    expect(unitPageSource).toContain('rel="noreferrer"');
    expect(appSource).toContain("Sci2027OrganizationUnit");
    expect(appSource).toContain('path={"/conference-organization-unit"}');
    expect(headerSource).toContain('{ href: "/conference-organization-unit", label: "Conference Organization Unit" }');
    expect(headerSource.indexOf('{ href: "/#about", label: "About" }')).toBeLessThan(headerSource.indexOf('{ href: "/conference-organization-unit", label: "Conference Organization Unit" }'));
    expect(headerSource).toContain("2xl:flex");
    expect(headerSource).toContain("2xl:hidden");
    for (const removedHomepagePhrase of ["conferenceOrganizationUnit", "How the Unit works", "Meet the Unit", "Visit the Faculty of Science Website", "Learn More About the Unit"]) {
      expect(homeSource).not.toContain(removedHomepagePhrase);
    }
    expect(unitPageSource).not.toMatch(/info@sci\.cu\.edu\.eg|\+20 2 3567 6000/u);
  });

  it("exposes SCI 2026 Archive after Watch SCI 2027 in shared primary navigation", () => {
    const headerSource = readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8");
    const footerSource = readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8");
    const appSource = readFileSync(projectPath("client/src/App.tsx"), "utf8");
    const watchSci2027Item = '{ href: "/videos", label: "Watch SCI 2027" }';
    const archiveItem = '{ href: "/archive-2026", label: "SCI 2026 Archive" }';

    expect(appSource).toContain('path={"/archive-2026"}');
    expect(headerSource).toContain(archiveItem);
    expect(headerSource.indexOf(watchSci2027Item)).toBeLessThan(headerSource.indexOf(archiveItem));
    expect((headerSource.match(/navigation\.map/g) ?? [])).toHaveLength(2);
    expect(footerSource).toContain('<Link href="/archive-2026"');
  });

  it("publishes the updated eight-member Conference Organization Unit roster without meeting-record or contact details", () => {
    const unitPagePath = projectPath("client/src/pages/Sci2027OrganizationUnit.tsx");
    const unitPageSource = existsSync(unitPagePath) ? readFileSync(unitPagePath, "utf8") : "";
    const unit = sci2027Content.conferenceOrganizationUnit;

    expect(unit.members).toHaveLength(8);
    expect(unit.members.map((member) => `${member.name} | ${member.role}`)).toEqual([
      "Prof. Walid Rahouma | Director of the Unit",
      "Prof. Mohamed Qarny | Secretary of the Unit",
      "Mrs. Manar Mohamed | Administrative Secretary to the Unit",
      "Dr. Nahla Osama | Scientific Programme Lead",
      "Prof. Rania Ali | Media & Marketing Lead",
      "Dr. Nourhan Hassan | Sponsorship, Funding & Conference Website Lead",
      "Prof. Azza Shoukry | Registration & Operations Lead",
      "Dr. Dina Amr | Logistics Lead",
    ]);
    expect(unit.members.map((member) => member.name)).not.toContain("Prof. Rasha El-Nashar");
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
    expect(unitPageSource).toContain("Meet the Unit");
    expect(unitPageSource).toContain("conferenceOrganizationUnit.members.map");
    expect(unitPageSource).not.toContain("memberStatus");
    expect(unitPageSource).not.toContain("Prof. Rasha El-Nashar");
    expect(unitPageSource).not.toMatch(/info@sci\.cu\.edu\.eg|\+20 2 3567 6000|13 September 2026/u);
    expect(unitPageSource).not.toContain("<img src={member");
  });

  it("gives the Unit Director the same single-column card width while retaining the navy and gold director treatment", () => {
    const unitPagePath = projectPath("client/src/pages/Sci2027OrganizationUnit.tsx");
    const unitPageSource = existsSync(unitPagePath) ? readFileSync(unitPagePath, "utf8") : "";

    expect(unitPageSource).toContain("mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3");
    expect(unitPageSource).toContain('index === 0 ? "border-[#063760] bg-[#063760] text-white"');
    expect(unitPageSource).toContain('index === 0 ? "text-[#f0ca57]"');
    expect(unitPageSource).not.toContain("md:col-span-2");
    expect(unitPageSource).not.toContain("xl:col-span-2");
  });

  it("uses the approved short display spelling for the Unit Director in the conference introduction and Unit roster", () => {
    const director = sci2027Content.conferenceOrganizationUnit.members[0];

    expect(director.name).toBe("Prof. Walid Rahouma");
    expect(sci2027Content.organizer.head.en).toBe("Unit Head: Prof. Walid Rahouma");
  });

  it("uses the approved Conference Organization Unit logo directly at a larger responsive size", () => {
    const unitPagePath = projectPath("client/src/pages/Sci2027OrganizationUnit.tsx");
    const unitPageSource = existsSync(unitPagePath) ? readFileSync(unitPagePath, "utf8") : "";
    const unitLogo = sci2027Content.assets.conferenceUnitLogo;

    expect(unitLogo).toMatch(/^\/sci-2027\/logos\/conference-unit-logo\.[a-f0-9]{8}\.png$/);
    expect(existsSync(projectPath("client/public", unitLogo.slice(1)))).toBe(true);
    expect(unitPageSource).toContain("src={assets.conferenceUnitLogo}");
    expect(unitPageSource).toContain('className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"');
    expect(unitPageSource).not.toContain('rounded-[1.75rem] border border-[#063760]/10 bg-white');
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

  it("recognizes the approved Student Sponsorship Assistants on the sponsorship page only", () => {
    const sponsorshipPageSource = readFileSync(projectPath("client/src/pages/Sci2027Sponsorship.tsx"), "utf8");
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unitPageSource = readFileSync(projectPath("client/src/pages/Sci2027OrganizationUnit.tsx"), "utf8");
    const assistants = sci2027Content.sponsorship.studentSponsorshipAssistants;

    expect(assistants).toEqual({
      title: "Student Sponsorship Assistants",
      description: "Supporting sponsor outreach and partner coordination for SCI 2027.",
      members: ["Youssef Saher Sayed", "Ziad Ahmed"],
    });
    expect(sponsorshipPageSource).toContain("sponsorship.studentSponsorshipAssistants.members.map");
    for (const name of assistants.members) {
      expect(homeSource).not.toContain(name);
      expect(unitPageSource).not.toContain(name);
    }
  });

  it("lists the approved Sponsorship Committee before the separate student-assistant acknowledgement", () => {
    const sponsorshipPageSource = readFileSync(projectPath("client/src/pages/Sci2027Sponsorship.tsx"), "utf8");
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const unitPageSource = readFileSync(projectPath("client/src/pages/Sci2027OrganizationUnit.tsx"), "utf8");
    const sponsorship = sci2027Content.sponsorship as typeof sci2027Content.sponsorship & {
      sponsorshipCommittee?: { title: string; members: string[] };
    };

    expect(sponsorship.sponsorshipCommittee).toEqual({
      title: "Sponsorship Committee",
      members: ["Dr. Hoda Abu Shady", "Prof. Azza Shoukry"],
    });
    expect(sponsorshipPageSource).toContain("sponsorship.sponsorshipCommittee.members.map");
    expect(sponsorshipPageSource.indexOf("sponsorship.sponsorshipCommittee.members.map")).toBeLessThan(
      sponsorshipPageSource.indexOf("sponsorship.studentSponsorshipAssistants.members.map"),
    );
    expect(sci2027Content.conferenceOrganizationUnit.members.find((member) => member.name === "Prof. Azza Shoukry")?.role).toBe("Registration & Operations Lead");
    expect(homeSource).not.toContain("Dr. Hoda Abu Shady");
    expect(unitPageSource).not.toContain("Dr. Hoda Abu Shady");
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

  it("labels the public promotional-video experience Watch SCI 2027 without changing its route", () => {
    const homeSource = readFileSync(projectPath("client/src/pages/Sci2027Home.tsx"), "utf8");
    const headerSource = readFileSync(projectPath("client/src/components/Sci2027Header.tsx"), "utf8");
    const footerSource = readFileSync(projectPath("client/src/components/Sci2027Footer.tsx"), "utf8");
    const videosSource = readFileSync(projectPath("client/src/pages/Sci2027Videos.tsx"), "utf8");
    const appSource = readFileSync(projectPath("client/src/App.tsx"), "utf8");

    expect(homeSource).toContain('href="/videos"');
    expect(homeSource).toContain("featuredVideo");
    expect(homeSource).toContain(">Watch SCI 2027 <ArrowUpRight");
    expect(headerSource).toContain('label: "Watch SCI 2027"');
    expect(footerSource).toContain('href="/videos"');
    expect(footerSource).toContain(">Watch SCI 2027</Link>");
    expect(videosSource).toContain(">Watch SCI 2027</p>");
    expect(appSource).toContain('path={"/videos"} component={Sci2027Videos}');
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
