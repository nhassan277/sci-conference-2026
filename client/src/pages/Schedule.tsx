import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Users,
  Coffee,
  Award,
  Presentation,
  MessageSquare,
  Mic,
  User,
  FlaskConical,
  Download,
  Loader2
} from "lucide-react";

// ─── KEYNOTE SPEAKERS (4 total) ───────────────────────────────────────────────
// Day 1: Khaled Amer (10:30-10:50), Ehab El Dabaa (10:50-11:10)
// Day 2: Mortada Mourad (9:15-9:35), Ahmed Hegazy (9:35-9:55)
const keynoteSpeakers = [
  {
    name: "Major General Dr. Khaled Amer",
    affiliation: "Founding Dean, Armed Forces College of Medicine; PI, Egyptian Genome Project",
    talk: "Egypt Genome; From Dream to Reality",
    day: 1,
    track: "bio"
  },
  {
    name: "Prof. Dr. Ehab El-Dabaa",
    affiliation: "Head of Biochemistry & Molecular Biology Dept & CERBioP, Theodor Bilharz Research Institute",
    talk: "Center of Excellence in Recombinant Biopharmaceutical Proteins (CERBioP) in TBRI; From Scientific Innovation to The Egyptian Biopharmaceutical Industry",
    day: 1,
    track: "bio"
  },
  {
    name: "Prof. Dr. Mortada Mourad Taha El Aref",
    affiliation: "Professor of Ore Geology, Faculty of Science, Cairo University",
    talk: "Karstology (Science of Unlimited Multi-Discipline Approaches), Promising Setting for Industrial Raw Materials",
    day: 2,
    track: "geo"
  },
  {
    name: "Prof. Dr. Ahmed Hegazy",
    affiliation: "Professor of Plant Ecology, Faculty of Science, Cairo University",
    talk: "Policies and Diplomacy of Basic Scientific Research for Societal Development: Basic Research from Laboratory to Society",
    day: 2,
    track: "bio"
  }
];

// ─── INVITED SPEAKERS ──────────────────────────────────────────────────────────
// Hall A: Biological & Chemical Sciences — Day 1 (Invited)
const invitedBioDay1 = [
  { name: "Prof. Dr. Fathy Khodair", affiliation: "Former Dean, Faculty of Medicine (Kasr Al-Ainy), Cairo University; Advisor to the President of Cairo University; Consultant Plastic & Reconstructive Surgeon", talk: "Clinical Application of Adipose Derived Stem Cells in Plastic Surgery" },
  { name: "Prof. Dr. Ibrahim El-Sherbiny", affiliation: "Professor of Nanotechnology & Nanomedicine, Founding Chairman", talk: "Basic Sciences As the Foundation of Innovation: Some Success Stories for Disease Treatment and Advanced Biomedical Applications" },
  { name: "Prof. Dr. Ahmed Galal", affiliation: "Chemistry Department, Faculty of Science, Cairo University", talk: "Photo-assisted Electrocatalysis: An Effective Tool for Green Chemical Conversion" },
  { name: "Prof. Dr. Adel Khalil", affiliation: "Faculty of Science, Cairo University", talk: "Bridging the Lab-to-Market Gap: Resolving Integration Challenges in Therapeutic and Diagnostic Innovation" },
  { name: "Prof. Dr. Hamed A. Ead", affiliation: "Professor of Chemistry, Faculty of Science, Cairo University", talk: "Science at the Core of Innovation: Reimagining the University–Industry Nexus for Transformative Impact" },
  { name: "Prof. Dr. Refaat Gabre", affiliation: "Head of Biotechnology Department, Faculty of Science, Cairo University", talk: "Transfer, Localization, and Reproduction of Biotechnology in Egypt" },
  { name: "Prof. Dr. Tarek Kapiel", affiliation: "Assistant Professor of Plant Biotechnology", talk: "Integrative Bio-Nanotechnologies for Industrial Symbiosis: Scaling the Circular Bioeconomy in Egypt" },
  { name: "Prof. Dr. Naglaa Abdallah", affiliation: "Professor of Genetics, Faculty of Agriculture, Cairo University", talk: "Novel Genome Editing Approaches for a Sustainable Future" },
  { name: "Dr. Abdelfattah Kamal", affiliation: "Operations Director, BioGeneric Pharma (BGP)", talk: "Achieving Quality and Sustainable Local Vaccine Production in Africa to Improve Access" },
];

// Hall B: Mathematics, Physics, Geology, Astronomy — Day 1 (Invited)
const invitedGeoDay1 = [
  { name: "Prof. Dr. Osama Shalabiea", affiliation: "Professor of Astrophysics and Space Physics, Head of Department", talk: "Space Science and Technology (SSAT): Exploration, Utilization and Commercialization" },
  { name: "Prof. Dr. Khalid Taalab", affiliation: "Nuclear Medicine Professor, Military Medical Academy", talk: "Radiopharmaceuticals and Precision Medicine" },
  { name: "Prof. Dr. Mohamed Shaker", affiliation: "Professor of Physics, Faculty of Science, Cairo University", talk: "Silicon Nanophotonics for On-Chip Integrated Circuit Technology" },
  { name: "Dr. Areeg Abdalla", affiliation: "Associate Professor, Mathematics Department, Faculty of Science", talk: "Scientific Principles and Medical Applications of Artificial Intelligence" },
  { name: "Prof. Dr. Osama Azmy", affiliation: "Professor, Egyptian Atomic Energy Authority", talk: "Management of the Rosy Years of Life" },
  { name: "Prof. Dr. Ashraf Abduo Tabll", affiliation: "Professor of Medical Biotechnology, Egypt Center for Research and Regenerative Medicine", talk: "Current Status and Future Prospects of Medical Biotechnology in Egypt: Lessons from Monoclonal and IgY Antibodies" },
  { name: "Prof. Dr. Korany A. Ali", affiliation: "Professor of Astronomy, Faculty of Science, Cairo University", talk: "The Role of Research and Development Centers in Promoting Active Pharmaceutical Ingredients (APIs): Achievements of the R&D Center for Chemical and Pharmaceutical Industries" },
  { name: "Dr. Ahmed Youssef", affiliation: "Senior Petrophysicist, Assistant General Manager for Development", talk: "Detection of Low Contrast, Low Resistivity Pay (LCLR) Challenge in Shaly Sand Gas Reservoir" },
  { name: "Eng. Mostafa Nasser", affiliation: "Chapter Director, Startup Grind Cairo", talk: "AI in Biotechnology" },
];

// Hall C: Biological & Chemical Sciences — Day 1 (Participants)
const participantBioDay1 = [
  { name: "Prof. Dr. Ahmed Abdellatif", affiliation: "Participant", talk: "" },
  { name: "Ms. Narguess Hossam", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Amr Ali", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Rasha Mohmed", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Islam Shehata", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Ahmed El Fiqi", affiliation: "Participant", talk: "" },
  { name: "Dr. Mohamed Mousa", affiliation: "Participant", talk: "" },
  { name: "Dr. Toka Osman", affiliation: "Participant", talk: "" },
  { name: "Dr. Karim Barakat", affiliation: "Participant", talk: "" },
];

// Hall D: Mathematics, Physics, Geology, Astronomy — Day 1 (Participants / Industry)
const participantGeoDay1 = [
  { name: "Prof. Dr. Ebtsam H. Taha", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Ahmed Sabry", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Ahmed Abdelhalim", affiliation: "Participant", talk: "" },
  { name: "Ms. Hagar Hamedy", affiliation: "Participant", talk: "" },
  { name: "Sami Ayed Group / Startup Grind", affiliation: "Industry", talk: "" },
  { name: "Agitech / Chitosan", affiliation: "Industry", talk: "" },
  { name: "Poster & Booth Exhibition", affiliation: "Exhibition", talk: "" },
];

// Hall A: Biological & Chemical Sciences — Day 2 (Invited)
// v13: Round1=Sohair, Round2=Rashika, Round3=Ebtehal, Round4=Nashwa, Round5=Anwar, Round6=Hamed, Round7=Abdel Gawad, Round8=El-Shibiny, Round9=Ahmed Fikry
const invitedBioDay2 = [
  { name: "Prof. Dr. Sohair Ramadan", affiliation: "Dean of Faculty of Science, Cairo University", talk: "Practical Aspects of Experimental Design in Laboratory Animal Science" },
  { name: "Prof. Dr. Rashika El Ridi", affiliation: "Professor of Immunology, Zoology Department, Faculty of Science, Cairo University", talk: "The Impact of Misleading Concepts in Science on Efforts to Control Schistosomiasis and Cancer" },
  { name: "Prof. Dr. Ebtehal El-Demerdash", affiliation: "Professor, Faculty of Science, Cairo University", talk: "When Pharmacometrics meets AI: Shaping the future of therapeutics" },
  { name: "Prof. Dr. Nashwa El-Khazragy", affiliation: "Faculty of Science, Cairo University", talk: "" },
  { name: "Dr. Mohamed Anwar", affiliation: "Flavor House — Organic Chemistry & Flavor Manufacturing", talk: "From Molecules to Taste: The Role of Organic Chemistry in Flavor Manufacturing" },
  { name: "Prof. Dr. Mohamed Hamed", affiliation: "Associate Professor of Biomedical Informatics and Computational Biology", talk: "Computational Transformation in Drug Discovery: Bioinformatics and AI Innovations in Pharmaceutical Science" },
  { name: "Prof. Dr. Mohamed Abdel Gawad", affiliation: "Faculty of Science, Cairo University", talk: "Metabolic Mastery: Engineering the PETase-MHETase Synergistic Consortium for a Truly Circular Plastic Economy" },
  { name: "Prof. Dr. Ayman El-Shibiny", affiliation: "Professor of Biomedical Sciences, Director of CMP, Zewail City", talk: "Phage Innovation: Targeted Solutions for Regional Antimicrobial Challenges" },
  { name: "Dr. Ahmed Fikry", affiliation: "Assistant Professor, King Salman International University", talk: "Computer-Aided Drug Design: From Code to Cure" },
];

// Hall B: Mathematics, Physics, Geology, Astronomy — Day 2 (Invited)
// v13: Round1=El-Anbawy, Round2=Mortada, Round3=Nasr, Round4=Sahar, Round5=Wafik, Round6=Nagwa, Round7=Abdel Rahman Bader, Round8=Reda Salem, Round9=Walaa Abbas
const invitedGeoDay2 = [
  { name: "Prof. Dr. Mohamed El-Anbawy", affiliation: "Professor of Geology, Faculty of Science, Cairo University", talk: "Economic Utilization of Shale in Desert Land Reclamation and Cement Industry" },
  { name: "Prof. Dr. Mortada Mourad", affiliation: "Professor of Ore Geology, Faculty of Science, Cairo University", talk: "Karstology (Science of Unlimited Multi-Discipline Approaches), Promising Setting for Industrial Raw Materials" },
  { name: "Prof. Dr. Mahmoud Ibrahim Nasr", affiliation: "Professor of Ore Beneficiation and Manufacturing, Egyptian Copper Works", talk: "Egyptian Iron Ore as a Feedstock to the Iron and Steel Industry" },
  { name: "Dr. Sahar Hassan", affiliation: "Senior Geologist and Sedimentologist, Digital Subsurface Solutions", talk: "Revolutionizing Subsurface Understanding: AI-Driven Logging-While-Drilling Technologies" },
  { name: "Dr. Ahmed Wafik", affiliation: "Senior Petrophysicist, Assistant General Manager for Development", talk: "Detection of Low Contrast, Low Resistivity Pay (LCLR) Challenge in Shaly Sand Gas Reservoir" },
  { name: "Prof. Dr. Nagwa El-Badri", affiliation: "Director of Biomedical Sciences Program & Center of Excellence for Stem Cells", talk: "Biomimetic Scaffolds and the Human Amniotic Membrane" },
  { name: "Prof. Dr. Abdel Rahman Bader", affiliation: "Faculty of Science, Cairo University", talk: "" },
  { name: "Prof. Dr. Reda Salem", affiliation: "Faculty of Science, Cairo University", talk: "Recombinant Technologies in Poultry Vaccine Development: From Molecular Design to Industrial Application" },
  { name: "Dr. Walaa Abbas El-Sayed Omar", affiliation: "Assistant Professor of Organic Chemistry & Renewable Energy Applications, Faculty of Petroleum & Mining Engineering, Suez University", talk: "" },
];

// Hall C: Day 2 (Participants + Industry)
// v13: Round1=Emad Elzayat, Round2=Fathy Abdel Ghaffar, Round3=Sara Ali, Round4=Plasma/Colors, Round5=Al elAraby/EgCompBio, Round6=Rania Samy, Round7=Manar Mamdou, Round8=Shiama Mohamed, Round9=Salwa Abdel Hameed (graduation)
const participantBioDay2 = [
  { name: "Prof. Dr. Emad Elzayat", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Fathy Abdel Ghaffar", affiliation: "Participant", talk: "" },
  { name: "Dr. Sara Ali", affiliation: "Participant", talk: "" },
  { name: "Plasma / Colors", affiliation: "Industry", talk: "" },
  { name: "Al elAraby / EgCompBio", affiliation: "Industry", talk: "" },
  { name: "Dr. Rania Samy", affiliation: "Participant", talk: "" },
  { name: "Dr. Manar Mamdou Ahmed", affiliation: "Participant", talk: "" },
  { name: "Dr. Shiama Mohamed", affiliation: "Participant", talk: "" },
  { name: "Prof. Dr. Salwa Abdel Hameed", affiliation: "Graduation Project Group", talk: "" },
];

// Hall D: Day 2
// v13: Special Session (10:35-11:55 = Rounds 2-5), then afternoon: Alyaa(1:30), Reham(1:50), Basma(2:10), Ahmed Abdel Twab(2:30)
const participantGeoDay2 = [
  { name: "Dr. Alyaa Aly", affiliation: "Participant", talk: "" },
  { name: "Dr. Reham Eid", affiliation: "Participant", talk: "" },
  { name: "Ms. Basma Islam", affiliation: "Participant", talk: "" },
  { name: "Mr. Ahmed Abdel Twab", affiliation: "Participant", talk: "" },
];

// ─── CONFERENCE PROGRAM DATA ──────────────────────────────────────────────────
const sessions = {
  day1: [
    {
      id: 1,
      time: "08:30 - 09:30",
      timeAr: "٨:٣٠ - ٩:٣٠",
      type: "registration",
      title: "Arrival & Registration",
      titleAr: "الوصول والتسجيل",
      location: "Conference Hall Entrance",
      locationAr: "مدخل قاعة المؤتمرات",
      description: "Welcome and registration for all conference participants",
      descriptionAr: "الترحيب والتسجيل لجميع المشاركين في المؤتمر"
    },
    {
      id: 2,
      time: "09:30 - 10:00",
      timeAr: "٩:٣٠ - ١٠:٠٠",
      type: "opening",
      title: "Welcome Talk",
      titleAr: "كلمة الترحيب",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "Opening ceremony with welcome addresses from university leadership",
      descriptionAr: "حفل الافتتاح مع كلمات ترحيبية من قيادة الجامعة"
    },
    {
      id: 2.5,
      time: "10:00 - 10:30",
      timeAr: "١٠:٠٠ - ١٠:٣٠",
      type: "opening",
      title: "Opening Remarks (Continued)",
      titleAr: "كلمات الافتتاح (تابع)",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "Continuation of opening ceremony — all halls connected by Hall A",
      descriptionAr: "استمرار حفل الافتتاح — جميع القاعات متصلة بالقاعة أ"
    },
    {
      id: 3,
      time: "10:30 - 10:50",
      timeAr: "١٠:٣٠ - ١٠:٥٠",
      type: "keynote",
      title: "Plenary Speaker 1",
      titleAr: "المتحدث الرئيسي ١",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      speaker: keynoteSpeakers[0],
    },
    {
      id: 4,
      time: "10:50 - 11:10",
      timeAr: "١٠:٥٠ - ١١:١٠",
      type: "keynote",
      title: "Plenary Speaker 2",
      titleAr: "المتحدث الرئيسي ٢",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      speaker: keynoteSpeakers[1],
    },
    {
      id: 5,
      time: "11:10 - 11:30",
      timeAr: "١١:١٠ - ١١:٣٠",
      type: "panel",
      title: "Discussion Panel",
      titleAr: "حلقة نقاش",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "Interactive discussion following keynote presentations",
      descriptionAr: "نقاش تفاعلي بعد العروض الرئيسية"
    },
    {
      id: 6,
      time: "11:30 - 11:50",
      timeAr: "١١:٣٠ - ١١:٥٠",
      type: "parallel",
      title: "Parallel Sessions — Round 1",
      titleAr: "جلسات متوازية — الجولة ١",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[0].name, speakerTalk: invitedBioDay1[0].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[0].name, speakerTalk: invitedGeoDay1[0].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[0].name, speakerTalk: participantBioDay1[0].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay1[0].name, speakerTalk: participantGeoDay1[0].talk }
      ],
      workshops: [
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "Geology Workshop (Dr. Jan Sedláček — Czech Geological Survey)", nameAr: "ورشة الجيولوجيا (تحليل البيانات الجيوكيميائية)" }
      ]
    },
    {
      id: 7,
      time: "11:50 - 12:10",
      timeAr: "١١:٥٠ - ١٢:١٠",
      type: "parallel",
      title: "Parallel Sessions — Round 2",
      titleAr: "جلسات متوازية — الجولة ٢",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[1].name, speakerTalk: invitedBioDay1[1].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[1].name, speakerTalk: invitedGeoDay1[1].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[1].name, speakerTalk: participantBioDay1[1].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay1[1].name, speakerTalk: participantGeoDay1[1].talk }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop", nameAr: "ورشة عمل MARC" },
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "Medsol: From DNA to Proteins — Advanced Sequencing Technologies", nameAr: "ميدسول: من الحمض النووي إلى البروتينات" }
      ]
    },
    {
      id: 7.3,
      time: "12:10 - 12:30",
      timeAr: "١٢:١٠ - ١٢:٣٠",
      type: "parallel",
      title: "Parallel Sessions — Round 3",
      titleAr: "جلسات متوازية — الجولة ٣",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[2].name, speakerTalk: invitedBioDay1[2].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[2].name, speakerTalk: invitedGeoDay1[2].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[2].name, speakerTalk: participantBioDay1[2].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay1[2].name, speakerTalk: participantGeoDay1[2].talk }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" },
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "Medsol Workshop (Cont.)", nameAr: "ورشة ميدسول (تابع)" }
      ]
    },
    {
      id: 7.6,
      time: "12:30 - 12:50",
      timeAr: "١٢:٣٠ - ١٢:٥٠",
      type: "parallel",
      title: "Parallel Sessions — Round 4",
      titleAr: "جلسات متوازية — الجولة ٤",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[3].name, speakerTalk: invitedBioDay1[3].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[3].name, speakerTalk: invitedGeoDay1[3].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[3].name, speakerTalk: participantBioDay1[3].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay1[3].name, speakerTalk: participantGeoDay1[3].talk }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" },
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "Medsol Workshop (Cont.)", nameAr: "ورشة ميدسول (تابع)" }
      ]
    },
    {
      id: 8,
      time: "12:50 - 13:10",
      timeAr: "١٢:٥٠ - ١:١٠ م",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Parallel discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش متوازية في جميع قاعات المؤتمر"
    },
    {
      id: 9,
      time: "13:10 - 13:45",
      timeAr: "١:١٠ - ١:٤٥ م",
      type: "break",
      title: "Coffee Break",
      titleAr: "استراحة قهوة",
      location: "Conference Foyer",
      locationAr: "ردهة المؤتمر",
      description: "Coffee break and networking opportunity",
      descriptionAr: "استراحة القهوة وفرصة للتواصل"
    },
    {
      id: 10,
      time: "13:45 - 14:05",
      timeAr: "١:٤٥ - ٢:٠٥ م",
      type: "parallel",
      title: "Parallel Sessions — Round 5",
      titleAr: "جلسات متوازية — الجولة ٥",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[4].name, speakerTalk: invitedBioDay1[4].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[4].name, speakerTalk: invitedGeoDay1[4].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[4].name, speakerTalk: participantBioDay1[4].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Industry & Startup Presentations", topicAr: "عروض الشركات والمشاريع الناشئة", speaker: "1:45-1:55 Sami Ayed Group | 1:55-2:05 Startup Grind", speakerTalk: "" }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" },
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "Medsol Workshop (Cont.)", nameAr: "ورشة ميدسول (تابع)" }
      ]
    },
    {
      id: 11,
      time: "14:05 - 14:25",
      timeAr: "٢:٠٥ - ٢:٢٥ م",
      type: "parallel",
      title: "Parallel Sessions — Round 6",
      titleAr: "جلسات متوازية — الجولة ٦",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[5].name, speakerTalk: invitedBioDay1[5].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[5].name, speakerTalk: invitedGeoDay1[5].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[5].name, speakerTalk: participantBioDay1[5].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Industry Presentations", topicAr: "عروض الشركات", speaker: "2:05-2:15 Agitech | 2:15-2:25 Chitosan", speakerTalk: "" }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" },
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "Medsol Workshop (Cont.)", nameAr: "ورشة ميدسول (تابع)" }
      ]
    },
    {
      id: 12,
      time: "14:25 - 14:45",
      timeAr: "٢:٢٥ - ٢:٤٥ م",
      type: "parallel",
      title: "Parallel Sessions — Round 7",
      titleAr: "جلسات متوازية — الجولة ٧",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[6].name, speakerTalk: invitedBioDay1[6].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[6].name, speakerTalk: invitedGeoDay1[6].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[6].name, speakerTalk: participantBioDay1[6].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Poster & Booth Exhibition", topicAr: "جلسة الملصقات والمعرض", speaker: "Poster & Booth Exhibition Session", speakerTalk: "" }
      ]
    },
    {
      id: 12.5,
      time: "14:45 - 15:05",
      timeAr: "٢:٤٥ - ٣:٠٥ م",
      type: "parallel",
      title: "Parallel Sessions — Round 8",
      titleAr: "جلسات متوازية — الجولة ٨",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[7].name, speakerTalk: invitedBioDay1[7].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[7].name, speakerTalk: invitedGeoDay1[7].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[7].name, speakerTalk: participantBioDay1[7].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Poster & Booth Exhibition", topicAr: "جلسة الملصقات والمعرض", speaker: "Poster & Booth Exhibition Session", speakerTalk: "" }
      ]
    },
    {
      id: 13,
      time: "15:05 - 15:25",
      timeAr: "٣:٠٥ - ٣:٢٥ م",
      type: "parallel",
      title: "Parallel Sessions — Round 9",
      titleAr: "جلسات متوازية — الجولة ٩",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay1[8].name, speakerTalk: invitedBioDay1[8].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay1[8].name, speakerTalk: invitedGeoDay1[8].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay1[8].name, speakerTalk: participantBioDay1[8].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Poster & Booth Exhibition", topicAr: "جلسة الملصقات والمعرض", speaker: "Poster & Booth Exhibition Session", speakerTalk: "" }
      ]
    },
    {
      id: 13.5,
      time: "15:25 - 15:45",
      timeAr: "٣:٢٥ - ٣:٤٥ م",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "Hall A, Hall B, Hall C",
      locationAr: "القاعة أ، القاعة ب، القاعة ج",
      description: "Discussion panels in Halls A, B and C",
      descriptionAr: "حلقات نقاش في القاعات أ، ب وج"
    },
    {
      id: 14.5,
      time: "15:45 - 16:00",
      timeAr: "٣:٤٥ - ٤:٠٠ م",
      type: "closing",
      title: "Issuing Workshop Attendance Certificates — Day 1",
      titleAr: "تسليم شهادات حضور الورش — اليوم الأول",
      location: "Main Hall",
      locationAr: "القاعة الرئيسية",
      description: "Distribution of workshop attendance certificates for Day 1 participants",
      descriptionAr: "توزيع شهادات حضور الورش لمشاركي اليوم الأول"
    },
    {
      id: 15,
      time: "During Conference — April 8",
      timeAr: "خلال المؤتمر — ٨ أبريل",
      type: "workshop",
      title: "How to Convert Research Findings into Business Ideas",
      titleAr: "كيف تحوّل نتائج بحثك إلى أفكار تجارية",
      location: "Workshop Room — Faculty of Science, Cairo University",
      locationAr: "غرفة ورشة العمل — كلية العلوم، جامعة القاهرة",
      description: "This course bridges the gap between laboratory results and real-world ventures, guiding participants to identify which scientific findings have true commercial potential. Topics include business ideas vs. sustainable business models, fundraising concepts, and an interactive Business Model Canvas session.",
      descriptionAr: "يجسر هذا البرنامج الهوة بين نتائج المختبر والمشاريع الحقيقية، ويرشد المشاركين لتحديد النتائج العلمية ذات الإمكانات التجارية الحقيقية.",
      presenter: "NAWAH Scientific",
      fee: "200 EGP (incl. certificate)",
      feeAr: "٢٠٠ جنيه مصري (شاملة الشهادة)",
      duration: "4 Hours | ٤ ساعات",
      spots: "Limited"
    },
    {
      id: 16,
      time: "During Conference — April 7",
      timeAr: "خلال المؤتمر — ٧ أبريل",
      type: "workshop",
      title: "Environmental Geochemical Data Analysis Workshop (Session 1)",
      titleAr: "ورشة تحليل البيانات الجيوكيميائية البيئية (الجلسة الأولى)",
      location: "Workshop Room — Faculty of Science, Cairo University",
      locationAr: "غرفة ورشة العمل — كلية العلوم، جامعة القاهرة",
      description: "Practical Application of Statistical Methodologies for Pollution Source Apportionment — Session 1 of 2. Covers statistical methods for geochemical data and pollution source identification techniques.",
      descriptionAr: "التطبيق العملي للمنهجيات الإحصائية لتحديد مصادر التلوث — الجلسة الأولى من اثنتين.",
      presenter: "Dr. Jan Sedláček — Czech Geological Survey / Palacký University Olomouc",
      fee: "Free | مجاناً",
      feeAr: "مجاناً",
      duration: "90 Minutes | ٩٠ دقيقة",
      spots: "Open"
    }
  ],
  day2: [
    {
      id: 15,
      time: "08:30 - 09:15",
      timeAr: "٨:٣٠ - ٩:١٥",
      type: "registration",
      title: "Arrival & Registration",
      titleAr: "الوصول والتسجيل",
      location: "Conference Hall Entrance",
      locationAr: "مدخل قاعة المؤتمرات",
      description: "Registration for Day 2 participants",
      descriptionAr: "التسجيل للمشاركين في اليوم الثاني"
    },
    {
      id: 16,
      time: "09:15 - 09:35",
      timeAr: "٩:١٥ - ٩:٣٥",
      type: "keynote",
      title: "Plenary Speaker 3",
      titleAr: "المتحدث الرئيسي ٣",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      speaker: keynoteSpeakers[2],
    },
    {
      id: 17,
      time: "09:35 - 09:55",
      timeAr: "٩:٣٥ - ٩:٥٥",
      type: "keynote",
      title: "Plenary Speaker 4",
      titleAr: "المتحدث الرئيسي ٤",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      speaker: keynoteSpeakers[3],
    },
    {
      id: 18,
      time: "09:55 - 10:15",
      timeAr: "٩:٥٥ - ١٠:١٥",
      type: "panel",
      title: "Discussion Panel",
      titleAr: "حلقة نقاش",
      location: "All Halls",
      locationAr: "جميع القاعات",
      description: "Interactive discussion following keynote presentations",
      descriptionAr: "نقاش تفاعلي بعد العروض الرئيسية"
    },
    {
      id: 19,
      time: "10:15 - 10:35",
      timeAr: "١٠:١٥ - ١٠:٣٥",
      type: "parallel",
      title: "Parallel Sessions — Round 1",
      titleAr: "جلسات متوازية — الجولة ١",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[0].name, speakerTalk: invitedBioDay2[0].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[0].name, speakerTalk: invitedGeoDay2[0].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay2[0].name, speakerTalk: participantBioDay2[0].talk }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop", nameAr: "ورشة عمل نواة للعلوم" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Environmental Geochemical Data Analysis — Session 2 (Dr. Jan Sedláček, Czech Geological Survey)", nameAr: "تحليل البيانات الجيوكيميائية البيئية — الجلسة الثانية" },
        { room: "Workshop Room 4", roomAr: "غرفة ورشة العمل ٤", name: "Bioinformatics Workshop — Dr. Dina Amr (09:35–12:15)", nameAr: "ورشة المعلوماتية الحيوية — د. دينا عمرو (٩:٣٥–١٢:١٥)" }
      ]
    },
    {
      id: 20,
      time: "10:35 - 10:55",
      timeAr: "١٠:٣٥ - ١٠:٥٥",
      type: "parallel",
      title: "Parallel Sessions — Round 2",
      titleAr: "جلسات متوازية — الجولة ٢",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[1].name, speakerTalk: invitedBioDay2[1].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[1].name, speakerTalk: invitedGeoDay2[1].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay2[1].name, speakerTalk: participantBioDay2[1].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Special Session — Astronomy Dept.", topicAr: "جلسة خاصة — قسم الفلك", speaker: "Special Session for Astronomy Department", speakerTalk: "Differential Geometry and Its Applications in Astronomy and Physics" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Bioinformatics Workshop (Dr. Dina Amr)", nameAr: "ورشة علم المعلوماتية الحيوية (د. دينا عمرو)" },
        { room: "Workshop Room 4", roomAr: "غرفة ورشة العمل ٤", name: "Bioinformatics Workshop — Dr. Dina Amr (Cont.)", nameAr: "ورشة المعلوماتية الحيوية — د. دينا عمرو (تابع)" }
      ]
    },
    {
      id: 21,
      time: "10:55 - 11:15",
      timeAr: "١٠:٥٥ - ١١:١٥",
      type: "parallel",
      title: "Parallel Sessions — Round 3",
      titleAr: "جلسات متوازية — الجولة ٣",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[2].name, speakerTalk: invitedBioDay2[2].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[2].name, speakerTalk: invitedGeoDay2[2].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay2[2].name, speakerTalk: participantBioDay2[2].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Special Session — Astronomy Dept. (Cont.)", topicAr: "جلسة خاصة — قسم الفلك (تابع)", speaker: "Special Session for Astronomy Department (Cont.)", speakerTalk: "Differential Geometry and Its Applications in Astronomy and Physics" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Bioinformatics Workshop — Dr. Dina Amr (Cont.)", nameAr: "ورشة المعلوماتية الحيوية — د. دينا عمرو (تابع)" }
      ]
    },
    {
      id: 22,
      time: "11:15 - 11:35",
      timeAr: "١١:١٥ - ١١:٣٥",
      type: "parallel",
      title: "Parallel Sessions — Round 4",
      titleAr: "جلسات متوازية — الجولة ٤",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[3].name, speakerTalk: invitedBioDay2[3].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[3].name, speakerTalk: invitedGeoDay2[3].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Industry Presentations", topicAr: "عروض الشركات", speaker: "11:15-11:25 Plasma | 11:25-11:35 Colors", speakerTalk: "" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Special Session — Astronomy Dept. (Cont.)", topicAr: "جلسة خاصة — قسم الفلك (تابع)", speaker: "Special Session for Astronomy Department (Cont.)", speakerTalk: "Differential Geometry and Its Applications in Astronomy and Physics" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Bioinformatics Workshop — Dr. Dina Amr (Cont.)", nameAr: "ورشة المعلوماتية الحيوية — د. دينا عمرو (تابع)" }
      ]
    },
    {
      id: 22.5,
      time: "11:35 - 11:55",
      timeAr: "١١:٣٥ - ١١:٥٥",
      type: "parallel",
      title: "Parallel Sessions — Round 5",
      titleAr: "جلسات متوازية — الجولة ٥",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[4].name, speakerTalk: invitedBioDay2[4].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[4].name, speakerTalk: invitedGeoDay2[4].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Industry Presentations", topicAr: "عروض الشركات", speaker: "11:35-11:45 Al elAraby | 11:45-11:55 EgCompBio", speakerTalk: "" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Special Session — Astronomy Dept. (Cont.)", topicAr: "جلسة خاصة — قسم الفلك (تابع)", speaker: "Special Session for Astronomy Department (Cont.)", speakerTalk: "Differential Geometry and Its Applications in Astronomy and Physics" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Bioinformatics Workshop — Dr. Dina Amr (Cont.)", nameAr: "ورشة المعلوماتية الحيوية — د. دينا عمرو (تابع)" }
      ]
    },
    {
      id: 23,
      time: "11:55 - 12:15",
      timeAr: "١١:٥٥ - ١٢:١٥",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش في جميع قاعات المؤتمر"
    },
    {
      id: 24,
      time: "12:15 - 13:25",
      timeAr: "١٢:١٥ - ١:٢٥ م",
      type: "break",
      title: "Coffee Break & Poster Session",
      titleAr: "استراحة القهوة وجلسة الملصقات",
      location: "Conference Foyer & Exhibition Area",
      locationAr: "ردهة المؤتمر ومنطقة المعرض",
      description: "Coffee break, networking, and poster viewing session",
      descriptionAr: "استراحة القهوة والتواصل وجلسة مشاهدة الملصقات"
    },
    {
      id: 25,
      time: "13:30 - 13:50",
      timeAr: "١:٣٠ - ١:٥٠ م",
      type: "parallel",
      title: "Parallel Sessions — Round 6",
      titleAr: "جلسات متوازية — الجولة ٦",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[5].name, speakerTalk: invitedBioDay2[5].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[5].name, speakerTalk: invitedGeoDay2[5].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay2[5].name, speakerTalk: participantBioDay2[5].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay2[1].name, speakerTalk: participantGeoDay2[1].talk }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" }
      ]
    },
    {
      id: 26,
      time: "13:50 - 14:10",
      timeAr: "١:٥٠ - ٢:١٠ م",
      type: "parallel",
      title: "Parallel Sessions — Round 7",
      titleAr: "جلسات متوازية — الجولة ٧",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[6].name, speakerTalk: invitedBioDay2[6].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[6].name, speakerTalk: invitedGeoDay2[6].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay2[6].name, speakerTalk: participantBioDay2[6].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay2[2].name, speakerTalk: participantGeoDay2[2].talk }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Geology Workshop (Cont.)", nameAr: "ورشة الجيولوجيا (تابع)" }
      ]
    },
    {
      id: 27,
      time: "14:10 - 14:30",
      timeAr: "٢:١٠ - ٢:٣٠ م",
      type: "parallel",
      title: "Parallel Sessions — Round 8",
      titleAr: "جلسات متوازية — الجولة ٨",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[7].name, speakerTalk: invitedBioDay2[7].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[7].name, speakerTalk: invitedGeoDay2[7].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences (Participants)", topicAr: "العلوم البيولوجية والكيميائية (مشاركون)", speaker: participantBioDay2[7].name, speakerTalk: participantBioDay2[7].talk },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay2[3].name, speakerTalk: participantGeoDay2[3].talk }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Scientific Workshop (Cont.)", nameAr: "ورشة عمل نواة للعلوم (تابع)" },
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Geology Workshop (Cont.)", nameAr: "ورشة الجيولوجيا (تابع)" }
      ]
    },
    {
      id: 27.5,
      time: "14:30 - 14:50",
      timeAr: "٢:٣٠ - ٢:٥٠ م",
      type: "parallel",
      title: "Parallel Sessions — Round 9",
      titleAr: "جلسات متوازية — الجولة ٩",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences (Invited)", topicAr: "العلوم البيولوجية والكيميائية (مدعوون)", speaker: invitedBioDay2[8].name, speakerTalk: invitedBioDay2[8].talk },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Math, Physics, Geology, Astronomy (Invited)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مدعوون)", speaker: invitedGeoDay2[8].name, speakerTalk: invitedGeoDay2[8].talk },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Graduation Projects", topicAr: "مشاريع التخرج", speaker: participantBioDay2[8].name, speakerTalk: "" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Math, Physics, Geology, Astronomy (Participants)", topicAr: "الرياضيات، الفيزياء، الجيولوجيا (مشاركون)", speaker: participantGeoDay2[3].name, speakerTalk: participantGeoDay2[3].talk }
      ],
      workshops: [
        { room: "Workshop Room 3", roomAr: "غرفة ورشة العمل ٣", name: "Geology Workshop (Cont.)", nameAr: "ورشة الجيولوجيا (تابع)" }
      ]
    },
    {
      id: 27.8,
      time: "14:50 - 15:10",
      timeAr: "٢:٥٠ - ٣:١٠ م",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش في جميع قاعات المؤتمر"
    },
    {
      id: 30,
      time: "15:10 - 16:30",
      timeAr: "٣:١٠ - ٤:٣٠ م",
      type: "closing",
      title: "Conference Closure Appreciation Ceremony & Awards",
      titleAr: "حفل ختام المؤتمر وتوزيع الجوائز",
      location: "Main Hall",
      locationAr: "القاعة الرئيسية",
      description: "Conference Closure Appreciation Ceremony & Announcement of Best Project, Poster and Presentation Awards & Issuing attendance certificates",
      descriptionAr: "حفل ختام المؤتمر والإعلان عن جوائز أفضل مشروع وملصق وعرض تقديمي وتسليم شهادات الحضور"
    },
    {
      id: 31,
      time: "During Conference — April 7",
      timeAr: "خلال المؤتمر — ٧ أبريل",
      type: "workshop",
      title: "From DNA to Proteins: Advanced Sequencing Technologies Workshop",
      titleAr: "من الحمض النووي إلى البروتينات: ورشة تقنيات التسلسل المتقدمة",
      location: "Workshop Room — Faculty of Science, Cairo University",
      locationAr: "غرفة ورشة العمل — كلية العلوم، جامعة القاهرة",
      description: "A comprehensive introduction to cutting-edge sequencing technologies shaping the future of life sciences. Participants explore Oxford Nanopore sequencing and Quantum-Si protein sequencing, gaining insights into workflows, data interpretation, and applications across research and industry.",
      descriptionAr: "مقدمة شاملة لأحدث تقنيات التسلسل التي تشكّل مستقبل علوم الحياة، تشمل Oxford Nanopore وتسلسل البروتينات من Quantum-Si.",
      presenter: "Medsol Corporation",
      fee: "200 EGP (incl. certificate)",
      feeAr: "٢٠٠ جنيه مصري (شاملة الشهادة)",
      duration: "3 Hours | ٣ ساعات",
      spots: "Limited"
    },
    {
      id: 32,
      time: "During Conference — April 7",
      timeAr: "خلال المؤتمر — ٧ أبريل",
      type: "workshop",
      title: "Good Clinical Practice (GCP) Workshop",
      titleAr: "ورشة الممارسة السريرية الجيدة (GCP)",
      location: "Workshop Room — Faculty of Science, Cairo University",
      locationAr: "غرفة ورشة العمل — كلية العلوم، جامعة القاهرة",
      description: "An introduction to Good Clinical Practice (GCP) standards and their application in clinical research. Covers ICH E6 guidelines, ethical considerations, and regulatory requirements for clinical trials.",
      descriptionAr: "مقدمة لمعايير الممارسة السريرية الجيدة (GCP) وتطبيقها في البحث السريري.",
      presenter: "MARC",
      fee: "200 EGP (incl. certificate)",
      feeAr: "٢٠٠ جنيه مصري (شاملة الشهادة)",
      duration: "3 Hours | ٣ ساعات",
      spots: "Limited"
    }
  ]
};
export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState("day1");
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const response = await fetch("/api/schedule/export-pdf");
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SCI2026-Conference-Schedule.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const currentSessions = selectedDay === "day1" ? sessions.day1 : sessions.day2;

  const getSessionColor = (type: string) => {
    switch (type) {
      case "keynote": return "bg-blue-100 text-blue-800 border-blue-300";
      case "opening": return "bg-green-100 text-green-800 border-green-300";
      case "closing": return "bg-purple-100 text-purple-800 border-purple-300";
      case "break": return "bg-amber-100 text-amber-800 border-amber-300";
      case "registration": return "bg-slate-100 text-slate-800 border-slate-300";
      case "panel": return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "parallel": return "bg-teal-100 text-teal-800 border-teal-300";
      case "workshop": return "bg-orange-100 text-orange-800 border-orange-300";
      case "ceremony": return "bg-rose-100 text-rose-800 border-rose-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case "keynote": return <Mic className="w-3 h-3" />;
      case "opening": return <Award className="w-3 h-3" />;
      case "closing": return <Award className="w-3 h-3" />;
      case "break": return <Coffee className="w-3 h-3" />;
      case "registration": return <Users className="w-3 h-3" />;
      case "panel": return <MessageSquare className="w-3 h-3" />;
      case "parallel": return <Presentation className="w-3 h-3" />;
      case "workshop": return <FlaskConical className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Conference Schedule</p>
              </div>
            </div>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="container">
          <div className="text-center space-y-4">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
              April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Conference Schedule</h1>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">جدول المؤتمر</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete program for both days including keynote speakers, parallel sessions, workshops, and awards ceremony
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" dir="rtl">
              البرنامج الكامل لليومين بما في ذلك المتحدثين الرئيسيين والجلسات المتوازية وورش العمل وحفل توزيع الجوائز
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export Full Schedule as PDF | تحميل البرنامج PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="py-12">
        <div className="container">
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2">
              <TabsTrigger value="day1" className="text-xs md:text-sm">
                Day 1 — April 7 | ٧ أبريل
              </TabsTrigger>
              <TabsTrigger value="day2" className="text-xs md:text-sm">
                Day 2 — April 8 | ٨ أبريل
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDay} className="space-y-6">
              {currentSessions.map((session: any) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className={`${getSessionColor(session.type)} border`}>
                            <span className="flex items-center gap-2">
                              {getSessionIcon(session.type)}
                              {session.time}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-sm" dir="rtl">
                            {session.timeAr}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{session.title}</CardTitle>
                        <CardDescription className="text-base font-medium" dir="rtl">
                          {session.titleAr}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.location && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{session.location}</p>
                          <p dir="rtl">{session.locationAr}</p>
                        </div>
                      </div>
                    )}
                    
                    {session.description && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                        <p className="text-sm text-muted-foreground" dir="rtl">{session.descriptionAr}</p>
                      </div>
                    )}
                    {/* Presenter / Fee / Duration for post-conference workshops */}
                    {(session.presenter || session.fee || session.duration) && (
                      <div className="flex flex-wrap gap-3">
                        {session.presenter && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span>{session.presenter}</span>
                          </div>
                        )}
                        {session.duration && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{session.duration}</span>
                          </div>
                        )}
                        {session.fee && (
                          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
                            <span>💰 {session.fee}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Keynote Speaker Card */}
                    {session.speaker && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Mic className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wide">Plenary Speaker | المتحدث الرئيسي</span>
                        </div>
                        <p className="font-bold text-base text-blue-900">{session.speaker.name}</p>
                        <p className="text-sm text-blue-700">{session.speaker.affiliation}</p>
                        <div className="pt-1 border-t border-blue-200">
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Presentation Title</p>
                          <p className="text-sm font-medium text-blue-800 italic">"{session.speaker.talk}"</p>
                        </div>
                      </div>
                    )}

                    {/* Parallel Sessions */}
                    {session.tracks && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-primary">Conference Halls | القاعات:</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {session.tracks.map((track: any, idx: number) => (
                            <div key={idx} className={`p-3 rounded-lg border ${track.speaker === "Participant Presentations" ? "bg-slate-50 border-slate-200" : "bg-indigo-50 border-indigo-200"}`}>
                              <p className={`font-semibold text-sm ${track.speaker === "Participant Presentations" ? "text-slate-700" : "text-indigo-700"}`}>{track.hall}</p>
                              <p className="text-xs text-muted-foreground" dir="rtl">{track.hallAr}</p>
                              {track.speaker !== "Participant Presentations" ? (
                                <>
                                  <div className="flex items-center gap-1 mt-2">
                                    <User className="w-3 h-3 text-indigo-600" />
                                    <p className="text-sm font-semibold text-indigo-800">{track.speaker}</p>
                                  </div>
                                  {track.speakerTalk && (
                                    <p className="text-xs text-indigo-600 mt-1 italic">"{track.speakerTalk}"</p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">{track.topic}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm mt-2 text-slate-600 font-medium">{track.speaker}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{track.topic}</p>
                                </>
                              )}
                              <p className="text-xs text-muted-foreground" dir="rtl">{track.topicAr}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workshops */}
                    {session.workshops && (
                      <div className="space-y-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 text-amber-900">
                          <FlaskConical className="w-4 h-4" />
                          <p className="text-sm font-semibold">Workshops | ورش العمل:</p>
                        </div>
                        {session.workshops.map((workshop: any, idx: number) => (
                          <div key={idx} className="pl-6">
                            <p className="text-sm font-medium text-amber-800">{workshop.room} — {workshop.name}</p>
                            <p className="text-xs text-amber-700" dir="rtl">{workshop.roomAr} — {workshop.nameAr}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* All Invited Speakers Summary */}
          <Card className="mt-10 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                All Plenary Speakers | جميع المتحدثين الرئيسيين
              </CardTitle>
              <CardDescription>
                22 distinguished speakers across both conference days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Day 1 Bio/Chem */}
                <div>
                  <h3 className="font-semibold text-primary mb-3 pb-1 border-b">Day 1 — Biological & Chemical Sciences (Hall A)</h3>
                  <div className="space-y-2">
                    {invitedBioDay1.map((s, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground italic">"{s.talk}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Day 1 Geo/Physics */}
                <div>
                  <h3 className="font-semibold text-primary mb-3 pb-1 border-b">Day 1 — Geology, Physics & other sciences (Hall B)</h3>
                  <div className="space-y-2">
                    {invitedGeoDay1.map((s, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground italic">"{s.talk}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Day 2 Bio/Chem */}
                <div>
                  <h3 className="font-semibold text-primary mb-3 pb-1 border-b">Day 2 — Biological & Chemical Sciences (Hall A)</h3>
                  <div className="space-y-2">
                    {invitedBioDay2.map((s, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground italic">"{s.talk}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Day 2 Math/Astro */}
                <div>
                  <h3 className="font-semibold text-primary mb-3 pb-1 border-b">Day 2 — Astrophysics, Mathematics & other disciplines (Hall B)</h3>
                  <div className="space-y-2">
                    {invitedGeoDay2.map((s, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground italic">"{s.talk}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workshops Summary */}
          <Card className="mt-6 border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-600" />
                Workshop Program | برنامج ورش العمل
              </CardTitle>
              <CardDescription>10 workshops across 4 days (April 6–9, 2026)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <Badge className="bg-amber-100 text-amber-800 mb-2">Pre-Conference | April 6</Badge>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Biotech Product Development 101</p>
                      <p className="text-xs text-muted-foreground">By Chitosan · 9:00 AM – 12:00 PM · 30 seats</p>
                    </div>
                    <div>
                      <p className="font-semibold">From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy</p>
                      <p className="text-xs text-muted-foreground">By Agitech · 12:00 PM – 2:00 PM · 2 hours · 30 seats</p>
                    </div>
                    <div>
                      <p className="font-semibold">The Vaccine Industry Race: Ready to Play the Viruses' Game?</p>
                      <p className="text-xs text-muted-foreground">By Jasmine Mohsen &amp; Dr. Khaled Walid — Vaccine Industry · 2:00–5:00 PM · 2.5–3 hours · Unlimited seats</p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <Badge className="bg-indigo-100 text-indigo-800 mb-2">During Conference | April 7–8</Badge>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold">How to Convert Research Findings into Business Ideas</p>
                      <p className="text-xs text-muted-foreground">By NAWAH Scientific · Day 2 (April 8) · 4 hours · 200 EGP</p>
                    </div>
                    <div>
                      <p className="font-semibold">From DNA to Proteins: Advanced Sequencing Technologies</p>
                      <p className="text-xs text-muted-foreground">By Medsol · Day 1 (April 7) · 3 hours · 200 EGP</p>
                    </div>
                    <div>
                      <p className="font-semibold">Good Clinical Practice (GCP) Workshop</p>
                      <p className="text-xs text-muted-foreground">By MARC · Day 1 (April 7) · 3 hours · 200 EGP</p>
                    </div>
                    <div>
                      <p className="font-semibold">Environmental Geochemical Data Analysis (Session 1)</p>
                      <p className="text-xs text-muted-foreground">By Dr. Jan Sedláček — Czech Geological Survey · April 7, 90 min · Free, No Registration Required</p>
                    </div>
                    <div>
                      <p className="font-semibold">Environmental Geochemical Data Analysis (Session 2)</p>
                      <p className="text-xs text-muted-foreground">By Dr. Jan Sedláček — Czech Geological Survey · April 8, 90 min · Free, No Registration Required</p>
                    </div>
                    <div>
                      <p className="font-semibold">Bioinformatics Workshop</p>
                      <p className="text-xs text-muted-foreground">By Dr. Dina Amr · Day 2 (April 8) · 09:35–12:15 · ~2.5 hours</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <Badge className="bg-green-100 text-green-800 mb-2">Post-Conference | April 9</Badge>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Introduction to Single Cell Genomics</p>
                      <p className="text-xs text-muted-foreground">By EgCompBio &amp; GARN · April 9 · 10:00 AM – 1:00 PM · 3 hours · 30 seats</p>
                    </div>
                    <div>
                      <p className="font-semibold">AI Meets Biotech</p>
                      <p className="text-xs text-muted-foreground">By AI بالعربي · April 9 · 1:00 PM – 3:00 PM · 2 hours · 100 EGP (incl. certificate)</p>
                    </div>
                    <div>
                      <p className="font-semibold">From Lab to Global Opportunities: How to Prepare for Scholarships and Research Abroad</p>
                      <p className="text-xs text-muted-foreground">By GESR (Dr. Nourhan Hassan &amp; Dr. Hazem Badawy) · April 9 · 3:00 PM – 6:00 PM · 3 hours · Free</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <Badge className="bg-orange-100 text-orange-800 mb-2">Post-Conference | April 12</Badge>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Integrating Genomics &amp; Proteomics in Biopharmaceutical R&amp;D</p>
                      <p className="text-xs text-muted-foreground">By HVD Life Sciences · Sunday, April 12, 2026 · Full Day ~5 Hours · HVD Company, New Cairo · 30 seats</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                * Workshop fee: 200 EGP per workshop · Payment via InstaPay (CBE account: 9450882167) · Limited to 30 participants each
              </p>
            </CardContent>
          </Card>

          {/* Sponsor Awards Summary */}
          <Card className="mt-6 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Sponsor Awards & Prizes | جوائز الرعاة
              </CardTitle>
              <CardDescription>13 sponsor prizes awarded at the closing ceremony — April 8, 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1">
                  <p className="font-semibold text-amber-900">🏆 Medsol Corporation</p>
                  <p className="text-amber-800">Best Innovative Research Idea — Cash prizes: 1st 3,000 EGP · 2nd 2,000 EGP · 3rd 1,000 EGP</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1">
                  <p className="font-semibold text-amber-900">🏆 MARC</p>
                  <p className="text-amber-800">Best Poster — 1st 2,500 EGP · 2nd 1,500 EGP · 3rd 1,000 EGP + 2 Training Opportunities</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-1">
                  <p className="font-semibold text-blue-900">🌱 NAWAH Scientific</p>
                  <p className="text-blue-800">Scientific Incubators for outstanding Master's & PhD projects (announced July 2026)</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 space-y-1">
                  <p className="font-semibold text-red-900">🤖 AI بالعربي</p>
                  <p className="text-red-800">Full technical support for 1 outstanding AI/ML/Bioinformatics project</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 space-y-1">
                  <p className="font-semibold text-pink-900">💊 Mina Pharm</p>
                  <p className="text-pink-800">Health product samples + 2 exclusive surprise gift bags</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 space-y-1">
                  <p className="font-semibold text-green-900">🧬 Agitech</p>
                  <p className="text-green-800">4 gift bags containing free sample kits</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 space-y-1">
                  <p className="font-semibold text-purple-900">🚀 Startup Grind</p>
                  <p className="text-purple-800">Project selection & entrepreneurial mentorship for AI/ML/Bioinformatics projects</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 space-y-1">
                  <p className="font-semibold text-indigo-900">🎓 Colors Educational Hub</p>
                  <p className="text-indigo-800">3 internship training awards: 1 Graduation Project + 2 Master's Projects</p>
                </div>
                <div className="bg-lime-50 p-3 rounded-lg border border-lime-200 space-y-1">
                  <p className="font-semibold text-lime-900">🌿 Chitosan</p>
                  <p className="text-lime-800">Chitosan supply + technical support for 1 project in biopackaging or bioremediation</p>
                </div>
                <div className="bg-violet-50 p-3 rounded-lg border border-violet-200 space-y-1">
                  <p className="font-semibold text-violet-900">🧪 GEnoEra Technology</p>
                  <p className="text-violet-800">7 molecular biology kits (4 DNA/PCR bags + 3 RNA/cDNA/qPCR bags)</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 space-y-1">
                  <p className="font-semibold text-teal-900">💻 EgCompBio</p>
                  <p className="text-teal-800">1 free computational biology course for 1 outstanding student</p>
                </div>
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-200 space-y-1">
                  <p className="font-semibold text-sky-900">⚡ Plasma</p>
                  <p className="text-sky-800">Internship + full research funding for 1 project + lab support + conference gifts</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-900">🌍 GESR</p>
                  <p className="text-slate-800">5 GESR Mentorship Program selections + 5 GESR Summer Conference invitations</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">* All awards announced at the Closing Ceremony — April 8, 2026 · 15:10–16:30 · Main Hall</p>
            </CardContent>
          </Card>
          {/* Important Notes */}
          <Card className="mt-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Important Information | معلومات مهمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-primary mb-2">Conference Halls:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Hall A:</strong> Biological & Chemical Sciences — Plenary Speakers (Connected to all halls for plenary sessions)</li>
                  <li><strong>Hall B:</strong> Geology, Physics, Mathematics, Astronomy & other sciences — Plenary Speakers</li>
                  <li><strong>Hall C:</strong> Biological & Chemical Sciences — Participant Presentations</li>
                  <li><strong>Hall D:</strong> Geology, Physics, Mathematics, Astronomy & other sciences — Participant Presentations</li>
                </ul>
              </div>
              <div dir="rtl">
                <p className="font-semibold text-primary mb-2">القاعات:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>القاعة أ:</strong> العلوم البيولوجية والكيميائية — المتحدثون الرئيسيون (متصلة بجميع القاعات للجلسات الرئيسية)</li>
                  <li><strong>القاعة ب:</strong> الجيولوجيا، الفيزياء، الرياضيات، الفلك والعلوم الأخرى — المتحدثون الرئيسيون</li>
                  <li><strong>القاعة ج:</strong> العلوم البيولوجية والكيميائية — عروض المشاركين</li>
                  <li><strong>القاعة د:</strong> الجيولوجيا، الفيزياء، الرياضيات، الفلك والعلوم الأخرى — عروض المشاركين</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export as PDF | تحميل PDF
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/'}
              className="bg-primary hover:bg-primary/90"
            >
              Back to Home | العودة للرئيسية
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
