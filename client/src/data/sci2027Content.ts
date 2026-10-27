export type BilingualText = {
  en: string;
  ar: string;
};

export type ResearchTrack = BilingualText & {
  number: number;
  focus: BilingualText;
  topics: string[];
  color: "emerald" | "cyan" | "rose" | "violet" | "blue" | "amber";
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
      en: "Workshop days: 6 and 9 April 2027 · optional cultural visit: 9 April 2027",
      ar: "أيام الورش: 6 و9 أبريل 2027 · الزيارة الثقافية الاختيارية: 9 أبريل 2027",
    },
    location: {
      en: "Cairo University Conference Center, University City, Cairo, Egypt",
      ar: "مركز المؤتمرات، جامعة القاهرة، المدينة الجامعية، القاهرة، مصر",
    },
  },
  assets: {
    detailedPoster: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ejMHwlwJltrmxUkG.png",
    simplePoster: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ZtqHzzjZVdNkxKtx.png",
    cairoUniversityLogo: "/sci-2027/logos/cairo-university.jpg",
    conferenceUnitLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/gtuexwapccjDWTPs.png",
    conferenceUnitMark: "/sci-2027/logos/conference-unit-vertical.png",
    sci2027Logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/uqFRPtUzZKayxyFc.png",
    sciMasterLogo: "/sci-2027/logos/sci-master-logo.jpg",
    brochureEnglish: "/sci-2027/documents/SCI2027-Trifold-Brochure-EN.pdf",
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
    },
    {
      name: "Prof. Sohair Ramadan Fahmy",
      nameAr: "الأستاذ الدكتور سهير رمضان فهمي",
      role: "Dean of the Faculty of Science, Cairo University",
      roleAr: "عميد كلية العلوم، جامعة القاهرة",
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
      ],
      color: "emerald",
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
      ],
      color: "cyan",
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
      ],
      color: "rose",
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
      ],
      color: "violet",
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
      ],
      color: "blue",
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
      ],
      color: "amber",
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
      en: "The official abstract-submission link will be announced through SCI 2027 channels.",
      ar: "سيُعلن رابط التقديم الرسمي للملخصات عبر القنوات الرسمية لمؤتمر SCI 2027.",
    },
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
      date: "9 April 2027",
      day: { en: "Post-conference workshops · Friday", ar: "ورش بعد المؤتمر · الجمعة" },
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
      date: "9 April 2027",
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
      url: "https://forms.gle/mr2gE9nsbdPrha9r6",
    },
    speaker: {
      name: {
        en: "Speaker registration",
        ar: "تسجيل المتحدثين",
      },
      description: {
        en: "For confirmed speakers and presenting contributors using the official SCI 2027 form.",
        ar: "للمتحدثين المؤكدين والمساهمين بعروض تقديمية عبر الاستمارة الرسمية لمؤتمر SCI 2027.",
      },
      url: "https://forms.gle/FRiza6zpfiQLrgrh8",
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
        en: "Submission deadline and abstract requirements will be announced.",
        ar: "سيُعلن موعد التقديم ومتطلبات الملخص لاحقًا.",
      },
      url: "https://forms.gle/fmXUzEQ85hbXnLFp8",
    },
  },
  sponsorship: {
    contactEmail: "sci.conf.2027@gmail.com",
    ctaLabel: "Request the Sponsorship Prospectus by Email",
    eyebrow: "Partnership and sponsorship",
    title: "Move science from insight to impact.",
    description:
      "Partner with SCI 2027 to connect your organisation with researchers, innovators, students and decision-makers shaping science, technology and industry in Egypt and beyond.",
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
  },
  contact: {
    email: "sci.conf.2027@gmail.com",
    website: "www.scicu.net",
    facebook: "facebook.com/SCI2027",
  },
  archive: {
    title: { en: "SCI 2026 archive", ar: "أرشيف SCI 2026" },
    description: {
      en: "Looking for the 2026 conference photos or certificate services? They remain available in the archived area.",
      ar: "هل تبحث عن صور مؤتمر 2026 أو خدمات الشهادات؟ ما زالت متاحة في منطقة الأرشيف.",
    },
    galleryUrl: "/live-gallery",
    certificateUrl: "/certificate-request",
  },
} as const;
