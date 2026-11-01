export type BilingualText = {
  en: string;
  ar: string;
};

export type WebsiteVisual = {
  url: string;
  alt: string;
  source: "Unsplash" | "SCI 2027 Original";
  licenseUrl?: "https://unsplash.com/license";
};

export type ResearchTrack = BilingualText & {
  number: number;
  focus: BilingualText;
  topics: string[];
  color: "emerald" | "cyan" | "rose" | "violet" | "blue" | "amber";
  visual: WebsiteVisual;
};

export type Milestone = BilingualText & {
  date: string;
};

export type ProgrammeDay = {
  date: string;
  day: BilingualText;
  purpose: BilingualText;
  sessions: BilingualText[];
};

const SCI2027_FORM_URLS = {
  general: "https://forms.gle/mr2gE9nsbdPrha9r6",
  speaker: "https://forms.gle/FRiza6zpfiQLrgrh8",
  studentResearch: "https://forms.gle/fmXUzEQ85hbXnLFp8",
} as const;

export const sci2027Content = {
  sourceNote:
    "Prepared from the official SCI 2027 English and Arabic brochures, logo folder, posters, and published registration forms supplied by the Conference Organization Unit.",
  identity: {
    edition: "SCI 2027",
    title: "Science at the Core of Innovation",
    titleAr: "العلوم في قلب الابتكار",
    conferenceType: {
      en: "The 1st International Conference of the Faculty of Science, Cairo University",
      ar: "المؤتمر الدولي الأول لكلية العلوم، جامعة القاهرة",
    },
    theme: {
      en: "Towards Effective Partnership and Sustainable Impact",
      ar: "نحو شراكات فعالة وأثر مستدام",
    },
    dates: {
      en: "7–8 April 2027",
      ar: "7–8 أبريل 2027",
    },
    workshopDate: {
      en: "Workshop days: 6 and 10 April 2027 · optional cultural visit: 10 April 2027",
      ar: "أيام الورش: 6 و10 أبريل 2027 · الزيارة الثقافية الاختيارية: 10 أبريل 2027",
    },
    location: {
      en: "Conference Center - Cairo University, Beside Students City, Dr. Mikel Bakhoum Rd, Dokki, Giza, Egypt",
      ar: "مركز المؤتمرات - جامعة القاهرة، بجوار المدينة الجامعية، شارع د. ميكل بخوم، الدقي، الجيزة، مصر",
      name: "Conference Center - Cairo University",
      shortAddress: "Beside Students City, Dr. Mikel Bakhoum Rd, Dokki, Giza",
      mapUrl: "https://share.google/pJzENeit3jQYXskJq",
      directionsLabel: "Get directions",
      venueVisuals: [
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/pFNFKsusxfqWrAtM.webp",
          alt: "Conference Center - Cairo University main auditorium, audience seating and meeting lounge facilities.",
          source: "SCI 2027 venue photograph",
          caption: "Main auditorium and meeting facilities at the Conference Center - Cairo University.",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/UEidnmVGGTKtYHmV.webp",
          alt: "Conference Center - Cairo University entrance, registration lobby, meeting room and auditorium facilities.",
          source: "SCI 2027 venue photograph",
          caption: "Entrance, registration lobby, meeting room and auditorium facilities at the Conference Center - Cairo University.",
        },
      ],
      venueGallery: [
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/kCjPtVKGSDxCdfzR.webp",
          alt: "Conference Center - Cairo University entrance and front approach.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/alOtVhrUCouBsCNp.webp",
          alt: "Interior corridor of the Conference Center - Cairo University.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KFfkggiQSZJPLrBD.webp",
          alt: "Conference Center - Cairo University facade with arched entrance.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/MyBSKNXOgnnTQUMx.webp",
          alt: "Interior lobby with a Cairo University mural at the Conference Center.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/zLdZEtElmmfEdlWB.webp",
          alt: "Reception lounge at the Conference Center - Cairo University.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/DknNkaAtEcooBNfs.webp",
          alt: "Central atrium inside the Conference Center - Cairo University.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ynoJmwPMufhUJHHl.webp",
          alt: "Exterior facade of the Conference Center - Cairo University.",
          source: "SCI 2027 venue photograph",
        },
        {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/RNkygPiWsXkhvdSC.webp",
          alt: "Upper atrium and skylight at the Conference Center - Cairo University.",
          source: "SCI 2027 venue photograph",
        },
      ],
    },
  },
  assets: {
    detailedPoster: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ejMHwlwJltrmxUkG.png",
    simplePoster: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ZtqHzzjZVdNkxKtx.png",
    cairoUniversityLogo: "/sci-2027/logos/cairo-university.jpg",
    conferenceUnitLogo: "/sci-2027/logos/conference-unit-logo.755cd17d.png",
    conferenceUnitMark: "/sci-2027/logos/conference-unit-vertical.png",
    sci2027Logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/DIUxVumTChoaEhaG.png",
    sciMasterLogo: "/sci-2027/logos/sci-master-logo.jpg",
    brochureEnglish: "https://drive.google.com/uc?export=download&id=1XfDPdrLjCDbG44VOjhJBdjiuSjDSNpmv",
    brochureArabic: "/sci-2027/documents/SCI2027-Brochure-AR.pdf",
  },
  videos: [
    {
      id: "discover-create-connect",
      title: "Experience SCI 2027: Discover, Create, Connect",
      description:
        "A glimpse of the SCI 2027 experience, from research exchange and hands-on innovation to the conversations that connect a scientific community.",
      language: "English",
      duration: "30 seconds",
      aspect: "landscape",
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/DIQkCKtyFXKPrYHF.mp4",
      posterUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GZrgfLuKnVOoqnLL.jpg",
      featured: true,
    },
    {
      id: "science-across-scales",
      title: "SCI 2027: Science at the Core of Innovation",
      description:
        "Travel from the cosmos to the molecular world and discover how science, nature and artificial intelligence connect to shape tomorrow’s solutions.",
      language: "Arabic voice-over",
      duration: "45 seconds",
      aspect: "landscape",
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/URpKPRFVVosTYfZu.mp4",
      posterUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/wTkPulziRhpfIRvh.jpg",
      featured: false,
    },
    {
      id: "looking-ahead",
      title: "Looking Ahead to SCI 2027: Building on Innovation",
      description:
        "Relive highlights from SCI 2026 and look ahead to the first international SCI 2027 conference at Cairo University.",
      language: "Instrumental",
      duration: "47 seconds",
      aspect: "square",
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/IIEJajMbMuecgVXK.mp4",
      posterUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/DgmAwNjnjZaNkQQq.jpg",
      featured: false,
    },
    {
      id: "save-the-date",
      title: "SCI 2027: Save the Date & Conference Overview",
      description:
        "A concise English overview of the conference, its six scientific tracks, international keynotes, workshops and the invitation to share your research.",
      language: "English",
      duration: "29 seconds",
      aspect: "portrait",
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/POXeeKtpozxdoDew.mp4",
      posterUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/rXVFeXyaDytqzHkI.jpg",
      featured: false,
    },
  ],
  patronage: [
    {
      name: "Prof. Mohamed Sami Abdel-Sadek",
      nameAr: "الأستاذ الدكتور محمد سامي عبد الصادق",
      role: "President of Cairo University",
      roleAr: "رئيس جامعة القاهرة",
      photo: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/DgwzbMEqKBEXBlYI.webp",
        alt: "Prof. Mohamed Sami Abdel-Sadek, President of Cairo University.",
      },
    },
    {
      name: "Prof. Sohair Ramadan Fahmy",
      nameAr: "الأستاذ الدكتور سهير رمضان فهمي",
      role: "Dean of the Faculty of Science, Cairo University",
      roleAr: "عميد كلية العلوم، جامعة القاهرة",
      photo: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/bMRokNwXdByfPRny.webp",
        alt: "Prof. Sohair Ramadan Fahmy, Dean of the Faculty of Science, Cairo University.",
      },
    },
  ],
  organizer: {
    name: {
      en: "Conference Organization Unit, Faculty of Science, Cairo University",
      ar: "وحدة تنظيم المؤتمرات، كلية العلوم، جامعة القاهرة",
    },
    head: {
      en: "Unit Head: Prof. Walid Rahouma",
      ar: "رئيس الوحدة: الأستاذ الدكتور وليد رحومة",
    },
  },
  conferenceOrganizationUnit: {
    title: "Conference Organization Unit",
    institution: "Faculty of Science, Cairo University",
    description:
      "The Conference Organization Unit at the Faculty of Science, Cairo University supports the planning, coordination, and professional management of scientific conferences and events, fostering academic and research collaboration locally and internationally.",
    visual: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/pTwOOFPnqxSvPByJ.webp",
      alt: "Professional planning meeting viewed from above with colleagues reviewing materials around a shared table.",
      source: "Unsplash",
      licenseUrl: "https://unsplash.com/license",
    },
    objectives: [
      {
        title: "Organizational Excellence",
        description: "Develop professional processes for planning and organizing scientific conferences and events.",
      },
      {
        title: "Scientific Excellence",
        description: "Support scientific events and the exchange of research knowledge.",
      },
      {
        title: "Partnerships and International Collaboration",
        description: "Strengthen cooperation with universities, research centers and institutions.",
      },
      {
        title: "Sustainability and Development",
        description: "Improve procedures and templates and continuously evaluate performance.",
      },
    ],
    members: [
      {
        name: "Prof. Walid Rahouma",
        department: "Astronomy & Space Sciences",
        role: "Director of the Unit",
        summary: "Provides overall leadership, sets the Unit’s direction and plan, coordinates with Faculty leadership and stakeholders, and approves final outputs and reports.",
      },
      {
        name: "Prof. Mohamed Qarny",
        department: "Geology",
        role: "Secretary of the Unit",
        summary: "Prepares meeting agendas and minutes, follows up decisions and assignments, manages official records, and supports administrative coordination across the Unit.",
      },
      {
        name: "Mrs. Manar Mohamed",
        department: "Conference Organization Unit",
        role: "Administrative Secretary to the Unit",
        summary: "Supports the Unit’s daily administration through official correspondence, records, scheduling and administrative follow-up.",
      },
      {
        name: "Dr. Nahla Osama",
        department: "Biotechnology",
        role: "Scientific Programme Lead",
        summary: "Coordinates scientific programmes, speakers, abstracts, research papers and review processes to help safeguard the quality of scientific content.",
      },
      {
        name: "Prof. Rania Ali",
        department: "Botany",
        role: "Media & Marketing Lead",
        summary: "Leads communications and marketing plans, digital content and platforms, promotional materials, and engagement with relevant media partners.",
      },
      {
        name: "Dr. Nourhan Hassan",
        department: "Biotechnology",
        role: "Sponsorship, Funding & Conference Website Lead",
        summary: "Develops sponsor and funder engagement, prepares sponsorship proposals, and leads conference website design, content, user experience and ongoing updates.",
      },
      {
        name: "Prof. Azza Shoukry",
        department: "Chemistry",
        role: "Registration & Operations Lead",
        summary: "Leads participant registration, reception and participant flow to support a smooth and welcoming conference experience.",
      },
      {
        name: "Dr. Dina Amr",
        department: "Biotechnology",
        role: "Logistics Lead",
        summary: "Leads conference logistics, coordinating venues, equipment, hospitality, accommodation, transport and participant or speaker support needs.",
      },
    ],
    facultyUrl: "https://scicu.net/",
    unitUrl: "https://scicu.net/Important%20Links/conference-organization",
  },
  overview: {
    en: "SCI 2027 brings researchers, academics, students, innovators, industry partners and decision-makers together to connect foundational science with applications, products, services and policies that create tangible societal value.",
    ar: "يجمع SCI 2027 الباحثين والأكاديميين والطلاب والمبتكرين وشركاء الصناعة وصنّاع القرار لربط العلوم الأساسية بالتطبيقات والمنتجات والخدمات والسياسات ذات الأثر المجتمعي الملموس.",
  },
  objectives: [
    {
      en: "Showcase advances in basic and applied sciences with a focus on research close to application.",
      ar: "عرض أحدث الأبحاث في العلوم الأساسية والتطبيقية مع التركيز على الأبحاث القريبة من التطبيق.",
    },
    {
      en: "Build sustainable partnerships among universities, research centers and industry.",
      ar: "بناء شراكات مستدامة بين الجامعات ومراكز البحوث والقطاع الصناعي.",
    },
    {
      en: "Connect Egyptian researchers with international experts and new opportunities for joint grants and collaboration.",
      ar: "ربط الباحثين المصريين بالخبراء الدوليين وفتح آفاق للمنح المشتركة والتعاون.",
    },
    {
      en: "Empower students and early-career researchers to present work, receive feedback and compete for awards.",
      ar: "إتاحة منصة للباحثين الشباب وطلاب الدراسات العليا لعرض أعمالهم وتلقي التقييم والتنافس على الجوائز.",
    },
  ],
  impact: [
    { value: "150", label: { en: "participants", ar: "مشاركًا" } },
    { value: "6", label: { en: "scientific tracks", ar: "محاور علمية" } },
    { value: "6", label: { en: "parallel halls", ar: "قاعات متوازية" } },
    { value: "2", label: { en: "workshop days", ar: "يومان للورش" } },
  ],
  speakers: {
    eyebrow: "Featured voices",
    title: "Keynote and invited speakers",
    status: "Keynote and invited speakers will be announced soon.",
    groups: [
      {
        title: "Keynote Speakers",
        status: "To be announced",
        description: "The confirmed keynote speaker list and session titles will be announced through SCI 2027 channels.",
      },
      {
        title: "Invited Speakers",
        status: "To be announced",
        description: "The confirmed invited speaker list and session details will be announced through SCI 2027 channels.",
      },
    ],
  },
  tracks: [
    {
      number: 1,
      en: "Life Sciences and Biodiversity",
      ar: "علوم الحياة والتنوع البيولوجي",
      focus: {
        en: "Life for a sustainable planet",
        ar: "الحياة من أجل كوكب مستدام",
      },
      topics: [
        "Biological sciences",
        "Biotechnology",
        "Molecular biology and genetics",
        "Microbiology",
        "Bioinformatics and systems biology",
        "Biodiversity and conservation",
        "Synthetic biology and biodesign",
        "Plant, agricultural and food biotechnology",
        "Ecology, ecosystem restoration and bioremediation",
        "Biomedicine, translational biosciences and health technologies",
      ],
      color: "emerald",
      visual: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/peCUnLpTuUEqZjGl.webp",
        alt: "Original SCI 2027 editorial visual combining biodiversity, botanical life, DNA and microscopic cell structures.",
        source: "SCI 2027 Original",
      },
    },
    {
      number: 2,
      en: "Environment and Earth Sciences",
      ar: "علوم البيئة والأرض",
      focus: {
        en: "Solutions for a changing world",
        ar: "حلول لعالم متغير",
      },
      topics: [
        "Environmental monitoring and pollution",
        "Climate and meteorological sciences",
        "Geology and geophysics",
        "Hydrology and water resources",
        "Remote sensing and GIS",
        "Sustainability and natural hazards",
        "Soil, land use and geospatial planning",
        "Circular economy and resource recovery",
        "Coastal, marine and freshwater systems",
        "Climate resilience and environmental risk management",
      ],
      color: "cyan",
      visual: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/uSlqnHzBlTSlszrN.webp",
        alt: "Original SCI 2027 editorial visual combining geological landscapes, water systems, climate resilience and clean energy.",
        source: "SCI 2027 Original",
      },
    },
    {
      number: 3,
      en: "Materials and Chemistry",
      ar: "المواد والكيمياء",
      focus: {
        en: "From molecules to a better tomorrow",
        ar: "من الجزيئات إلى غد أفضل",
      },
      topics: [
        "Analytical, organic, inorganic and physical chemistry",
        "Materials science and nanotechnology",
        "Green chemistry",
        "Catalysis",
        "Polymers and advanced materials",
        "Energy materials",
        "Medicinal, pharmaceutical and bioanalytical chemistry",
        "Chemical sensors, spectroscopy and surface science",
        "Electrochemistry, batteries and energy storage",
        "Industrial chemistry, process intensification and scale-up",
      ],
      color: "rose",
      visual: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/zqjuRoOksnKIPDeQ.webp",
        alt: "Original SCI 2027 editorial visual combining a molecular lattice, crystalline materials and energy-storage research.",
        source: "SCI 2027 Original",
      },
    },
    {
      number: 4,
      en: "Physics, Energy and Space Sciences",
      ar: "الفيزياء والطاقة وعلوم الفضاء",
      focus: {
        en: "Exploring new horizons",
        ar: "استكشاف آفاق جديدة",
      },
      topics: [
        "Applied and theoretical physics",
        "Renewable energy and energy systems",
        "Atomic, molecular and optical physics",
        "Nuclear and radiation physics",
        "Astrophysics and space sciences",
        "Condensed matter physics and nanophysics",
        "Quantum science and technology",
        "Plasma physics and fusion energy",
        "Astronomy instrumentation and space data analysis",
        "Radiation applications, imaging and detector technologies",
      ],
      color: "violet",
      visual: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/QeXUTzQOUNiLxSXL.webp",
        alt: "Original SCI 2027 editorial visual combining an observatory telescope, cosmic light phenomena and renewable energy.",
        source: "SCI 2027 Original",
      },
    },
    {
      number: 5,
      en: "AI, Data Science and Computational Science",
      ar: "الذكاء الاصطناعي وعلوم البيانات والحوسبة العلمية",
      focus: {
        en: "Intelligence in the service of discovery",
        ar: "الذكاء في خدمة الاكتشاف",
      },
      topics: [
        "Artificial intelligence and machine learning",
        "Big data analytics",
        "Scientific computing",
        "Mathematical modelling and statistics",
        "Computational simulation",
        "Digital innovation",
        "Computer vision, natural language processing and multimodal AI",
        "Digital twins, high-performance computing and cloud systems",
        "Trustworthy AI, cybersecurity and data privacy",
        "Robotics, automation and intelligent systems",
      ],
      color: "blue",
      visual: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/NSEFUasvwjrXIBkB.webp",
        alt: "Original SCI 2027 editorial visual combining responsible artificial intelligence, data networks, robotics and scientific computing.",
        source: "SCI 2027 Original",
      },
    },
    {
      number: 6,
      en: "Innovation, Entrepreneurship and Science for Society",
      ar: "الابتكار وريادة الأعمال والعلوم من أجل المجتمع",
      focus: {
        en: "From ideas to real impact",
        ar: "من الأفكار إلى أثر حقيقي",
      },
      topics: [
        "Scientific innovation and entrepreneurship",
        "Technology transfer",
        "Academia–industry collaboration",
        "Science communication and education",
        "Responsible innovation and public policy",
        "Sustainable development goals",
        "Research commercialization and startup development",
        "Innovation funding, incubation and acceleration",
        "Social innovation and community-based solutions",
        "Digital transformation and innovation ecosystems",
      ],
      color: "amber",
      visual: {
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KWCzRNmgfNkuQurT.webp",
        alt: "Original SCI 2027 editorial visual combining researchers, prototype development, industry partnership and community impact.",
        source: "SCI 2027 Original",
      },
    },
  ] satisfies ResearchTrack[],
  importantDates: [
    {
      date: "1 November 2026",
      en: "Abstract submission opens",
      ar: "بدء استقبال الملخصات",
    },
    {
      date: "30 January 2027",
      en: "Early abstract submission deadline",
      ar: "آخر موعد للتقديم المبكر للملخصات",
    },
    {
      date: "15 February 2027",
      en: "Abstract submission deadline",
      ar: "آخر موعد لتقديم الملخصات",
    },
    {
      date: "1 March 2027",
      en: "Late abstract submission / registration opens",
      ar: "آخر موعد متأخر للملخصات / بدء التسجيل",
    },
    {
      date: "15 March 2027",
      en: "Abstract-review results",
      ar: "إعلان نتائج التحكيم",
    },
    {
      date: "25 March 2027",
      en: "Final registration deadline",
      ar: "آخر موعد للتسجيل",
    },
  ] satisfies Milestone[],
  abstractCall: {
    title: {
      en: "Share your research. Shape the future.",
      ar: "شارك ببحثك. اصنع المستقبل.",
    },
    description: {
      en: "Researchers, academics, postgraduate and undergraduate students, and industry professionals are invited to submit original research relevant to the six SCI 2027 tracks.",
      ar: "تدعو SCI 2027 الباحثين والأكاديميين وطلاب الدراسات العليا والبكالوريوس والمهنيين من القطاع الصناعي لتقديم أبحاث أصلية ذات صلة بمحاور المؤتمر الستة.",
    },
    requirements: [
      "Abstracts must be written in English.",
      "Maximum abstract length: 300 words.",
      "Include the title, author names, affiliations and corresponding author contact information.",
      "Provide 3–5 keywords.",
      "Summarise research background, objectives, methodology, principal results and conclusions.",
    ],
    status: {
      en: "Abstract submissions are accepted through the relevant SCI 2027 form below.",
      ar: "تُقبل الملخصات البحثية عبر استمارة SCI 2027 المناسبة أدناه.",
    },
    submissionOptions: [
      {
        label: "Submit a Speaker Abstract",
        audience: "For researchers, academics and industry professionals.",
        url: SCI2027_FORM_URLS.speaker,
      },
      {
        label: "Submit Student Research / Thesis / Project",
        audience: "For undergraduate and postgraduate students.",
        url: SCI2027_FORM_URLS.studentResearch,
      },
    ],
  },
  publicationOpportunity: {
    title: "Publication Opportunity",
    journalName: "Global Journal of Scientific Research (GJSR)",
    description: "Researchers participating in SCI 2027 who are interested in publishing their research in the Global Journal of Scientific Research (GJSR) may explore the journal’s scope and submission information.",
    ctaLabel: "Visit Global Journal of Scientific Research",
    notice: "Publication is subject to the journal’s editorial and peer-review process.",
    feeCalloutLabel: "Combined registration & publication option",
    paymentDetailsLinkLabel: "View registration options & payment details",
    url: "https://gjsr.journals.ekb.eg",
  },
  programme: [
    {
      date: "6 April 2027",
      day: { en: "Pre-conference workshops · Tuesday", ar: "ورش قبل المؤتمر · الثلاثاء" },
      purpose: { en: "Professional learning before the main conference", ar: "تعلم مهني قبل المؤتمر الرئيسي" },
      sessions: [
        { en: "Workshop programme to be announced", ar: "سيُعلن برنامج الورش لاحقًا" },
        { en: "Detailed timing and registration information to be announced", ar: "سيُعلن التوقيت التفصيلي ومعلومات التسجيل لاحقًا" },
      ],
    },
    {
      date: "7 April 2027",
      day: { en: "Day 1 · Wednesday", ar: "اليوم الأول · الأربعاء" },
      purpose: { en: "Opening, keynote dialogue and parallel science", ar: "الافتتاح والجلسة الرئيسية والجلسات العلمية المتوازية" },
      sessions: [
        { en: "Opening and university welcome", ar: "افتتاح وترحيب الجامعة" },
        { en: "Keynote Speaker Session · To be announced", ar: "جلسة المتحدثين الرئيسيين · يُعلن لاحقًا" },
        { en: "Invited Speaker Sessions · To be announced", ar: "جلسات المتحدثين المدعوين · يُعلن لاحقًا" },
        { en: "Scientific poster sessions", ar: "جلسات الملصقات العلمية" },
      ],
    },
    {
      date: "8 April 2027",
      day: { en: "Day 2 · Thursday", ar: "اليوم الثاني · الخميس" },
      purpose: { en: "Research exchange, innovation exhibition and partnership forum", ar: "تبادل علمي ومعرض للابتكار ومنتدى للتعاون البحثي" },
      sessions: [
        { en: "Invited Speaker Sessions · To be announced", ar: "جلسات المتحدثين المدعوين · يُعلن لاحقًا" },
        { en: "Scientific sessions across six halls", ar: "جلسات علمية في ست قاعات متوازية" },
        { en: "Poster sessions", ar: "جلسات الملصقات العلمية" },
        { en: "Innovation exhibition and research collaboration forum", ar: "معرض الابتكار ومنتدى التعاون البحثي" },
        { en: "Closing recommendations and partnership announcements", ar: "الجلسة الختامية وإعلان التوصيات والشراكات" },
      ],
    },
    {
      date: "10 April 2027",
      day: { en: "Post-conference workshops · Saturday", ar: "ورش بعد المؤتمر · السبت" },
      purpose: { en: "Professional learning and an optional cultural experience", ar: "تعلم مهني وتجربة ثقافية اختيارية" },
      sessions: [
        { en: "Workshop programme to be announced", ar: "سيُعلن برنامج الورش لاحقًا" },
        { en: "Optional visit to the Grand Egyptian Museum", ar: "زيارة اختيارية للمتحف المصري الكبير" },
      ],
    },
  ] satisfies ProgrammeDay[],
  workshopProgramme: {
    status: "Workshop programme, detailed timing and registration information to be announced.",
    preConference: {
      date: "6 April 2027",
      label: "Pre-conference workshops",
    },
    postConference: {
      date: "10 April 2027",
      label: "Post-conference workshops",
      optionalActivity: "Optional cultural experience: Grand Egyptian Museum visit",
    },
  },
  registration: {
    general: {
      name: {
        en: "General attendee registration",
        ar: "تسجيل الحضور العام",
      },
      description: {
        en: "For researchers, academics, students, industry professionals and other attendees.",
        ar: "للباحثين والأكاديميين والطلاب والمهنيين من القطاع الصناعي وباقي الحضور.",
      },
      url: SCI2027_FORM_URLS.general,
    },
    speaker: {
      name: {
        en: "Speaker & Abstract Submission",
        ar: "تسجيل المتحدثين",
      },
      description: {
        en: "For researchers, academics and industry professionals submitting an abstract through the official SCI 2027 form.",
        ar: "للمتحدثين المؤكدين والمساهمين بعروض تقديمية عبر الاستمارة الرسمية لمؤتمر SCI 2027.",
      },
      url: SCI2027_FORM_URLS.speaker,
    },
    studentResearch: {
      name: {
        en: "Student Research, Thesis & Graduation Project Registration",
        ar: "تسجيل أبحاث الطلاب والرسائل ومشروعات التخرج",
      },
      description: {
        en: "For undergraduate and postgraduate students presenting student research, thesis work, or graduation projects.",
        ar: "لطلاب البكالوريوس والدراسات العليا الذين يقدمون أبحاثًا طلابية أو رسائل علمية أو مشروعات تخرج.",
      },
      notice: {
        en: "Abstract submissions are accepted through this form. A submission deadline has not yet been announced.",
        ar: "سيُعلن موعد التقديم ومتطلبات الملخص لاحقًا.",
      },
      url: SCI2027_FORM_URLS.studentResearch,
    },
  },
  registrationFees: {
    title: "Registration Fees & Payment",
    eyebrow: "Plan your participation",
    description: "Choose the participation pathway and attendee group that reflect your SCI 2027 contribution. Fees below are in Egyptian pounds (EGP).",
    audienceGroups: [
      "Undergraduate",
      "Postgraduate",
      "Prof. & Faculty / Researchers",
    ],
    options: [
      { label: "Attendance", amounts: ["EGP 250", "EGP 400", "EGP 1,000"] },
      { label: "Attendance + presenting", amounts: ["EGP 350", "EGP 500", "EGP 1,500"] },
      { label: "Attendance + GJSR publication", amounts: ["Not available", "EGP 750", "EGP 2,000"] },
    ],
    publicationOption: {
      title: "Attendance + GJSR publication",
      feeSummary: "Postgraduate: EGP 750 · Prof. & Faculty / Researchers: EGP 2,000",
      condition: "The combined amount includes conference attendance and is payable only after the manuscript is accepted by GJSR through its editorial and peer-review process.",
      combinedWithAttendance: true,
      payableAfterJournalAcceptance: true,
    },
    addOns: [
      { label: "Gala dinner", amount: "EGP 650", detail: "Optional for all registration categories" },
      { label: "Museum visit", amount: "Price to be announced", detail: "Optional add-on" },
    ],
    payment: {
      method: "InstaPay",
      bank: "Central Bank of Egypt (CBE)",
      identifier: "9450882167",
      confirmationEmail: "sci.conf.2027@gmail.com",
      instruction: "Transfer the applicable amount to the account below, then email your payment proof to confirm your registration.",
    },
    receiptDetails: [
      "Full name",
      "Registration category",
      "Transferred amount",
      "A clear image or copy of the transfer receipt",
    ],
    confirmationNote: "Registration will be confirmed after payment proof is reviewed.",
  },
  sponsorship: {
    contactEmail: "sci.conf.2027@gmail.com",
    ctaLabel: "Request the Sponsorship Prospectus by Email",
    eyebrow: "Partnership and sponsorship",
    title: "Move science from insight to impact.",
    description:
      "Partner with SCI 2027 to connect your organisation with researchers, innovators, students and decision-makers shaping science, technology and industry in Egypt and beyond.",
    visual: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/HJojRwlLYsMbRRzK.webp",
      alt: "Professionals collaborating in a bright meeting room to build a strategic partnership.",
      source: "Unsplash",
      licenseUrl: "https://unsplash.com/license",
    },
    credibility: [
      {
        value: "1,088",
        label: "archival registrations recorded",
        note: "SCI 2026 registration records, not confirmed attendance.",
      },
      { value: "70", label: "verified scientific contributions", note: "Booklet-verified presentations and research contributions." },
      { value: "10", label: "workshops delivered", note: "Professional and scientific workshops in the SCI 2026 programme." },
      { value: "16", label: "partners", note: "Figure stated in the SCI 2027 sponsorship prospectus." },
    ],
    packages: [
      {
        tier: "Platinum",
        investment: "EGP 500,000",
        summary: "Maximum strategic visibility across the conference platform, main stage and delegate experience.",
        exhibition: "6 × 3 m exhibition space",
        registrations: "8 complimentary registrations",
        accent: "gold",
      },
      {
        tier: "Gold",
        investment: "EGP 300,000",
        summary: "A high-impact partnership combining programme visibility, exhibition and direct engagement.",
        exhibition: "3 × 3 m exhibition space",
        registrations: "5 complimentary registrations",
        accent: "navy",
      },
      {
        tier: "Silver",
        investment: "EGP 175,000",
        summary: "A focused presence across the conference platform, exhibition and communications.",
        exhibition: "3 × 2 m exhibition space",
        registrations: "3 complimentary registrations",
        accent: "teal",
      },
      {
        tier: "Bronze",
        investment: "EGP 100,000",
        summary: "An accessible route to conference visibility and direct engagement with delegates.",
        exhibition: "Exhibition desk",
        registrations: "2 complimentary registrations",
        accent: "sand",
      },
    ],
    benefitMatrix: [
      { benefit: "Logo on website, holding slides and abstract book", platinum: "Included", gold: "Included", silver: "Included", bronze: "Included" },
      { benefit: "Logo on main stage backdrop", platinum: "Included", gold: "Included", silver: "—", bronze: "—" },
      { benefit: "Logo on delegate bag and lanyard", platinum: "Included", gold: "—", silver: "—", bronze: "—" },
      { benefit: "Social-media spotlight posts", platinum: "3", gold: "2", silver: "1", bronze: "Group acknowledgement" },
      { benefit: "Industry talk", platinum: "15 min plenary", gold: "10 min parallel", silver: "—", bronze: "—" },
      { benefit: "Industry panel seat", platinum: "Included", gold: "Included", silver: "—", bronze: "—" },
      { benefit: "Sponsored workshop", platinum: "Included", gold: "50% off", silver: "—", bronze: "—" },
      { benefit: "Exhibition space", platinum: "6 × 3 m", gold: "3 × 3 m", silver: "3 × 2 m", bronze: "Desk" },
      { benefit: "Complimentary registrations", platinum: "8", gold: "5", silver: "3", bronze: "2" },
      { benefit: "Networking lunch invitations", platinum: "4", gold: "2", silver: "1", bronze: "—" },
      { benefit: "Abstract book advert", platinum: "Inside cover", gold: "Full page", silver: "Half page", bronze: "Quarter page" },
      { benefit: "Delegate-bag insert", platinum: "Included", gold: "Included", silver: "Included", bronze: "—" },
      { benefit: "Career corner / CV bank", platinum: "Included", gold: "CV bank", silver: "—", bronze: "—" },
    ],
    specialOpportunities: [
      { title: "Keynote session sponsor", contribution: "EGP 100,000–200,000" },
      { title: "Industry–academia partnership forum", contribution: "EGP 100,000–250,000" },
      { title: "International speaker travel support", contribution: "EGP 50,000–150,000" },
      { title: "Young researchers' awards", contribution: "EGP 50,000–100,000" },
      { title: "Student participation grants", contribution: "EGP 25,000–100,000" },
      { title: "Networking reception", contribution: "EGP 100,000–200,000" },
      { title: "Lunch or coffee-break sponsor", contribution: "EGP 25,000–75,000" },
      { title: "Conference app and digital platform", contribution: "EGP 50,000–100,000" },
      { title: "Conference bags, badges and lanyards", contribution: "EGP 30,000–75,000" },
      { title: "Innovation exhibition or startup showcase", contribution: "EGP 50,000–150,000" },
    ],
    sponsorshipCommittee: {
      title: "Sponsorship Committee",
      members: ["Dr. Hoda Abu Shady", "Prof. Azza Shoukry"],
    },
    studentSponsorshipAssistants: {
      title: "Student Sponsorship Assistants",
      description: "Supporting sponsor outreach and partner coordination for SCI 2027.",
      members: ["Youssef Saher Sayed", "Ziad Ahmed"],
    },
  },
  contact: {
    email: "sci.conf.2027@gmail.com",
    website: "www.scicu.net",
    facebook: "facebook.com/SCI2027",
    youtube: {
      url: "https://www.youtube.com/@SCI2027",
      label: "Follow SCI 2027 on YouTube",
      description: "Conference updates, highlights and official videos",
    },
  },
  archive: {
    title: { en: "SCI 2026 archive", ar: "أرشيف SCI 2026" },
    description: {
      en: "Explore the SCI 2026 conference archive and revisit the people, research, collaboration and shared moments that shaped the event.",
      ar: "استكشف أرشيف مؤتمر SCI 2026 واستعد الأشخاص والبحث والتعاون واللحظات المشتركة التي صنعت الفعالية.",
    },
    galleryUrl: "/live-gallery",
  },
} as const;
