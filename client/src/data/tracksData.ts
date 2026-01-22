import { Microscope, Zap, Atom, Globe, Calculator, Heart, Sparkles, FlaskConical, Telescope } from "lucide-react";
import { TrackData } from "@/components/TrackDetail";

export const tracksData: Record<string, TrackData> = {
  "life-sciences": {
    id: "life-sciences",
    trackNumber: 1,
    icon: Microscope,
    title: "Life Sciences",
    titleAr: "العلوم الحياتية",
    description: "Advancing our understanding of living organisms through cutting-edge research in biology, biotechnology, microbiology, and genetics.",
    descriptionAr: "تطوير فهمنا للكائنات الحية من خلال الأبحاث المتقدمة في علم الأحياء والتكنولوجيا الحيوية وعلم الأحياء الدقيقة والوراثة.",
    color: "bg-blue-100 text-blue-700",
    bgColor: "blue",
    borderColor: "border-blue-300",
    topics: [
      { en: "Molecular Biology & Genetics", ar: "البيولوجيا الجزيئية والوراثة" },
      { en: "Microbiology & Immunology", ar: "علم الأحياء الدقيقة والمناعة" },
      { en: "Biotechnology & Bioengineering", ar: "التكنولوجيا الحيوية والهندسة الحيوية" },
      { en: "Cell Biology & Biochemistry", ar: "بيولوجيا الخلية والكيمياء الحيوية" },
      { en: "Ecology & Environmental Biology", ar: "علم البيئة والأحياء البيئية" },
      { en: "Developmental Biology", ar: "بيولوجيا النمو والتطور" },
      { en: "Plant Sciences & Agriculture", ar: "علوم النبات والزراعة" },
      { en: "Marine & Aquatic Biology", ar: "الأحياء البحرية والمائية" },
      { en: "Bioinformatics & Computational Biology", ar: "المعلوماتية الحيوية والأحياء الحاسوبية" },
      { en: "Neuroscience & Behavioral Biology", ar: "علم الأعصاب والسلوك الحيوي" }
    ],
    exampleQuestions: [
      "CRISPR-Cas9 applications in gene therapy for inherited diseases",
      "Microbial resistance mechanisms and novel antibiotic development",
      "Biotechnological approaches to sustainable agriculture",
      "Biodiversity conservation strategies in changing ecosystems",
      "Stem cell research and regenerative medicine applications"
    ],
    chairName: "Prof. Dr. Ahmed Hassan",
    chairTitle: "Department of Biology",
    chairEmail: "lifesciences@sci2026.com"
  },

  "physical-sciences": {
    id: "physical-sciences",
    trackNumber: 2,
    icon: Zap,
    title: "Physical Sciences",
    titleAr: "العلوم الفيزيائية",
    description: "Exploring the fundamental laws of nature through theoretical and experimental physics research.",
    descriptionAr: "استكشاف القوانين الأساسية للطبيعة من خلال الأبحاث الفيزيائية النظرية والتجريبية.",
    color: "bg-purple-100 text-purple-700",
    bgColor: "purple",
    borderColor: "border-purple-300",
    topics: [
      { en: "Quantum Physics & Mechanics", ar: "الفيزياء الكمية والميكانيكا" },
      { en: "Condensed Matter Physics", ar: "فيزياء المادة المكثفة" },
      { en: "Nuclear & Particle Physics", ar: "الفيزياء النووية وفيزياء الجسيمات" },
      { en: "Optics & Photonics", ar: "البصريات والفوتونيات" },
      { en: "Plasma Physics", ar: "فيزياء البلازما" },
      { en: "Applied Physics", ar: "الفيزياء التطبيقية" },
      { en: "Theoretical Physics", ar: "الفيزياء النظرية" },
      { en: "Biophysics", ar: "الفيزياء الحيوية" },
      { en: "Computational Physics", ar: "الفيزياء الحاسوبية" },
      { en: "Energy Physics & Renewable Energy", ar: "فيزياء الطاقة والطاقة المتجددة" }
    ],
    exampleQuestions: [
      "Quantum computing applications in cryptography and simulation",
      "Novel materials for energy storage and conversion",
      "Laser applications in medical diagnostics and treatment",
      "Superconductivity at higher temperatures",
      "Photovoltaic efficiency improvements through nanotechnology"
    ],
    chairName: "Prof. Dr. Mohamed Khalil",
    chairTitle: "Department of Physics",
    chairEmail: "physics@sci2026.com"
  },

  "chemical-sciences": {
    id: "chemical-sciences",
    trackNumber: 3,
    icon: Atom,
    title: "Chemical Sciences",
    titleAr: "العلوم الكيميائية",
    description: "Investigating matter, its properties, and transformations through analytical, organic, inorganic, and physical chemistry.",
    descriptionAr: "دراسة المادة وخصائصها وتحولاتها من خلال الكيمياء التحليلية والعضوية وغير العضوية والفيزيائية.",
    color: "bg-pink-100 text-pink-700",
    bgColor: "pink",
    borderColor: "border-pink-300",
    topics: [
      { en: "Organic Chemistry & Synthesis", ar: "الكيمياء العضوية والتخليق" },
      { en: "Inorganic & Coordination Chemistry", ar: "الكيمياء غير العضوية والتنسيقية" },
      { en: "Analytical Chemistry", ar: "الكيمياء التحليلية" },
      { en: "Physical Chemistry", ar: "الكيمياء الفيزيائية" },
      { en: "Electrochemistry", ar: "الكيمياء الكهربائية" },
      { en: "Green Chemistry & Sustainability", ar: "الكيمياء الخضراء والاستدامة" },
      { en: "Medicinal Chemistry", ar: "الكيمياء الطبية" },
      { en: "Polymer Chemistry", ar: "كيمياء البوليمرات" },
      { en: "Catalysis & Surface Chemistry", ar: "الحفز وكيمياء السطوح" },
      { en: "Computational Chemistry", ar: "الكيمياء الحاسوبية" }
    ],
    exampleQuestions: [
      "Development of novel catalysts for sustainable chemical processes",
      "Drug design and synthesis for targeted cancer therapy",
      "Green chemistry approaches to industrial manufacturing",
      "Advanced analytical techniques for environmental monitoring",
      "Polymer materials for biomedical applications"
    ],
    chairName: "Prof. Dr. Fatma El-Sayed",
    chairTitle: "Department of Chemistry",
    chairEmail: "chemistry@sci2026.com"
  },

  "geoscience": {
    id: "geoscience",
    trackNumber: 4,
    icon: Globe,
    title: "Geoscience and Earth Systems",
    titleAr: "علوم الأرض وأنظمة الأرض",
    description: "Understanding Earth's processes, resources, and environmental systems for sustainable development.",
    descriptionAr: "فهم عمليات الأرض ومواردها والأنظمة البيئية من أجل التنمية المستدامة.",
    color: "bg-green-100 text-green-700",
    bgColor: "green",
    borderColor: "border-green-300",
    topics: [
      { en: "Geology & Mineralogy", ar: "الجيولوجيا وعلم المعادن" },
      { en: "Geophysics & Seismology", ar: "الجيوفيزياء وعلم الزلازل" },
      { en: "Hydrology & Water Resources", ar: "الهيدرولوجيا والموارد المائية" },
      { en: "Environmental Geoscience", ar: "علوم الأرض البيئية" },
      { en: "Petroleum & Energy Geology", ar: "جيولوجيا البترول والطاقة" },
      { en: "Climate Change & Paleoclimatology", ar: "تغير المناخ وعلم المناخ القديم" },
      { en: "Geohazards & Risk Assessment", ar: "المخاطر الجيولوجية وتقييم المخاطر" },
      { en: "Remote Sensing & GIS", ar: "الاستشعار عن بعد ونظم المعلومات الجغرافية" },
      { en: "Soil Science & Land Management", ar: "علم التربة وإدارة الأراضي" },
      { en: "Oceanography", ar: "علم المحيطات" }
    ],
    exampleQuestions: [
      "Carbon capture and storage in geological formations",
      "Earthquake prediction and early warning systems",
      "Sustainable groundwater management in arid regions",
      "Climate change impacts on coastal ecosystems",
      "Remote sensing for mineral exploration and environmental monitoring"
    ],
    chairName: "Prof. Dr. Hany Ibrahim",
    chairTitle: "Department of Geology",
    chairEmail: "geoscience@sci2026.com"
  },

  "mathematical-computational": {
    id: "mathematical-computational",
    trackNumber: 5,
    icon: Calculator,
    title: "Mathematical & Computational Sciences",
    titleAr: "العلوم الرياضية والحاسوبية",
    description: "Advancing mathematical theory and computational methods for solving complex real-world problems.",
    descriptionAr: "تطوير النظرية الرياضية والأساليب الحاسوبية لحل المشكلات المعقدة في العالم الحقيقي.",
    color: "bg-orange-100 text-orange-700",
    bgColor: "orange",
    borderColor: "border-orange-300",
    topics: [
      { en: "Pure Mathematics", ar: "الرياضيات البحتة" },
      { en: "Applied Mathematics", ar: "الرياضيات التطبيقية" },
      { en: "Statistics & Probability", ar: "الإحصاء والاحتمالات" },
      { en: "Artificial Intelligence & Machine Learning", ar: "الذكاء الاصطناعي والتعلم الآلي" },
      { en: "Data Science & Big Data", ar: "علم البيانات والبيانات الضخمة" },
      { en: "Computational Modeling", ar: "النمذجة الحاسوبية" },
      { en: "Cryptography & Information Security", ar: "التشفير وأمن المعلومات" },
      { en: "Numerical Analysis", ar: "التحليل العددي" },
      { en: "Operations Research", ar: "بحوث العمليات" },
      { en: "Quantum Computing", ar: "الحوسبة الكمية" }
    ],
    exampleQuestions: [
      "Deep learning applications in medical image analysis",
      "Mathematical modeling of epidemic spread and control",
      "Quantum algorithms for optimization problems",
      "Big data analytics for climate prediction",
      "Cryptographic protocols for blockchain technology"
    ],
    chairName: "Prof. Dr. Nadia Mahmoud",
    chairTitle: "Department of Mathematics",
    chairEmail: "mathematics@sci2026.com"
  },

  "medical-health": {
    id: "medical-health",
    trackNumber: 6,
    icon: Heart,
    title: "Medical & Health Sciences",
    titleAr: "العلوم الطبية والصحية",
    description: "Bridging basic science with clinical applications in biochemistry, pharmacology, and medical physics.",
    descriptionAr: "ربط العلوم الأساسية بالتطبيقات السريرية في الكيمياء الحيوية وعلم الأدوية والفيزياء الطبية.",
    color: "bg-red-100 text-red-700",
    bgColor: "red",
    borderColor: "border-red-300",
    topics: [
      { en: "Biochemistry & Molecular Medicine", ar: "الكيمياء الحيوية والطب الجزيئي" },
      { en: "Pharmacology & Drug Development", ar: "علم الأدوية وتطوير العقاقير" },
      { en: "Medical Physics & Imaging", ar: "الفيزياء الطبية والتصوير" },
      { en: "Clinical Biochemistry", ar: "الكيمياء الحيوية السريرية" },
      { en: "Toxicology", ar: "علم السموم" },
      { en: "Radiotherapy & Nuclear Medicine", ar: "العلاج الإشعاعي والطب النووي" },
      { en: "Diagnostic Technologies", ar: "تقنيات التشخيص" },
      { en: "Personalized Medicine", ar: "الطب الشخصي" },
      { en: "Medical Nanotechnology", ar: "تقنية النانو الطبية" },
      { en: "Public Health & Epidemiology", ar: "الصحة العامة وعلم الأوبئة" }
    ],
    exampleQuestions: [
      "Novel drug delivery systems using nanoparticles",
      "Biomarkers for early cancer detection",
      "AI-assisted medical imaging and diagnosis",
      "Personalized medicine based on genetic profiling",
      "Radiation therapy optimization for tumor treatment"
    ],
    chairName: "Prof. Dr. Laila Abdel-Rahman",
    chairTitle: "Department of Biochemistry",
    chairEmail: "medical@sci2026.com"
  },

  "interdisciplinary": {
    id: "interdisciplinary",
    trackNumber: 7,
    icon: Sparkles,
    title: "Interdisciplinary & Emerging Fields",
    titleAr: "المجالات البينية والحديثة",
    description: "Fostering innovation through cross-disciplinary research in emerging scientific frontiers.",
    descriptionAr: "تعزيز الابتكار من خلال البحوث متعددة التخصصات في الحدود العلمية الناشئة.",
    color: "bg-indigo-100 text-indigo-700",
    bgColor: "indigo",
    borderColor: "border-indigo-300",
    topics: [
      { en: "Forensic Science", ar: "علوم الطب الشرعي" },
      { en: "Sustainability Science", ar: "علوم الاستدامة" },
      { en: "Science Communication", ar: "التواصل العلمي" },
      { en: "Ethics in Science & Technology", ar: "الأخلاقيات في العلوم والتكنولوجيا" },
      { en: "Citizen Science", ar: "العلوم المجتمعية" },
      { en: "Science Policy & Governance", ar: "سياسة العلوم والحوكمة" },
      { en: "Biomimicry & Nature-Inspired Design", ar: "المحاكاة الحيوية والتصميم المستوحى من الطبيعة" },
      { en: "Synthetic Biology", ar: "البيولوجيا التركيبية" },
      { en: "Cognitive Science", ar: "العلوم المعرفية" },
      { en: "Science Education & Outreach", ar: "التعليم العلمي والتوعية" }
    ],
    exampleQuestions: [
      "DNA analysis techniques in criminal investigations",
      "Circular economy models for industrial sustainability",
      "Ethical frameworks for AI and biotechnology research",
      "Biomimetic materials inspired by natural structures",
      "Effective science communication strategies for public engagement"
    ],
    chairName: "Prof. Dr. Yasser Fouad",
    chairTitle: "Interdisciplinary Research Center",
    chairEmail: "interdisciplinary@sci2026.com"
  },

  "materials-science": {
    id: "materials-science",
    trackNumber: 8,
    icon: FlaskConical,
    title: "Advanced Materials Science",
    titleAr: "علوم المواد المتقدمة",
    description: "Developing innovative materials through nanotechnology, polymers, and composites for industrial applications.",
    descriptionAr: "تطوير مواد مبتكرة من خلال تقنية النانو والبوليمرات والمركبات للتطبيقات الصناعية.",
    color: "bg-teal-100 text-teal-700",
    bgColor: "teal",
    borderColor: "border-teal-300",
    topics: [
      { en: "Nanomaterials & Nanotechnology", ar: "المواد النانوية وتقنية النانو" },
      { en: "Polymer Science & Engineering", ar: "علوم وهندسة البوليمرات" },
      { en: "Composite Materials", ar: "المواد المركبة" },
      { en: "Biomaterials", ar: "المواد الحيوية" },
      { en: "Smart Materials", ar: "المواد الذكية" },
      { en: "Ceramics & Glass Technology", ar: "السيراميك وتقنية الزجاج" },
      { en: "Metallurgy & Alloys", ar: "علم المعادن والسبائك" },
      { en: "Thin Films & Coatings", ar: "الأغشية الرقيقة والطلاءات" },
      { en: "Energy Storage Materials", ar: "مواد تخزين الطاقة" },
      { en: "Materials Characterization", ar: "توصيف المواد" }
    ],
    exampleQuestions: [
      "Graphene-based materials for electronic applications",
      "Biodegradable polymers for sustainable packaging",
      "Self-healing materials for infrastructure",
      "Nanocomposites for lightweight aerospace structures",
      "Advanced battery materials for electric vehicles"
    ],
    chairName: "Prof. Dr. Samira Ali",
    chairTitle: "Materials Science Center",
    chairEmail: "materials@sci2026.com"
  },

  "astronomy-space": {
    id: "astronomy-space",
    trackNumber: 9,
    icon: Telescope,
    title: "Astronomy, Space & Meteorology",
    titleAr: "الفلك والفضاء والأرصاد الجوية",
    description: "Exploring the universe and Earth's atmosphere through astrophysics, space science, and climate research.",
    descriptionAr: "استكشاف الكون والغلاف الجوي للأرض من خلال الفيزياء الفلكية وعلوم الفضاء وأبحاث المناخ.",
    color: "bg-cyan-100 text-cyan-700",
    bgColor: "cyan",
    borderColor: "border-cyan-300",
    topics: [
      { en: "Astrophysics & Cosmology", ar: "الفيزياء الفلكية وعلم الكونيات" },
      { en: "Planetary Science", ar: "علوم الكواكب" },
      { en: "Space Exploration & Technology", ar: "استكشاف الفضاء والتكنولوجيا" },
      { en: "Atmospheric Physics", ar: "فيزياء الغلاف الجوي" },
      { en: "Climate Science & Modeling", ar: "علوم المناخ والنمذجة" },
      { en: "Weather Forecasting", ar: "التنبؤ بالطقس" },
      { en: "Solar Physics", ar: "فيزياء الشمس" },
      { en: "Astrobiology", ar: "علم الأحياء الفلكي" },
      { en: "Satellite Technology & Applications", ar: "تقنية الأقمار الصناعية والتطبيقات" },
      { en: "Radio Astronomy", ar: "علم الفلك الراديوي" }
    ],
    exampleQuestions: [
      "Exoplanet detection and characterization methods",
      "Climate change modeling using satellite data",
      "Solar activity impacts on Earth's magnetosphere",
      "Mars exploration and potential for human habitation",
      "Extreme weather prediction using AI and machine learning"
    ],
    chairName: "Prof. Dr. Khaled Mostafa",
    chairTitle: "Department of Astronomy",
    chairEmail: "astronomy@sci2026.com"
  }
};
