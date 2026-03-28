import PDFDocument from "pdfkit";
import { Response } from "express";
import { db } from "./db.js";
import { keynoteSpeakers as keynoteSpeakersTable } from "../drizzle/schema.js";
import { asc } from "drizzle-orm";
import https from "https";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from "sharp";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Download a remote image URL into a Buffer, following redirects */
function fetchImageBuffer(url: string, redirects = 5): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/*,*/*" } },
      (res) => {
        // Follow redirects
        if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location && redirects > 0) {
          const redirectUrl = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          res.resume();
          fetchImageBuffer(redirectUrl, redirects - 1).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

/** Compress an image buffer to a small JPEG thumbnail (max 60x60 px) for PDF embedding.
 * Returns null if the buffer is not a valid image. */
async function compressForPDF(buf: Buffer): Promise<Buffer | null> {
  try {
    // Validate it's a real image first
    await sharp(buf).metadata();
    return await sharp(buf)
      .resize(60, 60, { fit: "cover", position: "centre" })
      .jpeg({ quality: 75 })
      .toBuffer();
  } catch {
    return null; // not a valid image
  }
}

/** Resolve a photo URL to a Buffer (handles remote URLs, local paths, and base64 data URIs) */
async function resolvePhoto(photoUrl: string | null): Promise<Buffer | null> {
  if (!photoUrl) return null;
  try {
    // Handle base64 data URIs
    if (photoUrl.startsWith("data:")) {
      const base64Match = photoUrl.match(/^data:[^;]+;base64,(.+)$/);
      if (base64Match) {
        return Buffer.from(base64Match[1], "base64");
      }
      return null;
    }
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return await fetchImageBuffer(photoUrl);
    }
    const localPath = path.join(
      __dirname,
      "..",
      "client",
      "public",
      photoUrl.startsWith("/") ? photoUrl.slice(1) : photoUrl
    );
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    return null;
  } catch {
    return null;
  }
}

// ─── COLORS ──────────────────────────────────────────────────────────────────
const COLORS = {
  primary:          "#1a3a5c",
  secondary:        "#c8a84b",
  keynote:          "#1e40af",
  parallel:         "#4338ca",
  panel:            "#7c3aed",
  break:            "#d97706",
  closing:          "#059669",
  registration:     "#475569",
  opening:          "#065f46",
  poster:           "#be185d",
  lightGray:        "#f1f5f9",
  midGray:          "#94a3b8",
  darkText:         "#1e293b",
  white:            "#ffffff",
  plenaryBg:        "#fdf6e3",
  plenaryAccent:    "#c8a84b",
  participantBg:    "#eef2f7",
  participantAccent:"#94a3b8",
};

// ─── SPEAKER DATA ─────────────────────────────────────────────────────────────

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
    talk: "Karstology: Promising Setting for Industrial Raw Materials",
    day: 2,
  },
  {
    name: "Prof. Dr. Hamed A. Ead",
    affiliation: "Professor of Chemistry, Faculty of Science, Cairo University",
    talk: "Science at the Core of Innovation: Reimagining the University-Industry Nexus for Transformative Impact",
    day: 2,
  },
];

// Day 1 — Hall A (9 plenary speakers)
const invitedBioDay1 = [
  { name: "Prof. Dr. Sohair Ramadan Fahmy",     talk: "Practical Aspects of Experimental Design in Laboratory Animal Science" },
  { name: "Prof. Dr. Nagwa El-Badri",            talk: "Biomimetic Scaffolds and the Human Amniotic Membrane" },
  { name: "Prof. Dr. Ibrahim M. El-Sherbiny",    talk: "Basic Sciences As the Foundation of Innovation: Some Success Stories for Disease Treatment and Advanced Biomedical Applications" },
  { name: "Prof. Dr. Khalid Muhammad Taalab",    talk: "Radiopharmaceuticals and Precision Medicine" },
  { name: "Prof. Dr. Osama Azmy",                talk: "Management of the Rosy Years of Life" },
  { name: "Prof. Dr. Adel Khalil",               talk: "Bridging the Lab-to-Market Gap: Resolving Integration Challenges in Therapeutic and Diagnostic Innovation" },
  { name: "Prof. Dr. Korany A. Ali",             talk: "The Role of R&D Centers in Promoting Active Pharmaceutical Ingredients (APIs)" },
  { name: "Prof. Dr. Abdelfattah Kamal",         talk: "Achieving Quality and Sustainable Local Vaccine Production in Africa" },
  { name: "Prof. Dr. Ahmed Hegazy",              talk: "Policies and Diplomacy of Basic Scientific Research for Societal Development" },
];

// Day 1 — Hall B (9 plenary speakers)
const invitedGeoDay1 = [
  { name: "Prof. Dr. Osama Shalabiea",           talk: "Space Science and Technology (SSAT): Exploration, Utilization and Commercialization" },
  { name: "Prof. Dr. Mahmoud Ibrahim Nasr",      talk: "Egyptian Iron Ore as a Feedstock to the Iron and Steel Industry" },
  { name: "Prof. Dr. Mohamed Ibrahim El-Anbawy", talk: "Economic Utilization of Shale in Desert Land Reclamation and Cement Industry" },
  { name: "Dr. Sahar Hassan",                    talk: "Revolutionizing Subsurface Understanding: AI-Driven Logging-While-Drilling Technologies" },
  { name: "Dr. Ahmad Wafik Al Shareif",          talk: "Detection of Low Contrast, Low Resistivity Pay (LCLR) Challenge in Shaly Sand Gas Reservoir" },
  { name: "Prof. Dr. Ashraf Abdou Tabll",        talk: "Current Status and Future Prospects of Medical Biotechnology in Egypt" },
  { name: "Dr. Areeg Abdalla",                   talk: "Scientific Principles and Medical Applications of Artificial Intelligence" },
  { name: "Eng. Mostafa Nasser",                 talk: "AI in Biotechnology" },
  { name: "Prof. Dr. Mohamed Shaker",            talk: "Silicon Nanophotonics for On-Chip Integrated Circuit Technology" },
];

// Day 2 — Hall A (9 plenary speakers)
const invitedBioDay2 = [
  { name: "Prof. Dr. Ashraf Abdou Tabll",        talk: "Current Status and Future Prospects of Medical Biotechnology in Egypt: Lessons from Monoclonal and IgY Antibodies" },
  { name: "Prof. Dr. Rashika El Ridi",           talk: "The Impact of Misleading Concepts in Science on Efforts to Control Schistosomiasis and Cancer" },
  { name: "Prof. Dr. Ebtehal El-Demerdash",      talk: "When Pharmacometrics meets AI: Shaping the future of therapeutics" },
  { name: "Prof. Dr. Nashwa El-Khazragy",        talk: "" },
  { name: "Dr. Mohamed Anwar",                   talk: "From Molecules to Taste: The Role of Organic Chemistry in Flavor Manufacturing" },
  { name: "Assoc. Prof. Dr. Mohamed Hamed",      talk: "Computational Transformation in Drug Discovery: Bioinformatics and AI Innovations in Pharmaceutical Science" },
  { name: "Prof. Dr. Mohamed Abdel Gawad",       talk: "Metabolic Mastery: Engineering the PETase-MHETase Synergistic Consortium for a Circular Plastic Economy" },
  { name: "Prof. Dr. Ayman El-Shibiny",          talk: "Phage Innovation: Targeted Solutions for Regional Antimicrobial Challenges" },
  { name: "Dr. Ahmed Fikry El-Sayed",            talk: "Computer-Aided Drug Design: From Code to Cure" },
];

// Day 2 — Hall B (9 plenary speakers)
const invitedGeoDay2 = [
  { name: "Prof. Dr. Osama Shalabiea",           talk: "Space Science and Technology (SSAT): Exploration, Utilization and Commercialization" },
  { name: "Dr. Areeg Abdalla",                   talk: "Scientific Principles and Medical Applications of Artificial Intelligence" },
  { name: "Prof. Dr. Naglaa A. Abdallah",        talk: "Novel Genome Editing Approaches for a Sustainable Future" },
  { name: "Prof. em. Tarek Kapiel",              talk: "Integrative Bio-Nanotechnologies for Industrial Symbiosis: Scaling the Circular Bioeconomy in Egypt" },
  { name: "Mr. Ahmed Youssef",                   talk: "Advanced Vaccine Bioprocessing: From Strain Selection to Market Release" },
  { name: "Prof. Dr. Nagwa El-Badri",            talk: "Biomimetic Scaffolds and the Human Amniotic Membrane" },
  { name: "Prof. Dr. Abdel Rahman Bader",        talk: "" },
  { name: "Prof. Dr. Reda Salem",                talk: "Recombinant Technologies in Poultry Vaccine Development: From Molecular Design to Industrial Application" },
  { name: "Dr. Walaa Abbas El-Sayed Omar",       talk: "" },
];

// ─── SESSION TYPES ────────────────────────────────────────────────────────────
interface DaySession {
  time: string;
  type: string;
  title: string;
  location?: string;
  description?: string;
  speaker?: { name: string; affiliation: string; talk: string };
  tracks?: { hall: string; speaker: string; speakerTalk: string; topic: string; isPlenary?: boolean }[];
  workshops?: { room: string; name: string }[];
}

// ─── DAY 1 SESSIONS ───────────────────────────────────────────────────────────
const day1Sessions: DaySession[] = [
  { time: "08:30 - 09:30", type: "registration", title: "Arrival & Registration",           location: "Conference Hall Entrance",        description: "Welcome and registration for all conference participants" },
  { time: "09:30 - 10:00", type: "opening",      title: "Welcome Talk",                     location: "Hall A (Connected to all halls)", description: "Opening ceremony with welcome addresses from university leadership" },
  { time: "10:00 - 10:30", type: "opening",      title: "Opening Remarks (Continued)",      location: "Hall A (Connected to all halls)", description: "Continued opening ceremony" },
  { time: "10:30 - 10:50", type: "keynote",      title: "Plenary Speaker 1",                location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[0] },
  { time: "10:50 - 11:10", type: "keynote",      title: "Plenary Speaker 2",                location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[1] },
  { time: "11:10 - 11:30", type: "panel",        title: "Discussion Panel",                 location: "All Halls",                      description: "Interactive discussion following plenary presentations" },
  {
    time: "11:30 - 11:50", type: "parallel", title: "Parallel Sessions - Round 1",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[0].name, speakerTalk: invitedBioDay1[0].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[0].name, speakerTalk: invitedGeoDay1[0].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Room 1", name: "MARC Workshop" },
      { room: "Workshop Room 2", name: "From DNA to Proteins: Advanced Sequencing Technologies (Nawah)" },
    ],
  },
  {
    time: "11:50 - 12:10", type: "parallel", title: "Parallel Sessions - Round 2",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[1].name, speakerTalk: invitedBioDay1[1].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[1].name, speakerTalk: invitedGeoDay1[1].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Room 1", name: "MARC Workshop (Cont.)" },
      { room: "Workshop Room 2", name: "Advanced Sequencing Technologies (Cont.)" },
    ],
  },
  {
    time: "12:10 - 12:30", type: "parallel", title: "Parallel Sessions - Round 3",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[2].name, speakerTalk: invitedBioDay1[2].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[2].name, speakerTalk: invitedGeoDay1[2].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Room 1", name: "MARC Workshop (Cont.)" },
    ],
  },
  {
    time: "12:30 - 12:50", type: "parallel", title: "Parallel Sessions - Round 4",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[3].name, speakerTalk: invitedBioDay1[3].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[3].name, speakerTalk: invitedGeoDay1[3].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Geology, Physics & other sciences", isPlenary: false },
    ],
    workshops: [],
  },
  { time: "12:50 - 13:10", type: "panel",  title: "Discussion Panels",    location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "13:10 - 13:45", type: "break",  title: "Coffee Break",         location: "Conference Foyer",       description: "Coffee break and networking opportunity" },
  {
    time: "13:45 - 14:05", type: "parallel", title: "Parallel Sessions - Round 5",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[4].name, speakerTalk: invitedBioDay1[4].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[4].name, speakerTalk: invitedGeoDay1[4].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "1:45 Sami Ayed Group | 1:55 Startup Grind", speakerTalk: "", topic: "Industry & Startup Presentations", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "14:05 - 14:25", type: "parallel", title: "Parallel Sessions - Round 6",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[5].name, speakerTalk: invitedBioDay1[5].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[5].name, speakerTalk: invitedGeoDay1[5].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "2:05 Agitech | 2:15 Chitosan", speakerTalk: "", topic: "Industry Presentations", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "14:25 - 14:45", type: "parallel", title: "Parallel Sessions - Round 7",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[6].name, speakerTalk: invitedBioDay1[6].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[6].name, speakerTalk: invitedGeoDay1[6].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Poster & Booth Exhibition", speakerTalk: "", topic: "Poster & Booth Exhibition", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "14:45 - 15:05", type: "parallel", title: "Parallel Sessions - Round 8",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[7].name, speakerTalk: invitedBioDay1[7].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[7].name, speakerTalk: invitedGeoDay1[7].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Poster & Booth Exhibition", speakerTalk: "", topic: "Poster & Booth Exhibition", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "15:05 - 15:25", type: "parallel", title: "Parallel Sessions - Round 9",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay1[8].name, speakerTalk: invitedBioDay1[8].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay1[8].name, speakerTalk: invitedGeoDay1[8].talk, topic: "Geology, Physics & other sciences", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Poster & Booth Exhibition", speakerTalk: "", topic: "Poster & Booth Exhibition", isPlenary: false },
    ],
    workshops: [],
  },
  { time: "15:25 - 15:45", type: "panel",  title: "Discussion Panels",                             location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "15:45 - 16:00", type: "closing", title: "Issuing Workshop Attendance Certificates - Day 1", location: "Main Hall",             description: "Distribution of participation certificates for Day 1 attendees" },
];

// ─── DAY 2 SESSIONS ───────────────────────────────────────────────────────────
const day2Sessions: DaySession[] = [
  { time: "08:30 - 09:15", type: "registration", title: "Arrival & Registration",    location: "Conference Hall Entrance",       description: "Registration for Day 2 participants" },
  { time: "09:15 - 09:35", type: "keynote",      title: "Plenary Speaker 3",         location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[2] },
  { time: "09:35 - 09:55", type: "keynote",      title: "Plenary Speaker 4",         location: "Hall A (Connected to all halls)", speaker: keynoteSpeakers[3] },
  { time: "09:55 - 10:15", type: "panel",        title: "Discussion Panel",          location: "All Halls",                      description: "Interactive discussion following plenary presentations" },
  {
    time: "10:15 - 10:35", type: "parallel", title: "Parallel Sessions - Round 1",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[0].name, speakerTalk: invitedBioDay2[0].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay2[0].name, speakerTalk: invitedGeoDay2[0].talk, topic: "Astrophysics, Mathematics & other disciplines", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop" },
      { room: "Bioinformatics Room",  name: "Bioinformatics Workshop - Dr. Dina Amr (09:35-12:15)" },
    ],
  },
  {
    time: "10:35 - 10:55", type: "parallel", title: "Parallel Sessions - Round 2",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[1].name, speakerTalk: invitedBioDay2[1].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay2[1].name, speakerTalk: invitedGeoDay2[1].talk, topic: "Mathematics & other disciplines", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Special Session: Differential Geometry", speakerTalk: "", topic: "Hall D - Special Session", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop (Cont.)" },
      { room: "Bioinformatics Room",  name: "Bioinformatics Workshop - Dr. Dina Amr (Cont.)" },
    ],
  },
  {
    time: "10:55 - 11:15", type: "parallel", title: "Parallel Sessions - Round 3",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[2].name, speakerTalk: invitedBioDay2[2].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Special Session: Differential Geometry (Cont.)", speakerTalk: "", topic: "Hall D - Special Session", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop (Cont.)" },
      { room: "Bioinformatics Room",  name: "Bioinformatics Workshop - Dr. Dina Amr (Cont.)" },
    ],
  },
  {
    time: "11:15 - 11:35", type: "parallel", title: "Parallel Sessions - Round 4",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[3].name, speakerTalk: invitedBioDay2[3].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Special Session: Differential Geometry (Cont.)", speakerTalk: "", topic: "Hall D - Special Session", isPlenary: false },
    ],
    workshops: [
      { room: "Workshop Rooms 1 & 2", name: "Nawah Scientific Workshop (Cont.)" },
      { room: "Bioinformatics Room",  name: "Bioinformatics Workshop - Dr. Dina Amr (Cont.)" },
    ],
  },
  {
    time: "11:35 - 11:55", type: "parallel", title: "Parallel Sessions - Round 5",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[4].name, speakerTalk: invitedBioDay2[4].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Special Session: Differential Geometry (Cont.)", speakerTalk: "", topic: "Hall D - Special Session", isPlenary: false },
    ],
    workshops: [
      { room: "Bioinformatics Room", name: "Bioinformatics Workshop - Dr. Dina Amr (Cont.)" },
    ],
  },
  { time: "11:55 - 12:15", type: "panel",  title: "Discussion Panels",                    location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "12:15 - 13:30", type: "break",  title: "Coffee Break & Poster Session",         location: "Conference Foyer",       description: "Lunch break, poster session and networking" },
  {
    time: "13:30 - 13:50", type: "parallel", title: "Parallel Sessions - Round 6",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[5].name, speakerTalk: invitedBioDay2[5].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay2[5].name, speakerTalk: invitedGeoDay2[5].talk, topic: "Astrophysics, Mathematics & other disciplines", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "13:50 - 14:10", type: "parallel", title: "Parallel Sessions - Round 7",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[6].name, speakerTalk: invitedBioDay2[6].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay2[6].name, speakerTalk: invitedGeoDay2[6].talk, topic: "Astrophysics, Mathematics & other disciplines", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "14:10 - 14:30", type: "parallel", title: "Parallel Sessions - Round 8",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[7].name, speakerTalk: invitedBioDay2[7].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay2[7].name, speakerTalk: invitedGeoDay2[7].talk, topic: "Astrophysics, Mathematics & other disciplines", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
    ],
    workshops: [],
  },
  {
    time: "14:30 - 14:50", type: "parallel", title: "Parallel Sessions - Round 9",
    tracks: [
      { hall: "Hall A", speaker: invitedBioDay2[8].name, speakerTalk: invitedBioDay2[8].talk, topic: "Biological & Chemical Sciences", isPlenary: true },
      { hall: "Hall B", speaker: invitedGeoDay2[8].name, speakerTalk: invitedGeoDay2[8].talk, topic: "Astrophysics, Mathematics & other disciplines", isPlenary: true },
      { hall: "Hall C", speaker: "Participant Presentations", speakerTalk: "", topic: "Biological & Chemical Sciences", isPlenary: false },
      { hall: "Hall D", speaker: "Participant Presentations", speakerTalk: "", topic: "Other Sciences", isPlenary: false },
    ],
    workshops: [],
  },
  { time: "14:50 - 15:10", type: "panel",  title: "Discussion Panels",                        location: "All Halls (A, B, C, D)", description: "Parallel discussion panels in all conference halls" },
  { time: "15:10 - 16:30", type: "closing", title: "Conference Closure & Awards Ceremony",     location: "Main Hall",             description: "Closing ceremony with appreciation and announcement of Best Project, Poster and Presentation Awards" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function sessionTypeColor(type: string): string {
  const map: Record<string, string> = {
    registration: COLORS.registration,
    opening:      COLORS.opening,
    keynote:      COLORS.keynote,
    panel:        COLORS.panel,
    break:        COLORS.break,
    parallel:     COLORS.parallel,
    poster:       COLORS.poster,
    closing:      COLORS.closing,
  };
  return map[type] ?? COLORS.midGray;
}

type PhotoDrawer = (doc: PDFKit.PDFDocument, name: string, cx: number, cy: number, r: number, color: string) => void;

function drawSessionBlock(
  doc: PDFKit.PDFDocument,
  session: DaySession,
  y: number,
  pageWidth: number,
  margin: number,
  drawPhoto?: PhotoDrawer
): number {
  const contentWidth = pageWidth - margin * 2;
  const typeColor = sessionTypeColor(session.type);

  // Estimate height
  let estimatedHeight = 30;
  if (session.description) estimatedHeight += 12;
  if (session.location) estimatedHeight += 12;
  if (session.speaker) estimatedHeight += 46;
  if (session.tracks) {
    const plenary = session.tracks.filter(t => t.isPlenary);
    const participants = session.tracks.filter(t => !t.isPlenary);
    estimatedHeight += plenary.length * (plenary.some(t => t.speakerTalk) ? 50 : 28) + 20;
    estimatedHeight += participants.length * 22 + 14;
  }
  if (session.workshops) estimatedHeight += session.workshops.length * 14 + 16;
  estimatedHeight += 8;

  if (y + estimatedHeight > doc.page.height - 60) {
    doc.addPage();
    y = 50;
  }

  doc.rect(margin, y, 4, estimatedHeight).fill(typeColor);
  doc.rect(margin + 4, y, contentWidth - 4, estimatedHeight).fill(COLORS.lightGray);

  let textY = y + 8;
  const textX = margin + 14;
  const textMaxWidth = contentWidth - 20;

  doc.fontSize(8).fillColor(typeColor).font("Helvetica-Bold").text(session.time, textX, textY);
  doc.fontSize(8).fillColor(COLORS.midGray).font("Helvetica")
    .text(` - ${session.type.toUpperCase()}`, textX + doc.widthOfString(session.time) + 2, textY);
  textY += 13;

  doc.fontSize(10).fillColor(COLORS.darkText).font("Helvetica-Bold")
    .text(session.title, textX, textY, { width: textMaxWidth });
  textY += 13;

  if (session.location) {
    doc.fontSize(8).fillColor(COLORS.midGray).font("Helvetica")
      .text(`Location: ${session.location}`, textX, textY, { width: textMaxWidth });
    textY += 11;
  }

  if (session.description) {
    doc.fontSize(8).fillColor(COLORS.darkText).font("Helvetica")
      .text(session.description, textX, textY, { width: textMaxWidth });
    textY += 11;
  }

  if (session.speaker) {
    textY += 4;
    doc.rect(textX, textY, textMaxWidth - 4, 1).fill(typeColor);
    textY += 5;
    doc.fontSize(8).fillColor(COLORS.plenaryAccent).font("Helvetica-Bold").text("PLENARY SPEAKER", textX, textY);
    textY += 11;
    doc.fontSize(9).fillColor(COLORS.darkText).font("Helvetica-Bold")
      .text(session.speaker.name, textX, textY, { width: textMaxWidth });
    textY += 11;
    doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica")
      .text(session.speaker.affiliation, textX, textY, { width: textMaxWidth });
    textY += 11;
    if (session.speaker.talk) {
      doc.fontSize(8).fillColor(typeColor).font("Helvetica-Oblique")
        .text(`"${session.speaker.talk}"`, textX, textY, { width: textMaxWidth });
      textY += 12;
    }
  }

  if (session.tracks) {
    const plenaryTracks = session.tracks.filter(t => t.isPlenary);
    const participantTracks = session.tracks.filter(t => !t.isPlenary);

    if (plenaryTracks.length > 0) {
      textY += 4;
      doc.fontSize(8).fillColor(COLORS.plenaryAccent).font("Helvetica-Bold").text("PLENARY SPEAKERS:", textX, textY);
      textY += 11;
      for (const track of plenaryTracks) {
        const rowH = track.speakerTalk ? 50 : 28;
        doc.rect(textX, textY, textMaxWidth - 4, rowH).fill(COLORS.plenaryBg);
        doc.rect(textX, textY, 3, rowH).fill(COLORS.plenaryAccent);
        // Small circular photo (radius 11) at the left
        const pR = 11;
        const pCx = textX + 3 + pR + 4;
        const pCy = textY + rowH / 2;
        if (drawPhoto) {
          drawPhoto(doc, track.speaker, pCx, pCy, pR, COLORS.plenaryAccent);
        }
        const nameX = pCx + pR + 5;
        doc.fontSize(7).fillColor(COLORS.plenaryAccent).font("Helvetica-Bold").text(track.hall, nameX, textY + 5);
        const hallW = doc.widthOfString(track.hall);
        doc.fontSize(9).fillColor(COLORS.darkText).font("Helvetica-Bold")
          .text(track.speaker, nameX + hallW + 4, textY + 4, { width: textMaxWidth - (nameX - textX) - 90 });
        const badgeX = textX + textMaxWidth - 88;
        doc.rect(badgeX, textY + 4, 80, 12).fill(COLORS.plenaryAccent);
        doc.fontSize(6.5).fillColor(COLORS.white).font("Helvetica-Bold")
          .text("PLENARY SPEAKER", badgeX + 2, textY + 6, { width: 76, align: "center" });
        if (track.speakerTalk) {
          doc.fontSize(7.5).fillColor(COLORS.primary).font("Helvetica-Oblique")
            .text(`"${track.speakerTalk}"`, nameX, textY + 22, { width: textMaxWidth - (nameX - textX) - 4 });
        }
        textY += rowH + 4;
      }
    }

    if (participantTracks.length > 0) {
      textY += 3;
      doc.fontSize(7).fillColor(COLORS.midGray).font("Helvetica-Bold").text("PARTICIPANT PRESENTATIONS:", textX, textY);
      textY += 9;
      for (const track of participantTracks) {
        const rowH = 18;
        doc.rect(textX, textY, textMaxWidth - 4, rowH).fill(COLORS.participantBg);
        doc.rect(textX, textY, 3, rowH).fill(COLORS.participantAccent);
        doc.fontSize(7).fillColor(COLORS.midGray).font("Helvetica-Bold").text(track.hall, textX + 7, textY + 5);
        const hallW2 = doc.widthOfString(track.hall);
        doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica")
          .text(track.topic || "Participant Presentations", textX + 7 + hallW2 + 5, textY + 5, { width: textMaxWidth - 30 });
        textY += rowH + 3;
      }
    }
  }

  if (session.workshops && session.workshops.length > 0) {
    textY += 4;
    doc.fontSize(7.5).fillColor(COLORS.break).font("Helvetica-Bold").text("WORKSHOPS:", textX, textY);
    textY += 10;
    for (const ws of session.workshops) {
      doc.fontSize(7.5).fillColor(COLORS.darkText).font("Helvetica")
        .text(`${ws.room}: ${ws.name}`, textX + 4, textY, { width: textMaxWidth - 4 });
      textY += 10;
    }
  }

  return y + estimatedHeight + 6;
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export async function generateSchedulePDF(res: Response): Promise<void> {
  // ── Fetch speaker photos from DB ─────────────────────────────────────────
  // Build a name -> photo buffer map for all speakers
  // Uses fuzzy matching: strip titles and compare last name tokens
  const speakerPhotoMap = new Map<string, Buffer | null>();

  /** Strip common academic/military titles and normalize a name for comparison */
  function normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\b(prof\.?|dr\.?|major\s+general|eng\.?|mr\.?|ms\.?|mrs\.?|assoc\.?|em\.?|prof\s+em\.?|prof\.?\s+dr\.?)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Get photo buffer by speaker name with fuzzy matching */
  function getPhotoForSpeaker(pdfName: string): Buffer | null {
    // Exact match first
    const exact = speakerPhotoMap.get(pdfName);
    if (exact !== undefined) return exact;
    // Normalized match
    const normPdf = normalizeName(pdfName);
    for (const [dbName, buf] of speakerPhotoMap) {
      const normDb = normalizeName(dbName);
      if (normDb === normPdf) return buf;
      // Check if all tokens of the shorter name appear in the longer name
      const tokPdf = normPdf.split(" ").filter(Boolean);
      const tokDb = normDb.split(" ").filter(Boolean);
      const shorter = tokPdf.length <= tokDb.length ? tokPdf : tokDb;
      const longer = tokPdf.length <= tokDb.length ? tokDb : tokPdf;
      if (shorter.length >= 2 && shorter.every(t => longer.includes(t))) return buf;
    }
    return null;
  }

  try {
    const dbSpeakers = await db
      .select()
      .from(keynoteSpeakersTable)
      .orderBy(asc(keynoteSpeakersTable.displayOrder));
    await Promise.all(
      dbSpeakers.map(async (spk) => {
        const key = spk.fullName.trim();
        try {
          const rawBuf = await Promise.race([
            resolvePhoto(spk.photoUrl ?? null),
            new Promise<null>((r) => setTimeout(() => r(null), 5000)),
          ]);
          const buf = rawBuf ? await compressForPDF(rawBuf as Buffer) : null;
          speakerPhotoMap.set(key, buf ?? null);
        } catch {
          speakerPhotoMap.set(key, null);
        }
      })
    );
  } catch {
    // DB unavailable — proceed without photos
  }

  /** Draw a small circular photo (or coloured placeholder) next to a speaker name */
  function drawSpeakerPhoto(
    doc: PDFKit.PDFDocument,
    speakerName: string,
    cx: number,
    cy: number,
    radius: number,
    accentColor: string
  ) {
    const buf = getPhotoForSpeaker(speakerName);
    if (buf) {
      try {
        doc.save();
        doc.circle(cx, cy, radius).clip();
        doc.image(buf, cx - radius, cy - radius, { width: radius * 2, height: radius * 2 });
        doc.restore();
        // Thin ring
        doc.circle(cx, cy, radius).lineWidth(0.8).stroke(accentColor);
        return;
      } catch { /* fall through to placeholder */ }
    }
    // Placeholder: filled circle with initial
    doc.circle(cx, cy, radius).fill(accentColor);
    const initial = speakerName.charAt(0).toUpperCase();
    doc.fontSize(radius * 0.9).fillColor("#ffffff").font("Helvetica-Bold")
      .text(initial, cx - radius, cy - radius * 0.6, { width: radius * 2, align: "center" });
  }

  const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="SCI2026-Conference-Program.pdf"');
  doc.pipe(res);

  const pageWidth  = doc.page.width;
  const pageHeight = doc.page.height;
  const margin     = 40;
  const contentWidth = pageWidth - margin * 2;

  // ── COVER PAGE ────────────────────────────────────────────────────────────
  doc.rect(0, 0, pageWidth, pageHeight).fill("#0f2744");
  doc.rect(0, pageHeight * 0.58, pageWidth, pageHeight * 0.42).fill("#0a1a2e");

  doc.rect(margin, 55, contentWidth, 5).fill(COLORS.secondary);

  doc.fontSize(10).fillColor(COLORS.secondary).font("Helvetica-Bold")
    .text("FACULTY OF SCIENCE - CAIRO UNIVERSITY", margin, 72, { width: contentWidth, align: "center" });

  doc.fontSize(38).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("SCI 2026", margin, 100, { width: contentWidth, align: "center" });

  doc.fontSize(15).fillColor(COLORS.secondary).font("Helvetica-Bold")
    .text("Science at the Core of Innovation", margin, 150, { width: contentWidth, align: "center" });

  doc.fontSize(10).fillColor("#c8d8e8").font("Helvetica")
    .text("Building Effective Partnerships between Universities and Industry", margin, 174, { width: contentWidth, align: "center" });

  doc.rect(margin, 200, contentWidth, 2).fill(COLORS.secondary);

  doc.fontSize(13).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("CONFERENCE PROGRAM", margin, 212, { width: contentWidth, align: "center" });

  doc.fontSize(11).fillColor("#c8d8e8").font("Helvetica")
    .text("April 7-8, 2026  |  University Hostel, Cairo University", margin, 232, { width: contentWidth, align: "center" });

  // ── All speakers grid on cover (2-column, all treated equally as plenary) ──
  let ky = 262;
  doc.fontSize(10).fillColor(COLORS.secondary).font("Helvetica-Bold")
    .text("PLENARY SPEAKERS", margin, ky, { width: contentWidth, align: "center" });
  doc.rect(margin, ky + 14, contentWidth, 1).fill(COLORS.secondary);
  ky += 22;

  // Build a flat list of all unique speakers from all sessions (DB order)
  // Use the DB speakers list (already fetched into speakerPhotoMap)
  // Collect all unique speaker names from the session data
  const allSpeakerNames: string[] = [];
  const seenNames = new Set<string>();
  // Gather from all session arrays in display order
  const allSessionSpeakers = [
    ...keynoteSpeakers.map(k => ({ name: k.name, affiliation: k.affiliation })),
    ...invitedBioDay1.map(s => ({ name: s.name, affiliation: "" })),
    ...invitedGeoDay1.map(s => ({ name: s.name, affiliation: "" })),
    ...invitedBioDay2.map(s => ({ name: s.name, affiliation: "" })),
    ...invitedGeoDay2.map(s => ({ name: s.name, affiliation: "" })),
  ];
  // Also pull affiliation from DB map (using fuzzy matching for PDF names)
  /** Fuzzy lookup of DB affiliation by PDF speaker name */
  function getAffiliationForSpeaker(pdfName: string): string {
    const normPdf = normalizeName(pdfName);
    const tokPdf = normPdf.split(" ").filter(Boolean);
    let bestMatch = "";
    for (const sp of dbSpeakerInfoList) {
      const normDb = normalizeName(sp.fullName);
      if (normDb === normPdf) return sp.affiliation;
      const tokDb = normDb.split(" ").filter(Boolean);
      const shorter = tokPdf.length <= tokDb.length ? tokPdf : tokDb;
      const longer  = tokPdf.length <= tokDb.length ? tokDb  : tokPdf;
      if (shorter.length >= 2 && shorter.every(t => longer.includes(t))) {
        bestMatch = sp.affiliation;
      }
    }
    return bestMatch;
  }

  const dbSpeakerInfoList: { fullName: string; affiliation: string }[] = [];
  try {
    const dbList = await db.select().from(keynoteSpeakersTable).orderBy(asc(keynoteSpeakersTable.displayOrder));
    for (const sp of dbList) {
      dbSpeakerInfoList.push({ fullName: sp.fullName.trim(), affiliation: sp.affiliation ?? "" });
    }
  } catch { /* ignore */ }

  for (const sp of allSessionSpeakers) {
    const norm = sp.name.trim();
    if (!seenNames.has(norm)) {
      seenNames.add(norm);
      allSpeakerNames.push(norm);
    }
  }

  // 2-column layout — each row is 32px tall
  const colW = (contentWidth - 6) / 2;
  const rowH = 32;
  const photoR = 13;
  let col = 0;
  let rowStart = ky;

  for (const spName of allSpeakerNames) {
    const colX = margin + col * (colW + 6);
    const affiliation = getAffiliationForSpeaker(spName);

    doc.rect(colX, rowStart, colW, rowH).fill("rgba(255,255,255,0.05)");
    doc.rect(colX, rowStart, 3, rowH).fill(COLORS.secondary);

    const photoCx = colX + 3 + photoR + 5;
    const photoCy = rowStart + rowH / 2;
    drawSpeakerPhoto(doc, spName, photoCx, photoCy, photoR, COLORS.secondary);

    const textX = photoCx + photoR + 5;
    const textW2 = colW - (textX - colX) - 4;
    // Strip titles from display name for cleaner look
    const displayName = spName
      .replace(/^(Major General |Assoc\. Prof\. |Prof\. Dr\. |Prof\. |Dr\. |Eng\. |Mr\. |Ms\. |Mrs\. |Prof em\. )/i, "")
      .trim();
    doc.fontSize(7.5).fillColor(COLORS.white).font("Helvetica-Bold")
      .text(displayName, textX, rowStart + 5, { width: textW2, lineBreak: false, ellipsis: true });
    if (affiliation) {
      // Truncate affiliation to first clause for brevity
      const shortAff = affiliation.split(/[,;]/)[0].trim();
      doc.fontSize(6).fillColor("#7a9bb8").font("Helvetica")
        .text(shortAff, textX, rowStart + 17, { width: textW2, lineBreak: false, ellipsis: true });
    }

    col++;
    if (col === 2) {
      col = 0;
      rowStart += rowH + 2;
      // If we're running out of space on the cover, stop
      if (rowStart + rowH > pageHeight - 55) break;
    }
  }
  // If last row had only 1 column, advance rowStart
  if (col === 1) rowStart += rowH + 2;

  doc.rect(0, pageHeight - 38, pageWidth, 38).fill("#071120");
  doc.fontSize(8).fillColor(COLORS.secondary).font("Helvetica-Bold")
    .text("sciconf26.website", margin, pageHeight - 24, { width: contentWidth, align: "center" });

  // ── DAY 1 ─────────────────────────────────────────────────────────────────
  doc.addPage();
  let y = 50;

  doc.rect(0, 0, pageWidth, 36).fill(COLORS.primary);
  doc.fontSize(13).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Day 1 - Tuesday, April 7, 2026", margin, 10, { width: contentWidth });
  doc.fontSize(9).fillColor(COLORS.secondary).font("Helvetica")
    .text("University Hostel, Faculty of Science, Cairo University", margin, 24, { width: contentWidth });
  y = 48;

  for (const session of day1Sessions) {
    y = drawSessionBlock(doc, session, y, pageWidth, margin, drawSpeakerPhoto);
  }

  // ── DAY 2 ─────────────────────────────────────────────────────────────────
  doc.addPage();
  y = 50;

  doc.rect(0, 0, pageWidth, 36).fill(COLORS.primary);
  doc.fontSize(13).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Day 2 - Wednesday, April 8, 2026", margin, 10, { width: contentWidth });
  doc.fontSize(9).fillColor(COLORS.secondary).font("Helvetica")
    .text("University Hostel, Faculty of Science, Cairo University", margin, 24, { width: contentWidth });
  y = 48;

  for (const session of day2Sessions) {
    y = drawSessionBlock(doc, session, y, pageWidth, margin, drawSpeakerPhoto);
  }

  // ── WORKSHOPS SECTION ─────────────────────────────────────────────────────
  doc.addPage();
  y = 50;
  doc.fontSize(14).fillColor(COLORS.primary).font("Helvetica-Bold").text("Workshop Program", margin, y);
  y += 16;
  doc.rect(margin, y, contentWidth, 2).fill(COLORS.secondary);
  y += 10;

  const workshopGroups = [
    {
      label: "Pre-Conference - April 6",
      color: COLORS.secondary,
      items: [
        { name: "Biotech Product Development 101", detail: "By Chitosan · 9:00 AM - 12:00 PM · 30 seats" },
        { name: "From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy", detail: "By Agitech · April 6, 12:00 PM - 2:00 PM · 20 seats" },
      ],
    },
    {
      label: "During Conference - April 7 (Day 1)",
      color: COLORS.parallel,
      items: [
        { name: "MARC Workshop", detail: "By MARC · Day 1 (April 7) · Workshop Rooms 1 & 2" },
        { name: "From DNA to Proteins: Advanced Sequencing Technologies", detail: "By Nawah Scientific · Day 1 (April 7) · Workshop Room 2" },
        { name: "Good Clinical Practice (GCP) Workshop", detail: "Day 1 (April 7)" },
      ],
    },
    {
      label: "During Conference - April 8 (Day 2)",
      color: COLORS.keynote,
      items: [
        { name: "Nawah Scientific Workshop", detail: "By Nawah Scientific · Day 2 (April 8) · Workshop Rooms 1 & 2" },
        { name: "Bioinformatics Workshop", detail: "By Dr. Dina Amr · Day 2 (April 8) · 09:35 - 12:15" },
        { name: "How to Convert Research Findings into Business Ideas", detail: "Day 2 (April 8)" },
      ],
    },
    {
      label: "Post-Conference - April 9",
      color: COLORS.closing,
      items: [
        { name: "Introduction to Single Cell Genomics", detail: "By EG-CompBio & GARN · April 9, 10:00 AM - 1:00 PM · 3 hours · 30 seats" },
        { name: "Integrating Genomics & Proteomics in Biopharmaceutical R&D", detail: "By HVD Life Sciences · FULLY BOOKED · HVD Company, New Cairo · 30 seats" },
        { name: "AI Meets Biotech", detail: "How to leverage AI in Biotechnology · 3 hours" },
        { name: "From Lab to Global Opportunities: Scholarships & Research Abroad", detail: "By GESR (Dr. Nourhan Hassan & Dr. Hazem Badawy) · April 9, 3:00 PM - 6:00 PM · Free" },
      ],
    },
    {
      label: "Post-Conference - April 12",
      color: COLORS.panel,
      items: [
        { name: "Metagenomics, Microbiome & 16S rRNA Sequencing", detail: "By Colors Educational Hub · April 12, 10:00 AM · Faculty of Science, Cairo University" },
      ],
    },
  ];

  for (const group of workshopGroups) {
    if (y > pageHeight - 60) { doc.addPage(); y = 50; }
    doc.rect(margin, y, contentWidth, 20).fill(group.color);
    doc.fontSize(9).fillColor(COLORS.white).font("Helvetica-Bold").text(group.label, margin + 8, y + 6);
    y += 24;
    for (const item of group.items) {
      if (y > pageHeight - 30) { doc.addPage(); y = 50; }
      doc.fontSize(8.5).fillColor(COLORS.darkText).font("Helvetica-Bold").text(item.name, margin + 8, y);
      y += 11;
      doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica").text(item.detail, margin + 12, y);
      y += 12;
    }
    y += 6;
  }

  doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica")
    .text("* Workshop fee: 200 EGP per workshop · Payment via InstaPay (CBE account: 9450882167) · Limited to 30 participants each", margin, y + 6, { width: contentWidth });

  // ── AWARDS SECTION ────────────────────────────────────────────────────────
  doc.addPage();
  y = 50;

  doc.rect(margin, y, contentWidth, 28).fill(COLORS.primary);
  doc.fontSize(14).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Conference Awards & Sponsor Prizes", margin, y + 8, { width: contentWidth, align: "center" });
  y += 36;

  const awardCategories = [
    { title: "Best Oral Presentation",        description: "Awarded to the most outstanding oral research presentation across all tracks" },
    { title: "Best Poster Presentation",      description: "Recognizing the most visually compelling and scientifically rigorous poster" },
    { title: "Best Graduation Project",       description: "Honoring the most innovative and impactful undergraduate graduation project" },
    { title: "Best Paper Award",              description: "Celebrating exceptional written research contributions" },
    { title: "Best Innovative Research Idea", description: "Sponsored by Medsol Corporation - Cash prizes for the most creative and impactful scientific ideas" },
  ];

  doc.fontSize(11).fillColor(COLORS.primary).font("Helvetica-Bold").text("General Award Categories", margin, y);
  y += 16;

  for (const award of awardCategories) {
    if (y > pageHeight - 60) { doc.addPage(); y = 50; }
    doc.rect(margin, y, 4, 26).fill(COLORS.secondary);
    doc.fontSize(9).fillColor(COLORS.darkText).font("Helvetica-Bold").text(award.title, margin + 10, y + 2, { width: contentWidth - 14 });
    y += 12;
    doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica").text(award.description, margin + 10, y, { width: contentWidth - 14 });
    y += 18;
  }
  y += 8;

  // Medsol prize boxes
  doc.rect(margin, y, contentWidth, 24).fill("#0d9488");
  doc.fontSize(11).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Medsol Corporation - Best Innovative Research Idea Award", margin, y + 7, { width: contentWidth, align: "center" });
  y += 30;

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

  // All sponsor awards
  if (y > pageHeight - 80) { doc.addPage(); y = 50; }
  doc.fontSize(11).fillColor(COLORS.primary).font("Helvetica-Bold").text("Sponsor Awards & Prizes", margin, y);
  y += 16;

  const sponsorAwards = [
    { sponsor: "Medsol Corporation",      prize: "Best Innovative Research Idea Award",                detail: "1st: 3,000 EGP | 2nd: 2,000 EGP | 3rd: 1,000 EGP" },
    { sponsor: "NAWAH Scientific",        prize: "Best Scientific Research Award",                     detail: "Cash prize for outstanding scientific research" },
    { sponsor: "MARC",                    prize: "Best Research Presentation Award",                   detail: "Recognizing excellence in research presentation" },
    { sponsor: "Mina Pharm",              prize: "Best Pharmaceutical Research Award",                 detail: "For outstanding pharmaceutical research" },
    { sponsor: "Agitech",                 prize: "Best Applied Science Award",                         detail: "For innovative applied science research" },
    { sponsor: "Startup Grind Cairo",     prize: "Best Startup Idea Award",                            detail: "For the most promising startup concept" },
    { sponsor: "Colors Educational Hub",  prize: "Best Bioinformatics Research Award",                 detail: "For outstanding bioinformatics research" },
    { sponsor: "Chitosan",                prize: "Best Biotech Innovation Award",                      detail: "For innovative biotechnology research" },
    { sponsor: "GEnoEra",                 prize: "Best Genomics Research Award",                       detail: "For outstanding genomics research" },
    { sponsor: "EgCompBio",               prize: "Best Computational Biology Award",                   detail: "For excellence in computational biology" },
    { sponsor: "Plasma",                  prize: "Best Physics & Materials Science Award",             detail: "For outstanding physics research" },
    { sponsor: "GESR",                    prize: "Best Scholarship & Research Abroad Initiative",      detail: "Recognizing global research impact" },
    { sponsor: "AI by Arabic",            prize: "Best AI Application in Science Award",               detail: "For innovative AI applications in scientific research" },
  ];

  for (const sa of sponsorAwards) {
    if (y > pageHeight - 50) { doc.addPage(); y = 50; }
    doc.rect(margin, y, contentWidth, 32).fill(COLORS.plenaryBg);
    doc.rect(margin, y, 4, 32).fill(COLORS.secondary);
    doc.fontSize(9).fillColor(COLORS.primary).font("Helvetica-Bold")
      .text(sa.prize, margin + 10, y + 3, { width: contentWidth - 120 });
    doc.fontSize(7.5).fillColor(COLORS.midGray).font("Helvetica")
      .text(`Sponsored by ${sa.sponsor}`, margin + 10, y + 14, { width: contentWidth - 120 });
    doc.fontSize(7).fillColor(COLORS.darkText).font("Helvetica")
      .text(sa.detail, margin + 10, y + 23, { width: contentWidth - 14 });
    y += 36;
  }

  // ── FOOTER ON ALL PAGES ───────────────────────────────────────────────────
  const totalPages = (doc as any).bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.rect(0, pageHeight - 42, pageWidth, 42).fill(COLORS.primary);
    doc.fontSize(7).fillColor("#a5f3fc").font("Helvetica-Bold")
      .text(
        "All workshops provide a certified certificate of completion, co-signed by the organizing company and the Faculty of Science, Cairo University.",
        margin, pageHeight - 38, { width: contentWidth, align: "center" }
      );
    doc.fontSize(7).fillColor(COLORS.white).font("Helvetica")
      .text(
        `SCI 2026  |  Faculty of Science, Cairo University  |  April 7-8, 2026  |  Page ${i + 1} of ${totalPages}`,
        margin, pageHeight - 16, { width: contentWidth, align: "center" }
      );
  }

  doc.end();
}
