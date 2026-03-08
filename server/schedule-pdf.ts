import PDFDocument from "pdfkit";
import { Response } from "express";

// ─── DATA ────────────────────────────────────────────────────────────────────

const keynoteSpeakers = [
  {
    name: "Major General Dr. Khaled Amer",
    affiliation: "Founding Dean, Armed Forces College of Medicine; PI, Egyptian Genome Project",
    talk: "Egypt Genome; From Dream to Reality",
    day: 1,
  },
  {
    name: "Prof. Dr. Ehab El-Dabaa",
    affiliation: "Head of Biochemistry & Molecular Biology Dept & CERBioP, Theodor Bilharz Research Institute",
    talk: "Center of Excellence in Recombinant Biopharmaceutical Proteins (CERBioP) in TBRI; From Scientific Innovation to The Egyptian Biopharmaceutical Industry",
    day: 1,
  },
  {
    name: "Prof. Dr. Mortada Mourad Taha El Aref",
    affiliation: "Professor of Ore Geology, Faculty of Science, Cairo University",
    talk: "Karstology (Science of Unlimited Multi-Discipline Approaches), Promising Setting for Industrial Raw Materials",
    day: 2,
  },
  {
    name: "Prof. Dr. Hamed A. Ead",
    affiliation: "Professor of Chemistry, Faculty of Science, Cairo University",
    talk: "Science at the Core of Innovation: Reimagining the University–Industry Nexus for Transformative Impact",
    day: 2,
  },
];

const invitedBioDay1 = [
  { name: "Prof. Dr. Sohair Ramadan Fahmy", talk: "Practical Aspects of Experimental Design in Laboratory Animal Science" },
  { name: "Prof. Dr. Nagwa El-Badri", talk: "Biomimetic Scaffolds and the Human Amniotic Membrane" },
  { name: "Prof. Dr. Ibrahim M. El-Sherbiny", talk: "Basic Sciences As the Foundation of Innovation: Some Success Stories for Disease Treatment and Advanced Biomedical Applications" },
  { name: "Prof. Dr. Khalid Muhammad Taalab", talk: "Radiopharmaceuticals and Precision Medicine" },
  { name: "Prof. Dr. Osama Azmy", talk: "Management of the Rosy Years of Life" },
];

const invitedGeoDay1 = [
  { name: "Prof. Dr. Mortada Mourad El Aref", talk: "Egyptian Iron Ore for Supporting National Economy - Opportunities and Challenges" },
  { name: "Prof. Dr. Mahmoud Ibrahim Nasr", talk: "Egyptian Iron Ore as a Feedstock to the Iron and Steel Industry" },
  { name: "Prof. Dr. Mohamed Ibrahim El-Anbawy", talk: "Economic Utilization of Shale in Desert Land Reclamation and Cement Industry" },
  { name: "Dr. Sahar Hassan", talk: "Revolutionizing Subsurface Understanding: AI-Driven Logging-While-Drilling Technologies" },
  { name: "Dr. Ahmad Wafik Al Shareif", talk: "Detection of Low Contrast, Low Resistivity Pay (LCLR) Challenge in Shaly Sand Gas Reservoir" },
];

const invitedBioDay2 = [
  { name: "Prof. Dr. Ashraf Abdou Tabll", talk: "Current Status and Future Prospects of Medical Biotechnology in Egypt: Lessons from Monoclonal and IgY Antibodies" },
  { name: "Prof. Dr. Ayman El-Shibiny", talk: "Phage Innovation: Targeted Solutions for Regional Antimicrobial Challenges" },
  { name: "Prof. Dr. Naglaa A. Abdallah", talk: "Novel Genome Editing Approaches for a Sustainable Future" },
  { name: "Prof. em. Tarek Kapiel", talk: "Integrative Bio-Nanotechnologies for Industrial Symbiosis: Scaling the Circular Bioeconomy in Egypt" },
  { name: "Dr. Ahmed Fikry El-Sayed", talk: "Computer-Aided Drug Design: From Code to Cure" },
  { name: "Mr. Ahmed Youssef", talk: "Advanced Vaccine Bioprocessing: From Strain Selection to Market Release" },
  { name: "Assoc. Prof. Dr. Mohamed Hamed", talk: "Computational Transformation in Drug Discovery: Bioinformatics and AI Innovations in Pharmaceutical Science" },
  { name: "Prof. Dr. Rashika El Ridi", talk: "The Impact of Misleading Concepts in Science on Efforts to Control Schistosomiasis and Cancer" },
  { name: "Prof. Dr. Ahmed Galal", talk: "Photo-assisted Electrocatalysis: An Effective Tool for Green Chemical Conversion" },
  { name: "Prof. Dr. Refaat Gabre", talk: "Transfer, Localization, and Reproduction of Biotechnology in Egypt" },
];

const invitedGeoDay2 = [
  { name: "Prof. Dr. Osama Shalabiea", talk: "Space Science and Technology (SSAT): Exploration, Utilization and Commercialization" },
  { name: "Dr. Areeg Abdalla", talk: "Scientific Principles and Medical Applications of Artificial Intelligence" },
];

interface DaySession {
  time: string;
  type: string;
  title: string;
  location?: string;
  description?: string;
  speaker?: { name: string; affiliation: string; talk: string };
  tracks?: { hall: string; speaker: string; speakerTalk: string; topic: string }[];
  workshops?: { room: string; name: string }[];
}

const day1Sessions: DaySession[] = [
  { time: "09:00 – 10:00", type: "registration", title: "Arrival & Registration", location: "Conference Hall Entrance", description: "Welcome and registration for all conference participants" },
  { time: "10:00 – 10:45", type: "opening", title: "Welcome Talk", location: "Hall A (Connected to all halls)", description: "Opening ceremony with welcome addresses from university leadership" },
  { time: "10:45 – 11:10", type: "keynote", title: "Keynote Speaker 1", location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[0] },
  { time: "11:10 – 11:35", type: "keynote", title: "Keynote Speaker 2", location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[1] },
  { time: "11:35 – 11:50", type: "panel", title: "Discussion Panel", location: "All Halls", description: "Interactive discussion following keynote presentations" },
  {
    time: "11:50 – 12:10", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 1)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[0].name, speakerTalk: invitedBioDay1[0].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay1[0].name, speakerTalk: invitedGeoDay1[0].talk, topic: "Geology, Physics & other sciences" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences (Participants)" },
    ],
    workshops: [
      { room: "Workshop Room 1", name: "MARC Workshop" },
      { room: "Workshop Room 2", name: "From DNA to Proteins: Advanced Sequencing Technologies" },
    ],
  },
  {
    time: "12:10 – 12:30", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 2)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[1].name, speakerTalk: invitedBioDay1[1].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay1[1].name, speakerTalk: invitedGeoDay1[1].talk, topic: "Geology, Physics & other sciences" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences (Participants)" },
    ],
    workshops: [
      { room: "Workshop Room 1", name: "MARC Workshop (Cont.)" },
      { room: "Workshop Room 2", name: "Advanced Sequencing Technologies (Cont.)" },
    ],
  },
  { time: "12:30 – 12:45", type: "panel", title: "Discussion Panels", location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "12:45 – 13:30", type: "break", title: "Coffee Break", location: "Conference Foyer", description: "Refreshments and networking opportunity" },
  {
    time: "13:30 – 13:50", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 3)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[2].name, speakerTalk: invitedBioDay1[2].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay1[2].name, speakerTalk: invitedGeoDay1[2].talk, topic: "Geology, Physics & other sciences" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Room 2", name: "MARC Workshop (Cont.)" }],
  },
  {
    time: "13:50 – 14:10", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 4)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[3].name, speakerTalk: invitedBioDay1[3].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay1[3].name, speakerTalk: invitedGeoDay1[3].talk, topic: "Geology, Physics & other sciences" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Room 2", name: "MARC Workshop (Cont.)" }],
  },
  {
    time: "14:10 – 14:30", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 5)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[4].name, speakerTalk: invitedBioDay1[4].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay1[4].name, speakerTalk: invitedGeoDay1[4].talk, topic: "Geology, Physics & other sciences" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Room 2", name: "MARC Workshop (Cont.)" }],
  },
  { time: "14:30 – 14:50", type: "panel", title: "Discussion Panels", location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "14:50 – 15:30", type: "poster", title: "Poster Session", location: "Conference Foyer", description: "Poster presentations and networking" },
];

const day2Sessions: DaySession[] = [
  { time: "09:00 – 09:30", type: "registration", title: "Arrival & Registration", location: "Conference Hall Entrance", description: "Registration for Day 2 participants" },
  { time: "09:30 – 09:55", type: "keynote", title: "Keynote Speaker 3", location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[2] },
  { time: "09:55 – 10:20", type: "keynote", title: "Keynote Speaker 4", location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[3] },
  { time: "10:20 – 10:35", type: "panel", title: "Discussion Panel & Workshop Start", location: "All Halls + Workshop Rooms", description: "Discussion panel and beginning of workshops" },
  {
    time: "10:35 – 10:55", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 1)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[0].name, speakerTalk: invitedBioDay2[0].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay2[0].name, speakerTalk: invitedGeoDay2[0].talk, topic: "Astrophysics, Mathematics & other disciplines" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop" }],
  },
  {
    time: "10:55 – 11:15", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 2)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[1].name, speakerTalk: invitedBioDay2[1].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: invitedGeoDay2[1].name, speakerTalk: invitedGeoDay2[1].talk, topic: "Mathematics & other disciplines" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop (Cont.)" }],
  },
  {
    time: "11:15 – 11:35", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 3)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[2].name, speakerTalk: invitedBioDay2[2].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences (Participants)" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop (Cont.)" }],
  },
  { time: "11:35 – 11:50", type: "panel", title: "Discussion Panels", location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "11:50 – 13:30", type: "break", title: "Lunch Break", location: "Conference Foyer", description: "Lunch and networking opportunity" },
  {
    time: "13:30 – 13:50", type: "parallel", title: "Parallel Sessions — Invited Speakers (Round 4)",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[3].name, speakerTalk: invitedBioDay2[3].talk, topic: "Biological & Chemical Sciences" },
      { hall: "Hall B", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences (Participants)" },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences (Participants)" },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences (Participants)" },
    ],
    workshops: [{ room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop (Cont.)" }],
  },
  {
    time: "13:50 – 14:05", type: "panel", title: "Discussion Panels", location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls"
  },
  { time: "14:05 – 14:50", type: "poster", title: "Poster Session", location: "Conference Foyer", description: "Poster presentations and networking" },
  { time: "14:50 – 15:30", type: "closing", title: "Conference Closure & Awards Ceremony", location: "Main Hall", description: "Closing ceremony with appreciation and announcement of Best Project, Poster and Presentation Awards" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const COLORS = {
  primary: "#1a3a5c",      // deep navy
  secondary: "#c8a84b",    // gold
  keynote: "#1e40af",      // blue
  parallel: "#4338ca",     // indigo
  panel: "#7c3aed",        // purple
  break: "#d97706",        // amber
  closing: "#059669",      // green
  registration: "#475569", // slate
  opening: "#065f46",      // emerald
  poster: "#be185d",       // pink
  lightGray: "#f1f5f9",
  midGray: "#94a3b8",
  darkText: "#1e293b",
  white: "#ffffff",
};

function wrapText(doc: PDFKit.PDFDocument, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = doc.widthOfString(testLine);
    if (testWidth > maxWidth && line) {
      doc.text(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    doc.text(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function sessionTypeColor(type: string): string {
  return (COLORS as Record<string, string>)[type] ?? COLORS.midGray;
}

function drawSessionBlock(
  doc: PDFKit.PDFDocument,
  session: DaySession,
  y: number,
  pageWidth: number,
  margin: number
): number {
  const contentWidth = pageWidth - margin * 2;
  const typeColor = sessionTypeColor(session.type);

  // Estimate block height
  let estimatedHeight = 14 + 8; // time + title
  if (session.description) estimatedHeight += 10;
  if (session.location) estimatedHeight += 10;
  if (session.speaker) estimatedHeight += 40;
  if (session.tracks) estimatedHeight += session.tracks.filter(t => t.speaker !== "Participant Presentations").length * 28 + 20;
  if (session.workshops) estimatedHeight += session.workshops.length * 14 + 14;
  estimatedHeight += 10; // padding

  // Page break if needed
  if (y + estimatedHeight > doc.page.height - 60) {
    doc.addPage();
    y = 50;
  }

  // Left color bar
  doc.rect(margin, y, 4, estimatedHeight).fill(typeColor);

  // Background
  doc.rect(margin + 4, y, contentWidth - 4, estimatedHeight).fill(COLORS.lightGray);

  let textY = y + 8;
  const textX = margin + 14;
  const textMaxWidth = contentWidth - 20;

  // Time badge
  doc.fontSize(8).fillColor(typeColor).font("Helvetica-Bold").text(session.time, textX, textY);
  doc.fontSize(8).fillColor(COLORS.midGray).font("Helvetica").text(` — ${session.type.toUpperCase()}`, textX + doc.widthOfString(session.time) + 2, textY);
  textY += 13;

  // Title
  doc.fontSize(10).fillColor(COLORS.darkText).font("Helvetica-Bold").text(session.title, textX, textY, { width: textMaxWidth });
  textY += 13;

  // Location
  if (session.location) {
    doc.fontSize(8).fillColor(COLORS.midGray).font("Helvetica").text(`📍 ${session.location}`, textX, textY, { width: textMaxWidth });
    textY += 11;
  }

  // Description
  if (session.description) {
    doc.fontSize(8).fillColor(COLORS.darkText).font("Helvetica").text(session.description, textX, textY, { width: textMaxWidth });
    textY += 11;
  }

  // Keynote speaker
  if (session.speaker) {
    textY += 4;
    doc.rect(textX, textY, textMaxWidth - 4, 1).fill(typeColor);
    textY += 5;
    doc.fontSize(8).fillColor(typeColor).font("Helvetica-Bold").text("KEYNOTE SPEAKER", textX, textY);
    textY += 11;
    doc.fontSize(9).fillColor(COLORS.darkText).font("Helvetica-Bold").text(session.speaker.name, textX, textY, { width: textMaxWidth });
    textY += 11;
    doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica").text(session.speaker.affiliation, textX, textY, { width: textMaxWidth });
    textY += 11;
    doc.fontSize(8).fillColor(typeColor).font("Helvetica-Oblique").text(`"${session.speaker.talk}"`, textX, textY, { width: textMaxWidth });
    textY += 12;
  }

  // Parallel tracks (invited speakers only)
  if (session.tracks) {
    const invited = session.tracks.filter(t => t.speaker !== "Participant Presentations");
    if (invited.length > 0) {
      textY += 4;
      doc.fontSize(7.5).fillColor(typeColor).font("Helvetica-Bold").text("INVITED SPEAKERS:", textX, textY);
      textY += 10;
      for (const track of invited) {
        doc.fontSize(8).fillColor(COLORS.darkText).font("Helvetica-Bold").text(`${track.hall}: ${track.speaker}`, textX + 4, textY, { width: textMaxWidth - 4 });
        textY += 10;
        if (track.speakerTalk) {
          doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica-Oblique").text(`"${track.speakerTalk}"`, textX + 10, textY, { width: textMaxWidth - 10 });
          textY += 10;
        }
      }
    }
  }

  // Workshops
  if (session.workshops && session.workshops.length > 0) {
    textY += 4;
    doc.fontSize(7.5).fillColor(COLORS.break).font("Helvetica-Bold").text("WORKSHOPS:", textX, textY);
    textY += 10;
    for (const ws of session.workshops) {
      doc.fontSize(7.5).fillColor(COLORS.darkText).font("Helvetica").text(`${ws.room}: ${ws.name}`, textX + 4, textY, { width: textMaxWidth - 4 });
      textY += 10;
    }
  }

  return y + estimatedHeight + 6;
}

// ─── MAIN EXPORT FUNCTION ────────────────────────────────────────────────────

export function generateSchedulePDF(res: Response): void {
  const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="SCI2026-Conference-Schedule.pdf"');
  doc.pipe(res);

  const pageWidth = doc.page.width;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  // Header band
  doc.rect(0, 0, pageWidth, 160).fill(COLORS.primary);

  doc.fontSize(26).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("SCI 2026", margin, 30, { width: contentWidth, align: "center" });

  doc.fontSize(13).fillColor(COLORS.secondary).font("Helvetica-Bold")
    .text("Science at the Core of Innovation", margin, 65, { width: contentWidth, align: "center" });

  doc.fontSize(10).fillColor(COLORS.white).font("Helvetica")
    .text("Building Effective Partnerships between Universities and Industry", margin, 88, { width: contentWidth, align: "center" });

  doc.fontSize(9).fillColor(COLORS.secondary).font("Helvetica")
    .text("April 7–8, 2026  ·  Faculty of Science, Cairo University", margin, 108, { width: contentWidth, align: "center" });

  doc.fontSize(9).fillColor(COLORS.white).font("Helvetica")
    .text("University Hostel Conference Hall", margin, 125, { width: contentWidth, align: "center" });

  // Gold divider
  doc.rect(margin, 160, contentWidth, 3).fill(COLORS.secondary);

  let y = 180;

  // ── KEYNOTE SPEAKERS SECTION ─────────────────────────────────────────────
  doc.fontSize(13).fillColor(COLORS.primary).font("Helvetica-Bold")
    .text("Keynote Speakers", margin, y);
  y += 18;
  doc.rect(margin, y, contentWidth, 1).fill(COLORS.secondary);
  y += 8;

  for (const ks of keynoteSpeakers) {
    if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
    doc.rect(margin, y, 3, 36).fill(COLORS.keynote);
    doc.rect(margin + 3, y, contentWidth - 3, 36).fill(COLORS.lightGray);
    doc.fontSize(9).fillColor(COLORS.keynote).font("Helvetica-Bold")
      .text(`Day ${ks.day} Keynote`, margin + 12, y + 5);
    doc.fontSize(9.5).fillColor(COLORS.darkText).font("Helvetica-Bold")
      .text(ks.name, margin + 12, y + 16, { width: contentWidth - 20 });
    doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica-Oblique")
      .text(`"${ks.talk}"`, margin + 12, y + 27, { width: contentWidth - 20 });
    y += 44;
  }

  y += 10;

  // ── DAY 1 ────────────────────────────────────────────────────────────────
  if (y > doc.page.height - 100) { doc.addPage(); y = 50; }
  doc.rect(0, y, pageWidth, 28).fill(COLORS.primary);
  doc.fontSize(13).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Day 1 — Tuesday, April 7, 2026", margin, y + 8, { width: contentWidth });
  y += 36;

  for (const session of day1Sessions) {
    y = drawSessionBlock(doc, session, y, pageWidth, margin);
  }

  // ── DAY 2 ────────────────────────────────────────────────────────────────
  doc.addPage();
  y = 40;
  doc.rect(0, y, pageWidth, 28).fill(COLORS.primary);
  doc.fontSize(13).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Day 2 — Wednesday, April 8, 2026", margin, y + 8, { width: contentWidth });
  y += 36;

  for (const session of day2Sessions) {
    y = drawSessionBlock(doc, session, y, pageWidth, margin);
  }

  // ── INVITED SPEAKERS SUMMARY ─────────────────────────────────────────────
  doc.addPage();
  y = 40;
  doc.fontSize(14).fillColor(COLORS.primary).font("Helvetica-Bold")
    .text("All Invited Speakers", margin, y);
  y += 16;
  doc.rect(margin, y, contentWidth, 2).fill(COLORS.secondary);
  y += 10;

  const speakerGroups = [
    { title: "Day 1 — Biological & Chemical Sciences (Hall A)", speakers: invitedBioDay1 },
    { title: "Day 1 — Geology, Physics & other sciences (Hall B)", speakers: invitedGeoDay1 },
    { title: "Day 2 — Biological & Chemical Sciences (Hall A)", speakers: invitedBioDay2 },
    { title: "Day 2 — Astrophysics, Mathematics & other disciplines (Hall B)", speakers: invitedGeoDay2 },
  ];

  for (const group of speakerGroups) {
    if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
    doc.fontSize(10).fillColor(COLORS.primary).font("Helvetica-Bold").text(group.title, margin, y);
    y += 13;
    for (const sp of group.speakers) {
      if (y > doc.page.height - 40) { doc.addPage(); y = 50; }
      doc.fontSize(8.5).fillColor(COLORS.darkText).font("Helvetica-Bold").text(sp.name, margin + 8, y);
      y += 11;
      doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica-Oblique").text(`"${sp.talk}"`, margin + 12, y, { width: contentWidth - 12 });
      y += 12;
    }
    y += 8;
  }

  // ── WORKSHOPS SUMMARY ────────────────────────────────────────────────────
  if (y > doc.page.height - 120) { doc.addPage(); y = 50; }
  doc.fontSize(14).fillColor(COLORS.primary).font("Helvetica-Bold").text("Workshop Program", margin, y);
  y += 16;
  doc.rect(margin, y, contentWidth, 2).fill(COLORS.secondary);
  y += 10;

  const workshopGroups = [
    {
      label: "Pre-Conference — April 6",
      color: COLORS.secondary,
      items: [
        { name: "Biotech Product Development 101", detail: "By Chitosan · 9:00 AM – 12:00 PM · 30 seats" },
      ],
    },
    {
      label: "During Conference — April 7–8",
      color: COLORS.parallel,
      items: [
        { name: "MARC Workshop", detail: "By MARC · Day 1 (April 7) · Workshop Rooms 1 & 2" },
        { name: "From DNA to Proteins: Advanced Sequencing Technologies", detail: "By Nawah Scientific · Day 1 (April 7) · Workshop Room 2" },
        { name: "Nawah Scientific Workshop", detail: "By Nawah Scientific · Day 2 (April 8) · Workshop Rooms 1 & 2" },
        { name: "From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy", detail: "By Agitech (For Integrated Scientific Instruments, SAE) · April 6, 12:00 PM – 2:00 PM · 20 seats" },
      ],
    },
    {
      label: "Post-Conference — April 9",
      color: COLORS.closing,
      items: [
        { name: "Introduction to Single Cell Genomics", detail: "By EG-CompBio & GARN · April 9, 10:00 AM – 1:00 PM · 3 hours · 30 seats" },
        { name: "Integrating Genomics & Proteomics in Biopharmaceutical R&D", detail: "By HVD Life Sciences · Date & Time TBA · HVD Company, New Cairo · 30 seats" },
        { name: "AI Meets Biotech", detail: "How to leverage AI in Biotechnology · 3 hours" },
      ],
    },
  ];

  for (const group of workshopGroups) {
    if (y > doc.page.height - 60) { doc.addPage(); y = 50; }
    doc.rect(margin, y, contentWidth, 20).fill(group.color);
    doc.fontSize(9).fillColor(COLORS.white).font("Helvetica-Bold").text(group.label, margin + 8, y + 6);
    y += 24;
    for (const item of group.items) {
      if (y > doc.page.height - 30) { doc.addPage(); y = 50; }
      doc.fontSize(8.5).fillColor(COLORS.darkText).font("Helvetica-Bold").text(item.name, margin + 8, y);
      y += 11;
      doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica").text(item.detail, margin + 12, y);
      y += 12;
    }
    y += 6;
  }

  doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica")
    .text("* Workshop fee: 200 EGP per workshop · Payment via InstaPay (CBE account: 9450882167) · Limited to 30 participants each", margin, y + 6, { width: contentWidth });

  // ── AWARDS SECTION ──────────────────────────────────────────────────────
  doc.addPage();
  y = 50;

  // Section header
  doc.rect(margin, y, contentWidth, 28).fill(COLORS.primary);
  doc.fontSize(14).fillColor(COLORS.white).font("Helvetica-Bold").text("Conference Awards", margin, y + 8, { width: contentWidth, align: "center" });
  y += 36;

  // Awards categories
  const awardCategories = [
    { title: "Best Oral Presentation", titleAr: "جائزة أفضل عرض شفهي", description: "Awarded to the most outstanding oral research presentation across all tracks" },
    { title: "Best Poster Presentation", titleAr: "جائزة أفضل ملصق بحثي", description: "Recognizing the most visually compelling and scientifically rigorous poster" },
    { title: "Best Graduation Project", titleAr: "جائزة أفضل مشروع تخرج", description: "Honoring the most innovative and impactful undergraduate graduation project" },
    { title: "Best Paper Award", titleAr: "جائزة أفضل بحث علمي", description: "Celebrating exceptional written research contributions" },
    { title: "Best Innovative Research Idea Award", titleAr: "جائزة أفضل فكرة بحثية مبتكرة", description: "Sponsored by Medsol Corporation — Cash prizes for the most creative and impactful scientific ideas" },
  ];

  doc.fontSize(11).fillColor(COLORS.primary).font("Helvetica-Bold").text("Award Categories", margin, y);
  y += 16;

  for (const award of awardCategories) {
    if (y > doc.page.height - 60) { doc.addPage(); y = 50; }
    doc.rect(margin, y, 4, 28).fill(COLORS.secondary);
    doc.fontSize(9).fillColor(COLORS.darkText).font("Helvetica-Bold").text(award.title, margin + 10, y);
    y += 11;
    doc.fontSize(8).fillColor(COLORS.midGray).font("Helvetica").text(award.titleAr, margin + 10, y);
    y += 10;
    doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica").text(award.description, margin + 10, y, { width: contentWidth - 14 });
    y += 16;
  }

  y += 10;

  // Medsol Corporation spotlight
  doc.rect(margin, y, contentWidth, 24).fill("#0d9488");
  doc.fontSize(11).fillColor(COLORS.white).font("Helvetica-Bold").text("Medsol Corporation Award", margin, y + 7, { width: contentWidth, align: "center" });
  y += 30;

  doc.fontSize(10).fillColor(COLORS.primary).font("Helvetica-Bold").text("Best Innovative Research Idea Award", margin, y);
  y += 14;
  doc.fontSize(8.5).fillColor(COLORS.darkText).font("Helvetica").text("Sponsored by Medsol Corporation", margin, y);
  y += 12;
  doc.fontSize(8).fillColor(COLORS.midGray).font("Helvetica").text(
    "Cash prizes will be awarded to the top three most creative and impactful scientific research ideas presented at the conference.",
    margin, y, { width: contentWidth }
  );
  y += 20;

  const prizes = [
    { place: "1st Place", amount: "3,000 EGP", color: "#f59e0b" },
    { place: "2nd Place", amount: "2,000 EGP", color: "#94a3b8" },
    { place: "3rd Place", amount: "1,000 EGP", color: "#b45309" },
  ];

  const prizeColW = (contentWidth - 20) / 3;
  for (let i = 0; i < prizes.length; i++) {
    const px = margin + i * (prizeColW + 10);
    doc.rect(px, y, prizeColW, 36).fill(prizes[i].color);
    doc.fontSize(9).fillColor(COLORS.white).font("Helvetica-Bold").text(prizes[i].place, px, y + 6, { width: prizeColW, align: "center" });
    doc.fontSize(11).fillColor(COLORS.white).font("Helvetica-Bold").text(prizes[i].amount, px, y + 18, { width: prizeColW, align: "center" });
  }
  y += 46;

  // ── FOOTER ON ALL PAGES ──────────────────────────────────────────────────
  const totalPages = (doc as any).bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    // Two-line footer: certificate note + page info
    doc.rect(0, doc.page.height - 42, pageWidth, 42).fill(COLORS.primary);
    doc.fontSize(7).fillColor("#a5f3fc").font("Helvetica-Bold")
      .text(
        "🎓 All workshops provide a certified certificate of completion, co-signed by the organizing company and the Faculty of Science, Cairo University.",
        margin,
        doc.page.height - 38,
        { width: contentWidth, align: "center" }
      );
    doc.fontSize(7).fillColor(COLORS.white).font("Helvetica")
      .text(
        `SCI 2026 · Faculty of Science, Cairo University · April 7–8, 2026  |  Page ${i + 1} of ${totalPages}`,
        margin,
        doc.page.height - 16,
        { width: contentWidth, align: "center" }
      );
  }

  doc.end();
}
