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

export type Workshop = BilingualText & {
  track: string;
  timing: BilingualText;
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
      en: "Workshops and an optional cultural visit: 9 April 2027",
      ar: "ورش العمل والزيارة الثقافية الاختيارية: 9 أبريل 2027",
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
    { value: "15", label: { en: "international keynote speakers", ar: "متحدثًا رئيسيًا دوليًا" } },
    { value: "6", label: { en: "scientific tracks", ar: "محاور علمية" } },
    { value: "6", label: { en: "parallel halls", ar: "قاعات متوازية" } },
    { value: "2 + 4", label: { en: "training courses and workshops", ar: "دورات تدريبية وورش عمل" } },
  ],
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
      date: "7 April 2027",
      day: { en: "Day 1 · Wednesday", ar: "اليوم الأول · الأربعاء" },
      purpose: { en: "Opening, keynote dialogue and parallel science", ar: "الافتتاح والجلسة الرئيسية والجلسات العلمية المتوازية" },
      sessions: [
        { en: "Opening and university welcome", ar: "افتتاح وترحيب الجامعة" },
        { en: "International keynote session", ar: "الجلسة الرئيسية للمتحدثين الدوليين" },
        { en: "Invited lectures and six parallel scientific tracks", ar: "محاضرات عامة ومدعوة وستة محاور علمية متوازية" },
        { en: "Poster sessions and first workshop group", ar: "جلسات ملصقات والمجموعة الأولى لورش العمل" },
      ],
    },
    {
      date: "8 April 2027",
      day: { en: "Day 2 · Thursday", ar: "اليوم الثاني · الخميس" },
      purpose: { en: "Research exchange, innovation exhibition and partnership forum", ar: "تبادل علمي ومعرض للابتكار ومنتدى للتعاون البحثي" },
      sessions: [
        { en: "Invited-speaker lectures", ar: "محاضرات المتحدثين المدعوين" },
        { en: "Scientific sessions across six halls", ar: "جلسات علمية في ست قاعات متوازية" },
        { en: "Poster sessions", ar: "جلسات الملصقات العلمية" },
        { en: "Innovation exhibition and research collaboration forum", ar: "معرض الابتكار ومنتدى التعاون البحثي" },
        { en: "Closing recommendations and partnership announcements", ar: "الجلسة الختامية وإعلان التوصيات والشراكات" },
      ],
    },
    {
      date: "9 April 2027",
      day: { en: "Day 3 · Friday", ar: "اليوم الثالث · الجمعة" },
      purpose: { en: "Professional learning and optional cultural experience", ar: "تعلم مهني وتجربة ثقافية اختيارية" },
      sessions: [
        { en: "Second workshop and training group", ar: "المجموعة الثانية لورش العمل والدورات التدريبية" },
        { en: "Optional visit to the Grand Egyptian Museum", ar: "زيارة اختيارية للمتحف المصري الكبير" },
      ],
    },
  ] satisfies ProgrammeDay[],
  workshops: [
    {
      en: "Next-Generation Sequencing data analysis and bioinformatics",
      ar: "تحليل بيانات الجيل التالي من التتابع والمعلوماتية الحيوية",
      track: "1 & 5",
      timing: { en: "7 April · Group 1", ar: "7 أبريل · المجموعة الأولى" },
    },
    {
      en: "Machine learning for researchers in science",
      ar: "تعلم الآلة للباحثين في العلوم",
      track: "5",
      timing: { en: "7 April · Group 1", ar: "7 أبريل · المجموعة الأولى" },
    },
    {
      en: "Scientific writing and publishing in high-impact journals",
      ar: "الكتابة العلمية والنشر في المجلات عالية التأثير",
      track: "All tracks",
      timing: { en: "7 April · Group 1", ar: "7 أبريل · المجموعة الأولى" },
    },
    {
      en: "GIS and remote sensing for environmental monitoring",
      ar: "نظم المعلومات الجغرافية والاستشعار عن بعد للرصد البيئي",
      track: "2",
      timing: { en: "9 April · Group 2", ar: "9 أبريل · المجموعة الثانية" },
    },
    {
      en: "Green synthesis and characterization of nanomaterials",
      ar: "التخليق الأخضر للمواد النانوية وتوصيفها",
      track: "3",
      timing: { en: "9 April · Group 2", ar: "9 أبريل · المجموعة الثانية" },
    },
  ] satisfies Workshop[],
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
  contact: {
    email: "nyehia@sci.cu.edu.eg",
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
