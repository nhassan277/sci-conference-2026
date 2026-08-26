from collections import Counter
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import DataBarRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter


ROOT = Path("/home/ubuntu")
PROJECT = ROOT / "sci-conference-2026"
OUT_DOCX = ROOT / "SCI2026_Conference_Report.docx"
OUT_XLSX = ROOT / "SCI2026_Researcher_Participant_Table.xlsx"
OUT_MD = ROOT / "SCI2026_Conference_Report.md"
LOGO = PROJECT / "client/public/images/logo_faculty_science.jpeg"
PHOTO_POSTER = ROOT / "sci2026-report-assets/photo-01.jpeg"
PHOTO_POSTER_2 = ROOT / "sci2026-report-assets/photo-03.JPG"
PROGRAM_URL = "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/program_final_226b1f90.pdf"
GALLERY_URL = "https://sciconf26.manus.space/live-gallery"


TRACKS = [
    ("العلوم الحياتية", "Life Sciences", "Biology, Biotechnology, Microbiology, Genetics"),
    ("العلوم الفيزيائية", "Physical Sciences", "Physics, Applied Physics, Theoretical Physics"),
    ("العلوم الكيميائية", "Chemical Sciences", "Physical Chemistry, Analytical Chemistry, Organic Chemistry, Inorganic Chemistry"),
    ("علوم الأرض وأنظمة الأرض", "Geoscience and Earth Systems", "Sustainable resource exploration, environmental monitoring, geohazard assessment"),
    ("العلوم الرياضية والحاسوبية", "Mathematical & Computational Sciences", "Mathematics, Statistics, AI, Data Science"),
    ("العلوم الطبية والصحية", "Medical & Health Sciences", "Biochemistry, Pharmacology, Medical Physics"),
    ("المجالات البينية والحديثة", "Interdisciplinary & Emerging Fields", "Space Science, Forensics, Sustainability"),
    ("علوم المواد المتقدمة", "Advanced Materials Science", "Nanomaterials, polymers, composites"),
    ("الفلك والفضاء والأرصاد الجوية", "Astronomy, Space & Meteorology", "Astrophysics, space exploration, climate and atmospheric research"),
]


PROGRAM_ROWS = [
    ("07/04/2026", "A", "العلوم الحياتية", "Major General Dr. Khaled Amer", "Egypt Genome; From Dream to Reality"),
    ("07/04/2026", "A", "المجالات البينية والحديثة", "Prof. Ibrahim El-Sherbiny", "Basic Sciences as the Foundation of Innovation"),
    ("07/04/2026", "A", "العلوم الطبية والصحية", "Prof. Fathy Khodair", "Clinical application of adipose derived stem cells in plastic surgery"),
    ("07/04/2026", "B", "الفلك والفضاء والأرصاد الجوية", "Prof. Osama Shalabiea", "Space Science and Technology (SSAT): Exploration, Utilization and Commercialization"),
    ("07/04/2026", "C", "العلوم الطبية والصحية", "Prof. Ahmed Abdellatif", "Exploring natural products to combat neurodegenerative disorders"),
    ("07/04/2026", "D", "العلوم الحياتية", "Prof. Abdo El Fiki", "GRP78 and Cell-Surface GRP78 Self-Association"),
    ("07/04/2026", "A", "العلوم الطبية والصحية", "Prof. Khalid Taalab", "Radiopharmaceuticals and Precision Medicine"),
    ("07/04/2026", "B", "الفلك والفضاء والأرصاد الجوية", "Prof. Zaynab Mohamed", "Interstellar hydrocarbons: degradation chemistry in diffuse clouds"),
    ("07/04/2026", "C", "العلوم الطبية والصحية", "Dr. Narguess Hossam", "Chitosan-Based Nanoparticles Loaded with Royal Jelly, Grape Seed Extract, and Garlic Extract for Treating Spinal Cord Injury in a rat model"),
    ("07/04/2026", "D", "العلوم الفيزيائية", "Prof. Ahmed Sabry", "A quantum-classical approach band model of indirect optical transitions in semiconductor materials"),
    ("07/04/2026", "A", "العلوم الكيميائية", "Prof. Ahmed Galal", "Photo-assisted electrocatalysis"),
    ("07/04/2026", "B", "العلوم الفيزيائية", "Prof. Mohamed Shaker", "Silicon Nanophotonics for On-Chip Integrated Circuit Technology"),
    ("07/04/2026", "C", "العلوم الطبية والصحية", "Prof. Amr Ali", "Oral Bee Venom as a Novel Therapeutic Approach for Diabetic Nephropathy in Rats"),
    ("07/04/2026", "D", "علوم الأرض وأنظمة الأرض", "Prof. Ahmed Abdelhalim", "Assessment of Synthetic Zeolites from Kaolin and Bentonite Clays for Wastewater and Fuel Gases Treatment"),
    ("07/04/2026", "A", "المجالات البينية والحديثة", "Prof. Adel Khalil", "Bridging the Lab-to-Market Gap"),
    ("07/04/2026", "B", "العلوم الطبية والصحية", "Dr. Areeg Abdalla", "Scientific Principles and Medical Applications of Artificial Intelligence"),
    ("07/04/2026", "C", "العلوم الحياتية", "Prof. Rasha Mohmed", "Prophylactic and biocontrol effect of the microencapsulated lactic acid bacteria extracted from honeybee gut against some diseases of the honeybee, Apis mellifera L"),
    ("07/04/2026", "D", "الفلك والفضاء والأرصاد الجوية", "Dr. Hagar Hamdy", "ENSO Teleconnections Modulated by the State of the Equatorial Atlantic and Indian Oceans"),
    ("07/04/2026", "A", "المجالات البينية والحديثة", "Prof. Hamed A. Ead", "Science at the Core of Innovation: Reimagining the University-Industry Nexus for Transformative Impact"),
    ("07/04/2026", "B", "العلوم الطبية والصحية", "Prof. Osama Azmy", "Management of the Rosy Years of Life"),
    ("07/04/2026", "C", "العلوم الحياتية", "Prof. Yasser Shahein", "Current Status of Tick Control in Egypt"),
    ("07/04/2026", "A", "العلوم الحياتية", "Prof. Ehab El Dabaa", "Center of Excellence in Recombinant Biopharmaceutical Proteins (CERBioP) in TBRI; From Scientific Innovation to The Egyptian Biopharmaceutical Industry"),
    ("07/04/2026", "B", "العلوم الحياتية", "Prof. Ashraf Abduo Tabll", "Current Status and Future Prospects of Medical Biotechnology in Egypt"),
    ("07/04/2026", "C", "علوم المواد المتقدمة", "Prof. Ahmed El Fiqi", "Antibacterial glass powder"),
    ("07/04/2026", "A", "العلوم الحياتية", "Dr. Tarek Kapiel", "Integrative Bio-Nanotechnologies for Industrial Symbiosis"),
    ("07/04/2026", "B", "العلوم الكيميائية", "Prof. Korany A. Ali", "The Role of Research and Development Centers in Promoting Active Pharmaceutical Ingredients (APIs)"),
    ("07/04/2026", "C", "علوم المواد المتقدمة", "Dr. Mohamed Mousa", "Clay nanoparticles for medical use"),
    ("07/04/2026", "A", "العلوم الحياتية", "Prof. Naglaa Abdallah", "Novel Genome Editing Approaches for a Sustainable Future"),
    ("07/04/2026", "B", "المجالات البينية والحديثة", "Prof. Refaat Gabre", "Transfer, localization, and reproduction of biotechnology in Egypt"),
    ("07/04/2026", "C", "العلوم الحياتية", "Dr. Ahmed Youssef", "Advanced Vaccine Bioprocessing"),
    ("07/04/2026", "A", "العلوم الحياتية", "Dr. Abdelfattah Kamal", "Achieving Quality and Sustainable Local Vaccine Production in Africa to Improve Access"),
    ("07/04/2026", "B", "المجالات البينية والحديثة", "Eng. Mostafa Nasser", "AI in Biotechnology"),
    ("07/04/2026", "C", "العلوم الكيميائية", "Dr. Karim Barakat", "Novel thiazole-based cyanoacrylamide derivatives"),
    ("08/04/2026", "A", "علوم الأرض وأنظمة الأرض", "Prof. Mortada Mourad", "Karstology (Science of Unlimited Multi-Discipline Approaches), Promising Setting for Industrial Raw Materials"),
    ("08/04/2026", "A", "المجالات البينية والحديثة", "Prof. Ahmed Hegazy", "Policies and Diplomacy of Basic Scientific Research for Societal Development: Basic Research from Laboratory to Society"),
    ("08/04/2026", "A", "العلوم الحياتية", "Prof. Sohair Ramadan", "Practical Aspects of Experimental Design in Laboratory Animal Science"),
    ("08/04/2026", "B", "علوم الأرض وأنظمة الأرض", "Prof. Mohamed El-Anbawy", "Economic Utilization of Shale in Desert Land Reclamation and Cement Industry"),
    ("08/04/2026", "C", "العلوم الحياتية", "Prof. Fathy Abdel Ghaffar", "Nature Helps: from Lab to the Market, Neem and Cinchona Tree Story and Parasite control"),
    ("08/04/2026", "A", "العلوم الطبية والصحية", "Prof. Rashika El Ridi", "The Impact of Misleading Concepts in Science on the Faculty of Science-Cairo University Efforts to Control Schistosomiasis and Cancer"),
    ("08/04/2026", "B", "علوم الأرض وأنظمة الأرض", "Prof. Mortada Mourad", "Egyptian Iron Ore for Supporting National Economy - Opportunities and Challenges"),
    ("08/04/2026", "C", "العلوم الطبية والصحية", "Prof. Emad Elzayat", "Therapeutic potential of stem cells and acitretin on inflammatory signaling pathway associated genes regulated by miRNAs 146a and 155 in AD like rats"),
    ("08/04/2026", "A", "العلوم الطبية والصحية", "Prof. Ebtehal El-Demerdash", "When Pharmacometrics meets AI"),
    ("08/04/2026", "B", "علوم الأرض وأنظمة الأرض", "Prof. Mahmoud Ibrahim Nasr", "Egyptian Iron Ore as a Feedstock to the Iron and Steel Industry"),
    ("08/04/2026", "C", "العلوم الحياتية", "Dr. Sara Bayoumi Ali", "Nematocidal activity of zinc oxide nanoparticles synthesized using chicken egg albumin in lung and spleen of Parascaris equorum experimentally infected rats"),
    ("08/04/2026", "A", "العلوم الطبية والصحية", "Prof. Nashwa El Khazragy", "Building Precision Medicine: AI-Driven Biomarkers and Industry Integration in Emerging Healthcare Systems"),
    ("08/04/2026", "B", "علوم الأرض وأنظمة الأرض", "Dr. Sahar Hassan", "Borehole Images: From Pixels to Insights"),
    ("08/04/2026", "A", "العلوم الكيميائية", "Dr. Mohamed Anwar", "From Molecules to Taste: The Role of Organic Chemistry in Flavor Manufacturing and Food Innovation"),
    ("08/04/2026", "B", "علوم الأرض وأنظمة الأرض", "Dr. Ahmed Wafik", "Detection of Low Contrast, Low Resistivity Pay (LCLR) Challenge in Shaly Sand Gas Reservoir Through Acoustic Data in the On-Shore Nile Delta, Egypt"),
    ("08/04/2026", "A", "العلوم الطبية والصحية", "Prof. Mohamed Hamed", "Computational Transformation in Drug Discovery: Bioinformatics and AI Innovations in Pharmaceutical Science"),
    ("08/04/2026", "B", "العلوم الطبية والصحية", "Prof. Nagwa El-Badri", "Biomimetic Scaffolds and the Human Amniotic Membrane"),
    ("08/04/2026", "C", "العلوم الطبية والصحية", "Dr. Toka Osman", "The cross talk between type II diabetic microenvironment and the regenerative capacities of human adipose tissue-derived pericytes: a promising cell therapy"),
    ("08/04/2026", "D", "علوم الأرض وأنظمة الأرض", "Dr. Alyaa Aly", "Nutrient distribution and nitrate processing in a mangrove tidal creek affected by submarine groundwater discharge (SGD)"),
    ("08/04/2026", "A", "العلوم الحياتية", "Prof. Mohamed Abdel Gawad", "Metabolic Mastery: Engineering the PETase-MHETase Synergistic Consortium for a Truly Circular Plastic Economy"),
    ("08/04/2026", "B", "العلوم الحياتية", "Prof. Abdel-Rahman B. Abdel-Ghaffar", "From Lab to Market: How Science Drives Innovation in Nutrition and Food Technology"),
    ("08/04/2026", "C", "العلوم الكيميائية", "Dr. Rania Samy", "Synthesis, characterization, DNA photocleavage, in silico and in vitro DNA/BSA binding properties of novel hexahydroquinolines"),
    ("08/04/2026", "D", "العلوم الكيميائية", "Dr. Reham Eid", "Hantzsch-Like Synthesis, DNA Photocleavage, DNA/BSA Binding, and Molecular Docking Studies of Bis(sulfanediyl)bis(tetrahydro-5-deazaflavin) Analogs Linked to Naphthalene Core"),
    ("08/04/2026", "A", "العلوم الحياتية", "Prof. Ayman El-Shibiny", "Phage Innovation: Targeted Solutions for Regional Antimicrobial Challenges"),
    ("08/04/2026", "B", "العلوم الحياتية", "Prof. Reda Salem", "Recombinant Technologies in Poultry Vaccine Development: From Molecular Design to Industrial Application"),
    ("08/04/2026", "C", "العلوم الحياتية", "Dr. Shiama Mohamed", "Antibiotic Resistant Genes in Some Pathogenic Bacteria and Its Correlation with Safety of Milk and Dairy Products"),
    ("08/04/2026", "D", "العلوم الطبية والصحية", "Dr. Basma Islam", "Bisphenol-A threatens male fertility via spermatogenesis signaling pathway"),
    ("08/04/2026", "A", "العلوم الطبية والصحية", "Dr. Ahmed Fikry", "Computer-Aided Drug Design: From Code to Cure"),
    ("08/04/2026", "B", "المجالات البينية والحديثة", "Dr. Walaa Abbas", "Water generator"),
    ("08/04/2026", "C", "علوم المواد المتقدمة", "Ms. Haneen Al Khatib", "Innovation of bio-based Marine Extract Product as Radiation-Protective Materials for Textile, Sunscreen, and Optical Applications"),
    ("08/04/2026", "D", "العلوم الكيميائية", "Dr. Ahmed Abdel-Tawab", "Studies on Chemical Modification of Polysaccharides for Enhanced Functionalities and Diverse Applications"),
]


CERTIFICATE_ROWS = [
    ("", "", "علوم المواد المتقدمة", "Rania Emara Galal Mohamed Hassan", "Diethyldithiocarbamate Chelates as Eco-Friendly Precursors to Sustainable Metal Chalcogenide for Energy Storage Applications", "Poster", "Alexandria University"),
    ("", "", "علوم المواد المتقدمة", "Alaa Sherif Atfy", "MOF Capsules for pH-Triggered Delivery of Amoxicillin in the Stomach", "Oral", "Faculty of Science, Cairo University"),
    ("", "", "علوم المواد المتقدمة", "Fatma Ali", "Waste-derived sustainable nanocomposite as high-performance electrocatalysts for advanced fuel-cell applications", "Poster", "Cairo University"),
    ("", "", "العلوم الطبية والصحية", "Amr Ahmed WalyEldeen", "A Novel Chalcone Derivative Tethered N-Arylacetamide Moiety Suppresses Triple-Negative Breast Cancer Through Apoptosis Induction, Cell-Cycle Disruption, Migration Inhibition, and EGFR/ERK-Related Targeting", "Poster", "Cairo University"),
    ("", "", "العلوم الطبية والصحية", "Ata Jaber Diefallaha", "A Novel Chalcone Derivative Tethered N-Arylacetamide Moiety Suppresses Triple-Negative Breast Cancer Through Apoptosis Induction, Cell-Cycle Disruption, Migration Inhibition, and EGFR/ERK-Related Targeting", "Poster", "Cairo University"),
]


REGISTRATION_COUNTS = [
    ("أعضاء هيئة التدريس", "Faculty", 112),
    ("قطاع الصناعة", "Industry", 12),
    ("الباحثون", "Researchers", 198),
    ("الطلاب", "Students", 766),
]


def set_cell_text(cell, text, bold=False, color=None, size=9, align="right", fill=None):
    cell.value = text
    cell.font = Font(name="Arial", size=size, bold=bold, color=color)
    cell.alignment = Alignment(horizontal=align, vertical="center", wrap_text=True)
    if fill:
        cell.fill = PatternFill("solid", fgColor=fill)


def set_rtl(paragraph, align=WD_ALIGN_PARAGRAPH.RIGHT):
    paragraph.alignment = align
    p_pr = paragraph._p.get_or_add_pPr()
    bidi = OxmlElement("w:bidi")
    bidi.set(qn("w:val"), "1")
    p_pr.append(bidi)


def add_doc_heading(document, text, level=1):
    p = document.add_paragraph()
    set_rtl(p)
    run = p.add_run(text)
    run.font.name = "Nirmala Text"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Nirmala Text")
    run.bold = True
    run.font.size = Pt(18 if level == 1 else 14)
    run.font.color.rgb = RGBColor(31, 78, 121)
    return p


def add_doc_para(document, text, bold_prefix=None):
    p = document.add_paragraph()
    set_rtl(p)
    p.paragraph_format.space_after = Pt(6)
    if bold_prefix and text.startswith(bold_prefix):
        run = p.add_run(bold_prefix)
        run.bold = True
        run.font.name = "Yu Gothic UI Semilight"
        run.font.size = Pt(11)
        run = p.add_run(text[len(bold_prefix):])
    else:
        run = p.add_run(text)
    run.font.name = "Yu Gothic UI Semilight"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Yu Gothic UI Semilight")
    run.font.size = Pt(11)
    return p


def shade_cell(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), color)
    tc_pr.append(shd)


def add_doc_table(document, headers, rows, widths=None, font_size=8):
    table = document.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = "Table Grid"
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        shade_cell(cell, "1F4E79")
        for p in cell.paragraphs:
            set_rtl(p, WD_ALIGN_PARAGRAPH.CENTER)
            for r in p.runs:
                r.font.name = "Nirmala Text"
                r.bold = True
                r.font.color.rgb = RGBColor(255, 255, 255)
                r.font.size = Pt(font_size)
    for row in rows:
        cells = table.add_row().cells
        for i, value in enumerate(row):
            cell = cells[i]
            cell.text = str(value)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if len(table.rows) % 2 == 1:
                shade_cell(cell, "EAF2F8")
            for p in cell.paragraphs:
                set_rtl(p, WD_ALIGN_PARAGRAPH.RIGHT)
                for r in p.runs:
                    r.font.name = "Yu Gothic UI Semilight"
                    r.font.size = Pt(font_size)
    if widths:
        for row in table.rows:
            for i, width in enumerate(widths):
                row.cells[i].width = Cm(width)
    return table


def build_docx():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(1.5)
    section.bottom_margin = Cm(1.5)
    section.left_margin = Cm(1.6)
    section.right_margin = Cm(1.6)

    normal = doc.styles["Normal"]
    normal.font.name = "Yu Gothic UI Semilight"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Yu Gothic UI Semilight")
    normal.font.size = Pt(11)

    if LOGO.exists():
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(str(LOGO), width=Inches(1.05))

    p = doc.add_paragraph()
    set_rtl(p, WD_ALIGN_PARAGRAPH.CENTER)
    r = p.add_run("تقرير عن مؤتمر كلية العلوم، جامعة القاهرة ٢٠٢٦")
    r.font.name = "Nirmala Text"
    r.bold = True
    r.font.size = Pt(22)
    r.font.color.rgb = RGBColor(31, 78, 121)

    p = doc.add_paragraph()
    set_rtl(p, WD_ALIGN_PARAGRAPH.CENTER)
    r = p.add_run("Science at the Core of Innovation | العلوم في قلب الابتكار")
    r.font.name = "Yu Gothic UI Semilight"
    r.font.size = Pt(13)
    r.bold = True

    p = doc.add_paragraph()
    set_rtl(p, WD_ALIGN_PARAGRAPH.CENTER)
    r = p.add_run("٧–٨ أبريل ٢٠٢٦ | مركز مؤتمرات جامعة القاهرة، المدينة الجامعية")
    r.font.name = "Yu Gothic UI Semilight"
    r.font.size = Pt(11)

    doc.add_paragraph()
    add_doc_heading(doc, "أولاً: ملخص تنفيذي")
    add_doc_para(doc, "يعرض هذا التقرير توثيقاً منظماً لفعاليات مؤتمر كلية العلوم بجامعة القاهرة لعام ٢٠٢٦، الذي عُقد تحت عنوان «العلوم في قلب الابتكار». ويضم التقرير المحاور العلمية المعلنة، وسجل العروض البحثية المدرجة بالبرنامج النهائي، وبيانات التسجيل المتاحة، إلى جانب جدول ملحق بأسماء الباحثين وعناوين عروضهم أو بوستراتهم.")
    add_doc_para(doc, "أظهر البرنامج النهائي للمؤتمر ٦٤ عرضاً علمياً مسمّى موزعة على قاعات المؤتمر خلال يومي ٧ و٨ أبريل ٢٠٢٦، بالإضافة إلى جلسات للنقاش وورش العمل وجلسة عرض بوسترات. كما تسجل قاعدة بيانات المؤتمر ١٬٠٨٨ طلب تسجيل موزعة بين الطلاب والباحثين وأعضاء هيئة التدريس والقطاع الصناعي. [1] [2]")
    add_doc_para(doc, "تنبيه منهجي: أرقام التسجيل أدناه تمثل سجلات التسجيل المتاحة، ولا تمثل بالضرورة عدداً مؤكداً للحضور الفعلي، لأن حقول تسجيل الدخول لم تُستكمل في قاعدة البيانات المؤرشفة. كما أن تصنيف العروض بحسب المحاور هو تصنيف موضوعي مستخلص من عنوان العرض ومحتوى البرنامج، لأغراض التوثيق فقط.")

    add_doc_heading(doc, "ثانياً: المحاور العلمية للمؤتمر")
    track_counts = Counter(row[2] for row in PROGRAM_ROWS)
    track_table_rows = []
    for ar, en, scope in TRACKS:
        count = track_counts.get(ar, 0)
        note = "وردت جلسة خاصة في البرنامج دون أسماء متحدثين أو عناوين فردية" if ar == "العلوم الرياضية والحاسوبية" else ""
        track_table_rows.append((ar, en, count, scope, note))
    add_doc_table(doc, ["المحور", "الاسم بالإنجليزية", "العروض المسماة", "نطاق المحور", "ملاحظة"], track_table_rows, [3.0, 3.5, 1.5, 5.5, 3.0], 8)

    add_doc_heading(doc, "ثالثاً: أعداد التسجيل المتاحة")
    registration_rows = [(ar, en, n) for ar, en, n in REGISTRATION_COUNTS]
    registration_rows.append(("الإجمالي", "Total", sum(n for _, _, n in REGISTRATION_COUNTS)))
    add_doc_table(doc, ["الفئة", "Category", "عدد سجلات التسجيل"], registration_rows, [6.0, 6.0, 4.0], 9)

    add_doc_heading(doc, "رابعاً: توثيق مصور من جلسة البوسترات")
    add_doc_para(doc, "تُظهر الصور التالية جانباً من جلسة عرض البوسترات، مع الالتزام بعدم نسبة المشاركين الظاهرين فيها إلى أسماء محددة ما لم تتوفر مطابقة رسمية موثقة بين الصورة وسجل الباحثين.")
    if PHOTO_POSTER.exists():
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(str(PHOTO_POSTER), width=Inches(4.0))
        cap = doc.add_paragraph()
        set_rtl(cap, WD_ALIGN_PARAGRAPH.CENTER)
        cap.add_run("صورة ١: جانب من جلسة عرض البوسترات في مؤتمر SCI 2026.").italic = True
    if PHOTO_POSTER_2.exists():
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(str(PHOTO_POSTER_2), width=Inches(5.6))
        cap = doc.add_paragraph()
        set_rtl(cap, WD_ALIGN_PARAGRAPH.CENTER)
        cap.add_run("صورة ٢: مشاركون أمام لوحات بوسترات بحثية ضمن معرض المؤتمر.").italic = True

    doc.add_page_break()
    add_doc_heading(doc, "خامساً: جدول الباحثين المشاركين والعروض البحثية")
    add_doc_para(doc, "يتضمن الجدول التالي جميع العروض العلمية ذات الأسماء والعناوين المحددة في البرنامج النهائي، وعددها ٦٤ عرضاً. يرد في الملحق التالي أيضاً خمسة سجلات بحثية إضافية تم توثيقها ذاتياً في طلبات شهادات المشاركة. [1] [3]")
    landscape = doc.add_section(WD_ORIENT.LANDSCAPE)
    landscape.page_width, landscape.page_height = landscape.page_height, landscape.page_width
    landscape.top_margin = Cm(1.2)
    landscape.bottom_margin = Cm(1.2)
    landscape.left_margin = Cm(1.2)
    landscape.right_margin = Cm(1.2)

    prog_rows = []
    for i, (day, hall, track, name, title) in enumerate(PROGRAM_ROWS, 1):
        prog_rows.append((i, name, track, title, "عرض علمي", day, f"قاعة {hall}"))
    add_doc_table(doc, ["م", "اسم الباحث أو المتحدث", "المحور", "عنوان البحث أو العرض", "النوع", "التاريخ", "المكان"], prog_rows, [0.7, 3.7, 3.2, 8.0, 1.8, 2.1, 1.4], 7)

    doc.add_page_break()
    add_doc_heading(doc, "سادساً: ملحق البوسترات والعروض الموثقة عبر طلبات شهادات المشاركة")
    add_doc_para(doc, "هذه السجلات مصدرها طلبات شهادات المشاركة المقدمة بعد المؤتمر. تم حذف التكرارات المتطابقة بحسب الاسم والعنوان، والاحتفاظ بالسجلات الخمسة الفريدة فقط. وقد لا تكون هذه القائمة كاملة لجميع بوسترات المؤتمر، لأنها مرتبطة فقط بالطلبات التي أدخلها أصحابها في نظام الشهادات.")
    cert_rows = []
    for i, (_, _, track, name, title, fmt, affiliation) in enumerate(CERTIFICATE_ROWS, 1):
        cert_rows.append((i, name, affiliation, track, title, "بوستر" if fmt == "Poster" else "عرض شفهي"))
    add_doc_table(doc, ["م", "اسم الباحث", "الجهة", "المحور", "العنوان", "صيغة المشاركة"], cert_rows, [0.7, 3.2, 3.0, 3.0, 8.0, 2.0], 8)

    add_doc_heading(doc, "سابعاً: المصادر ومنهجية التوثيق")
    add_doc_para(doc, "[1] البرنامج النهائي لمؤتمر SCI 2026، يومَا ٧ و٨ أبريل ٢٠٢٦. الرابط: " + PROGRAM_URL)
    add_doc_para(doc, "[2] سجلات التسجيل المؤرشفة لموقع SCI 2026، مستخرجة في ٢٦ أغسطس ٢٠٢٦. تم استخدام فئات التسجيل وأعدادها فقط، دون بيانات اتصال شخصية.")
    add_doc_para(doc, "[3] سجلات طلبات شهادات المشاركة المؤرشفة لموقع SCI 2026، بعد حذف التكرارات المتطابقة. تم استخدام الاسم، الجهة، عنوان المشاركة، ونوعها فقط.")
    add_doc_para(doc, "[4] معرض صور مؤتمر SCI 2026: " + GALLERY_URL)
    add_doc_para(doc, "ملاحظة للاعتماد النهائي: يُرجى مطابقة قائمة البوسترات مع كتالوج الملخصات أو ملفات لجنة البوسترات، إن وُجدت، قبل اعتماد أي قائمة باعتبارها كشفاً نهائياً شاملاً لكل الباحثين.")
    doc.save(OUT_DOCX)


def build_xlsx():
    wb = Workbook()
    wb.remove(wb.active)
    track_counts = Counter(row[2] for row in PROGRAM_ROWS)
    blue = "1F4E79"
    light = "D9EAF7"
    white = "FFFFFF"
    thin = Side(style="thin", color="D9E2F3")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    ws = wb.create_sheet("نظرة عامة")
    ws.sheet_view.showGridLines = False
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.merge_cells("B2:H2")
    set_cell_text(ws["B2"], "تقرير مؤتمر كلية العلوم، جامعة القاهرة ٢٠٢٦", True, white, 18, "center", blue)
    ws.row_dimensions[2].height = 32
    ws.merge_cells("B3:H3")
    set_cell_text(ws["B3"], "SCI 2026 | العلوم في قلب الابتكار | ٧–٨ أبريل ٢٠٢٦", False, "444444", 11, "center")
    ws.merge_cells("B5:H5")
    set_cell_text(ws["B5"], "مؤشرات موثقة", True, blue, 13, "right", light)
    metrics = [
        ("إجمالي سجلات التسجيل", "=SUM('التسجيلات'!D6:D9)", "سجلات التسجيل فقط، وليست تأكيداً للحضور الفعلي"),
        ("العروض المسماة في البرنامج", "=COUNTA('العروض والبوسترات'!B6:B69)", "عروض مقررة بأسماء وعناوين في البرنامج النهائي"),
        ("سجلات المشاركة البحثية الإضافية", "=COUNTA('العروض والبوسترات'!B70:B74)", "سجلات فريدة موثقة في طلبات شهادات المشاركة"),
        ("عدد المحاور المعلنة", "=COUNTA('المحاور'!B6:B14)", "محاور موقع المؤتمر"),
    ]
    for r, (metric, formula, note) in enumerate(metrics, 6):
        set_cell_text(ws.cell(r, 2), metric, True, "000000", 11, "right", light)
        ws.cell(r, 3, formula)
        ws.cell(r, 3).font = Font(name="Arial", size=11, bold=True, color=blue)
        ws.cell(r, 3).alignment = Alignment(horizontal="center", vertical="center")
        set_cell_text(ws.cell(r, 4), note, False, "555555", 10, "right")
        for c in range(2, 5):
            ws.cell(r, c).border = border
        ws.row_dimensions[r].height = 24
    ws.merge_cells("B12:H12")
    set_cell_text(ws["B12"], "ملاحظة: يُرجى اعتماد أرقام التسجيل بوصفها بيانات تسجيل، لا بوصفها عدد حضور فعلي، لعدم اكتمال سجلات تسجيل الدخول المؤرشفة.", False, "7F6000", 10, "right", "FFF2CC")
    ws.merge_cells("B14:H14")
    set_cell_text(ws["B14"], "المصادر: البرنامج النهائي للمؤتمر، قاعدة بيانات التسجيل، وسجلات شهادات المشاركة. تاريخ الاستخراج: ٢٦ أغسطس ٢٠٢٦.", False, "555555", 9, "right")
    for col, width in {"A": 3, "B": 31, "C": 18, "D": 55, "E": 3, "F": 13, "G": 13, "H": 13}.items():
        ws.column_dimensions[col].width = width

    reg = wb.create_sheet("التسجيلات")
    reg.sheet_view.showGridLines = False
    reg.merge_cells("B2:E2")
    set_cell_text(reg["B2"], "أعداد سجلات التسجيل حسب الفئة", True, white, 16, "center", blue)
    headers = ["الفئة بالعربية", "Category", "عدد السجلات", "المصدر"]
    for col, header in enumerate(headers, 2):
        set_cell_text(reg.cell(5, col), header, True, white, 10, "center", blue)
    for i, (ar, en, count) in enumerate(REGISTRATION_COUNTS, 6):
        set_cell_text(reg.cell(i, 2), ar, False, "000000", 10, "right")
        set_cell_text(reg.cell(i, 3), en, False, "000000", 10, "left")
        reg.cell(i, 4, count)
        reg.cell(i, 4).number_format = "#,##0"
        reg.cell(i, 4).alignment = Alignment(horizontal="center", vertical="center")
        set_cell_text(reg.cell(i, 5), "قاعدة بيانات التسجيل المؤرشفة", False, "555555", 9, "right")
        for c in range(2, 6):
            reg.cell(i, c).border = border
    reg.cell(10, 2, "الإجمالي")
    reg.cell(10, 4, "=SUM(D6:D9)")
    for c in range(2, 6):
        reg.cell(10, c).font = Font(name="Arial", size=10, bold=True, color=blue)
        reg.cell(10, c).fill = PatternFill("solid", fgColor=light)
        reg.cell(10, c).border = border
    reg.cell(10, 4).number_format = "#,##0"
    reg.auto_filter.ref = "B5:E10"
    reg.freeze_panes = "B6"
    reg.conditional_formatting.add("D6:D9", DataBarRule(start_type="min", end_type="max", color=blue))
    chart = BarChart()
    chart.title = "Registration Records by Category"
    chart.y_axis.title = "Records"
    chart.x_axis.title = "Category"
    chart.add_data(Reference(reg, min_col=4, min_row=5, max_row=9), titles_from_data=True)
    chart.set_categories(Reference(reg, min_col=2, min_row=6, max_row=9))
    chart.height = 8
    chart.width = 14
    reg.add_chart(chart, "B13")
    for col, width in {"A": 3, "B": 27, "C": 20, "D": 18, "E": 31}.items():
        reg.column_dimensions[col].width = width

    tr = wb.create_sheet("المحاور")
    tr.sheet_view.showGridLines = False
    tr.merge_cells("B2:F2")
    set_cell_text(tr["B2"], "المحاور العلمية والعروض المسماة في البرنامج", True, white, 16, "center", blue)
    track_headers = ["المحور بالعربية", "Track", "وصف موجز", "العروض المسماة", "ملاحظة"]
    for col, header in enumerate(track_headers, 2):
        set_cell_text(tr.cell(5, col), header, True, white, 10, "center", blue)
    for i, (ar, en, scope) in enumerate(TRACKS, 6):
        set_cell_text(tr.cell(i, 2), ar, False, "000000", 10, "right")
        set_cell_text(tr.cell(i, 3), en, False, "000000", 10, "left")
        set_cell_text(tr.cell(i, 4), scope, False, "000000", 9, "left")
        tr.cell(i, 5, track_counts.get(ar, 0))
        tr.cell(i, 5).number_format = "#,##0"
        tr.cell(i, 5).alignment = Alignment(horizontal="center", vertical="center")
        note = "جلسة خاصة بلا أسماء متحدثين أو عناوين فردية" if ar == "العلوم الرياضية والحاسوبية" else ""
        set_cell_text(tr.cell(i, 6), note, False, "555555", 9, "right")
        for c in range(2, 7):
            tr.cell(i, c).border = border
        tr.row_dimensions[i].height = 46
    tr.auto_filter.ref = "B5:F14"
    tr.freeze_panes = "B6"
    tr.conditional_formatting.add("E6:E14", DataBarRule(start_type="min", end_type="max", color=blue))
    for col, width in {"A": 3, "B": 31, "C": 34, "D": 54, "E": 17, "F": 35}.items():
        tr.column_dimensions[col].width = width

    pr = wb.create_sheet("العروض والبوسترات")
    pr.sheet_view.showGridLines = False
    pr.merge_cells("B2:I2")
    set_cell_text(pr["B2"], "سجل الباحثين وعناوين العروض أو البوسترات", True, white, 16, "center", blue)
    pheaders = ["م", "اسم الباحث", "المحور", "عنوان البحث أو العرض", "الصيغة", "التاريخ", "القاعة", "المصدر", "الجهة"]
    for col, header in enumerate(pheaders, 2):
        set_cell_text(pr.cell(5, col), header, True, white, 10, "center", blue)
    r = 6
    for index, (day, hall, track, name, title) in enumerate(PROGRAM_ROWS, 1):
        values = [index, name, track, title, "عرض علمي", day, f"قاعة {hall}", "البرنامج النهائي", ""]
        for c, value in enumerate(values, 2):
            set_cell_text(pr.cell(r, c), value, False, "000000", 9, "right" if c not in [3, 5] else "left")
            pr.cell(r, c).border = border
        pr.row_dimensions[r].height = 42
        r += 1
    for index, (_, _, track, name, title, fmt, affiliation) in enumerate(CERTIFICATE_ROWS, 1):
        values = [64 + index, name, track, title, "بوستر" if fmt == "Poster" else "عرض شفهي", "غير محدد", "غير محدد", "طلب شهادة مشاركة", affiliation]
        for c, value in enumerate(values, 2):
            set_cell_text(pr.cell(r, c), value, False, "000000", 9, "right" if c not in [3, 5] else "left", "FFF2CC")
            pr.cell(r, c).border = border
        pr.row_dimensions[r].height = 50
        r += 1
    pr.auto_filter.ref = f"B5:J{r-1}"
    pr.freeze_panes = "B6"
    widths = {"A": 3, "B": 7, "C": 31, "D": 31, "E": 70, "F": 16, "G": 15, "H": 12, "I": 24, "J": 31}
    for col, width in widths.items():
        pr.column_dimensions[col].width = width
    pr.sheet_properties.pageSetUpPr.fitToPage = True
    pr.page_setup.orientation = "landscape"
    pr.page_setup.fitToWidth = 1
    pr.page_setup.fitToHeight = 0

    nt = wb.create_sheet("ملاحظات المصادر")
    nt.sheet_view.showGridLines = False
    nt.merge_cells("B2:H2")
    set_cell_text(nt["B2"], "منهجية التوثيق والمصادر", True, white, 16, "center", blue)
    notes = [
        "البرنامج النهائي هو المصدر الأساسي للأسماء والعناوين الواردة في أول ٦٤ صفاً من سجل العروض والبوسترات.",
        "التصنيف حسب المحور هو تصنيف موضوعي مستخلص من عنوان العرض ومحتوى البرنامج لأغراض التوثيق، وليس بالضرورة تصنيفاً أصلياً منشوراً لكل مساهمة.",
        "تتضمن الصفوف من ٧٠ إلى ٧٤ سجلات فريدة من طلبات شهادات المشاركة. تم حذف التكرارات المتطابقة وفق الاسم والعنوان، لكنها لا تمثل بالضرورة كل بوسترات المؤتمر.",
        "أرقام التسجيل تمثل سجلات التسجيل المتاحة فقط. لا تصلح كمؤشر مؤكد للحضور الفعلي لأن سجلات تسجيل الدخول المؤرشفة غير مكتملة.",
        f"البرنامج النهائي: {PROGRAM_URL}",
        f"معرض صور المؤتمر: {GALLERY_URL}",
    ]
    for i, note in enumerate(notes, 5):
        nt.merge_cells(start_row=i, start_column=2, end_row=i, end_column=8)
        set_cell_text(nt.cell(i, 2), note, False, "000000", 11, "right")
        nt.row_dimensions[i].height = 36
    for col in range(1, 9):
        nt.column_dimensions[get_column_letter(col)].width = 20
    wb.save(OUT_XLSX)


def build_markdown():
    track_counts = Counter(row[2] for row in PROGRAM_ROWS)
    lines = [
        "# تقرير عن مؤتمر كلية العلوم، جامعة القاهرة ٢٠٢٦",
        "",
        "**SCI 2026 | العلوم في قلب الابتكار | ٧–٨ أبريل ٢٠٢٦**",
        "",
        "## ملخص موثق",
        "",
        "يوثق هذا الملف المحاور العلمية والعروض المسماة وسجلات التسجيل المتاحة. سجلات التسجيل لا تعادل بالضرورة الحضور الفعلي، إذ إن حقول تسجيل الدخول في الأرشيف غير مكتملة.",
        "",
        "| الفئة | العدد |",
        "|---|---:|",
    ]
    for ar, _, count in REGISTRATION_COUNTS:
        lines.append(f"| {ar} | {count} |")
    lines += [f"| **الإجمالي** | **{sum(x[2] for x in REGISTRATION_COUNTS)}** |", "", "## المحاور والعروض المسماة", "", "| المحور | العروض المسماة في البرنامج |", "|---|---:|"]
    for ar, _, _ in TRACKS:
        lines.append(f"| {ar} | {track_counts.get(ar, 0)} |")
    lines += ["", "## جدول الباحثين المشاركين والعروض البحثية", "", "| م | الاسم | المحور | العنوان | الصيغة | التاريخ | المكان | المصدر |", "|---:|---|---|---|---|---|---|---|"]
    for i, (day, hall, track, name, title) in enumerate(PROGRAM_ROWS, 1):
        lines.append(f"| {i} | {name} | {track} | {title.replace('|', '/')} | عرض علمي | {day} | قاعة {hall} | البرنامج النهائي |");
    for i, (_, _, track, name, title, fmt, affiliation) in enumerate(CERTIFICATE_ROWS, 65):
        kind = "بوستر" if fmt == "Poster" else "عرض شفهي"
        lines.append(f"| {i} | {name} | {track} | {title.replace('|', '/')} | {kind} | غير محدد | غير محدد | طلب شهادة مشاركة، {affiliation} |");
    lines += ["", "## المصادر", "", f"[1] [البرنامج النهائي لمؤتمر SCI 2026]({PROGRAM_URL})", f"[2] [معرض صور مؤتمر SCI 2026]({GALLERY_URL})", "", "ملاحظة: يلزم الرجوع إلى كتالوج الملخصات أو قائمة لجنة البوسترات، عند توافرها، لاعتماد كشف شامل ونهائي لجميع الباحثين المشاركين."]
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    assert len(PROGRAM_ROWS) == 64, f"Expected 64 program rows, got {len(PROGRAM_ROWS)}"
    assert len(CERTIFICATE_ROWS) == 5, f"Expected 5 certificate rows, got {len(CERTIFICATE_ROWS)}"
    build_docx()
    build_xlsx()
    build_markdown()
    print(f"Created: {OUT_DOCX}\nCreated: {OUT_XLSX}\nCreated: {OUT_MD}")
