import json
from collections import Counter
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import DataBarRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

from build_sci2026_report import (
    GALLERY_URL,
    LOGO,
    PHOTO_POSTER,
    PHOTO_POSTER_2,
    PROGRAM_URL,
    REGISTRATION_COUNTS,
    TRACKS,
    add_doc_heading,
    add_doc_para,
    add_doc_table,
    set_cell_text,
    set_rtl,
)


ROOT = Path("/home/ubuntu")
RECONCILED_PATH = ROOT / "booklet_reconciled_records.json"
BOOKLET_NAME = "SCI2026_Booklet_NHmmmm.pdf"
BLUE = "1F4E79"
LIGHT_BLUE = "D9EAF7"


def load_records():
    records = json.loads(RECONCILED_PATH.read_text(encoding="utf-8"))
    assert len(records) == 70, f"Expected 70 reconciled records, got {len(records)}"
    assert all(record["researcher"] and record["title"] and record["track"] for record in records)
    return records


def build_markdown(records, path):
    track_counts = Counter(record["track"] for record in records)
    lines = [
        "# تقرير عن مؤتمر كلية العلوم، جامعة القاهرة ٢٠٢٦",
        "",
        "**Science at the Core of Innovation | العلوم في قلب الابتكار**",
        "",
        "> عقد المؤتمر في ٧–٨ أبريل ٢٠٢٦ بمركز مؤتمرات جامعة القاهرة، المدينة الجامعية. يستند كشف الباحثين وعناوين العروض إلى كتيب المؤتمر الرسمي.[1]",
        "",
        "## المحاور العلمية والمساهمات البحثية",
        "",
        "| المحور | عدد المساهمات الموثقة في الكتيب |",
        "|---|---:|",
    ]
    for track_ar, _, _ in TRACKS:
        lines.append(f"| {track_ar} | {track_counts.get(track_ar, 0)} |")
    lines.extend([
        f"| **الإجمالي** | **{len(records)}** |",
        "",
        "## جدول الباحثين والمساهمات العلمية",
        "",
        "| م | اسم الباحث/المتحدث | الجهة | المحور | عنوان البحث أو العرض | نوع المساهمة | صفحة الكتيب |",
        "|---:|---|---|---|---|---|---:|",
    ])
    for index, record in enumerate(records, 1):
        affiliation = record["affiliation"] or "غير مذكورة في الكتيب"
        lines.append(
            f"| {index} | {record['researcher']} | {affiliation} | {record['track']} | "
            f"{record['title'].replace('|', '/')} | عرض/بحث علمي | {record['page']} |"
        )
    lines.extend([
        "",
        "## ملاحظات التوثيق",
        "",
        "يعتمد الجدول على مدخلات `Presentation:` في كتيب المؤتمر. لا يصف الكتيب جميع المدخلات بوصفها بوسترات أو عروضاً شفهية؛ ولذلك ورد النوع في الجدول بصيغة «عرض/بحث علمي» بدلاً من افتراض نوع غير موثق. تم استكمال اسم باحث واحد من البرنامج النهائي لأن صفحة الكتيب المقابلة ذكرت القسم فقط دون الاسم. أما المحاور فتمت مطابقتها مع البرنامج النهائي؛ وأُدرجت الملخصات الخاصة في الصفحات ٧٩–٨٣ تحت محور العلوم الرياضية والحاسوبية.[1] [2]",
        "",
        "## References",
        "",
        f"[1] {BOOKLET_NAME}. Conference booklet supplied by the Faculty of Science, Cairo University (94 pages).",
        f"[2] [SCI 2026 Final Programme]({PROGRAM_URL}).",
        f"[3] [SCI 2026 Live Gallery]({GALLERY_URL}).",
    ])
    path.write_text("\n".join(lines), encoding="utf-8")


def style_doc_table(table):
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                set_rtl(paragraph, WD_ALIGN_PARAGRAPH.RIGHT)
                for run in paragraph.runs:
                    run.font.name = "Yu Gothic UI Semilight"
                    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Yu Gothic UI Semilight")
                    run.font.size = Pt(7)


def build_docx(records, path):
    track_counts = Counter(record["track"] for record in records)
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
    run = p.add_run("تقرير عن مؤتمر كلية العلوم، جامعة القاهرة ٢٠٢٦")
    run.font.name = "Nirmala Text"
    run.bold = True
    run.font.size = Pt(22)
    run.font.color.rgb = RGBColor(31, 78, 121)

    p = doc.add_paragraph()
    set_rtl(p, WD_ALIGN_PARAGRAPH.CENTER)
    run = p.add_run("Science at the Core of Innovation | العلوم في قلب الابتكار")
    run.font.name = "Yu Gothic UI Semilight"
    run.font.size = Pt(13)
    run.bold = True

    p = doc.add_paragraph()
    set_rtl(p, WD_ALIGN_PARAGRAPH.CENTER)
    run = p.add_run("٧–٨ أبريل ٢٠٢٦ | مركز مؤتمرات جامعة القاهرة، المدينة الجامعية")
    run.font.name = "Yu Gothic UI Semilight"
    run.font.size = Pt(11)

    doc.add_paragraph()
    add_doc_heading(doc, "أولاً: الغرض من التقرير")
    add_doc_para(
        doc,
        "أُعد هذا التقرير استجابةً لطلب توثيق مؤتمر كلية العلوم لعام ٢٠٢٦، مع إرفاق جدول يوضح أسماء الباحثين والمشاركين في العروض العلمية، والمحاور البحثية، وعناوين البحوث أو العروض، وصوراً من جلسة البوسترات. يعتمد كشف المشاركات على كتيب المؤتمر الرسمي المكوّن من ٩٤ صفحة، وهو المصدر الأساسي للأسماء والعناوين والجهات العلمية. [1]",
    )
    add_doc_para(
        doc,
        f"يوثق الكتيب الرسمي {len(records)} مساهمة علمية مسمّاة في صورة عروض أو أبحاث. وقد جرى توزيعها على المحاور البحثية المعلنة للمؤتمر، مع مطابقة عناوين الكتيب مع البرنامج النهائي متى وردت تفاصيل الجلسة. [1] [2]",
    )

    add_doc_heading(doc, "ثانياً: المحاور البحثية وأعداد المساهمات الموثقة")
    track_rows = []
    for ar, en, scope in TRACKS:
        note = "ملخصات الجلسة الخاصة في صفحات ٧٩–٨٣" if ar == "العلوم الرياضية والحاسوبية" else ""
        track_rows.append((ar, en, track_counts.get(ar, 0), scope, note))
    table = add_doc_table(
        doc,
        ["المحور", "الاسم بالإنجليزية", "عدد المساهمات", "نطاق المحور", "ملاحظة"],
        track_rows,
        [3.2, 3.5, 1.6, 5.4, 3.0],
        8,
    )
    style_doc_table(table)
    add_doc_para(doc, "الإجمالي في الجدول أعلاه هو عدد المساهمات العلمية المسماة في الكتيب، وليس عدد الحضور العام للمؤتمر.")

    add_doc_heading(doc, "ثالثاً: بيانات التسجيل المؤرشفة")
    registration_rows = [(ar, en, count) for ar, en, count in REGISTRATION_COUNTS]
    registration_rows.append(("الإجمالي", "Total", sum(count for _, _, count in REGISTRATION_COUNTS)))
    table = add_doc_table(doc, ["الفئة", "Category", "عدد سجلات التسجيل"], registration_rows, [6.0, 6.0, 4.0], 9)
    style_doc_table(table)
    add_doc_para(doc, "تُعرض بيانات التسجيل للمرجعية الإدارية فقط؛ وهي سجلات تسجيل متاحة وليست عدداً مؤكداً للحضور الفعلي، نظراً إلى عدم اكتمال سجلات تسجيل الدخول المؤرشفة.")

    add_doc_heading(doc, "رابعاً: توثيق مصور من جلسة البوسترات")
    add_doc_para(doc, "تُظهر الصور التالية جانباً من جلسة عرض البوسترات. لا ينسب التقرير الأفراد الظاهرين في الصور إلى سجلات محددة إلا عند وجود توثيق مباشر يربط الصورة بالسجل.")
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
    add_doc_heading(doc, "خامساً: جدول الباحثين والمشاركات العلمية")
    add_doc_para(doc, "يتضمن الجدول التالي جميع السجلات ذات العنوان المسجل تحت بند Presentation في كتيب المؤتمر. يمثل «النوع» عرضاً أو بحثاً علمياً بحسب تسمية الكتيب؛ ولا يفترض التقرير أن أي مساهمة بوستر أو عرض شفهي ما لم يذكر المصدر ذلك صراحة.")
    landscape = doc.add_section(WD_ORIENT.LANDSCAPE)
    landscape.page_width, landscape.page_height = landscape.page_height, landscape.page_width
    landscape.top_margin = Cm(1.2)
    landscape.bottom_margin = Cm(1.2)
    landscape.left_margin = Cm(1.1)
    landscape.right_margin = Cm(1.1)

    rows = []
    for index, record in enumerate(records, 1):
        rows.append(
            (
                index,
                record["researcher"],
                record["affiliation"] or "غير مذكورة في الكتيب",
                record["track"],
                record["title"],
                "عرض/بحث علمي",
                record["page"],
            )
        )
    table = add_doc_table(
        doc,
        ["م", "اسم الباحث/المتحدث", "الجهة", "المحور", "عنوان البحث أو العرض", "النوع", "صفحة الكتيب"],
        rows,
        [0.7, 3.6, 4.2, 3.0, 8.2, 1.8, 1.2],
        7,
    )
    style_doc_table(table)

    doc.add_page_break()
    add_doc_heading(doc, "سادساً: المصادر ومنهجية التوثيق")
    add_doc_para(doc, f"[1] كتيب المؤتمر: {BOOKLET_NAME}، ٩٤ صفحة، نسخة مقدمة من كلية العلوم بجامعة القاهرة.")
    add_doc_para(doc, f"[2] البرنامج النهائي لمؤتمر SCI 2026: {PROGRAM_URL}")
    add_doc_para(doc, f"[3] معرض صور مؤتمر SCI 2026: {GALLERY_URL}")
    add_doc_para(doc, "منهجية إعداد الجدول: اعتمدت الأسماء والعناوين والجهات مباشرة من الكتيب. طابقت المحاور مع البرنامج النهائي؛ وعولجت الملخصات الخاصة في صفحات ٧٩–٨٣ بوصفها جزءاً من محور العلوم الرياضية والحاسوبية. وردت صفحة واحدة في الكتيب باسم القسم دون اسم الباحث، فاستُكمل الاسم من البرنامج النهائي مع الإشارة إلى ذلك في ملف Excel.")
    doc.save(path)


def build_xlsx(records, path):
    track_counts = Counter(record["track"] for record in records)
    wb = Workbook()
    wb.remove(wb.active)
    thin = Side(style="thin", color="D9E2F3")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    overview = wb.create_sheet("نظرة عامة")
    overview.sheet_view.showGridLines = False
    overview.merge_cells("B2:H2")
    set_cell_text(overview["B2"], "تقرير مؤتمر كلية العلوم، جامعة القاهرة ٢٠٢٦", True, "FFFFFF", 18, "center", BLUE)
    overview.row_dimensions[2].height = 34
    overview.merge_cells("B3:H3")
    set_cell_text(overview["B3"], "البيانات البحثية من كتيب SCI 2026 الرسمي", False, "444444", 11, "center")
    overview.merge_cells("B5:H5")
    set_cell_text(overview["B5"], "مؤشرات موثقة", True, BLUE, 13, "right", LIGHT_BLUE)
    metrics = [
        ("المساهمات العلمية المسماة في الكتيب", len(records), "العروض أو الأبحاث تحت بند Presentation"),
        ("المحاور البحثية المعلنة", len(TRACKS), "وفق صفحة المحاور في كتيب المؤتمر"),
        ("سجلات التسجيل المؤرشفة", sum(count for _, _, count in REGISTRATION_COUNTS), "مرجعية إدارية، وليست تأكيداً للحضور الفعلي"),
    ]
    for row, (label, value, note) in enumerate(metrics, 6):
        set_cell_text(overview.cell(row, 2), label, True, "000000", 11, "right", LIGHT_BLUE)
        overview.cell(row, 3, value)
        overview.cell(row, 3).font = Font(name="Arial", bold=True, color=BLUE, size=11)
        overview.cell(row, 3).alignment = Alignment(horizontal="center", vertical="center")
        set_cell_text(overview.cell(row, 4), note, False, "555555", 10, "right")
        for col in range(2, 5):
            overview.cell(row, col).border = border
        overview.row_dimensions[row].height = 26
    overview.merge_cells("B11:H11")
    set_cell_text(overview["B11"], "المصدر الرئيس للأسماء والعناوين والجهات: كتيب SCI 2026 الرسمي (٩٤ صفحة).", False, "555555", 10, "right", "FFF2CC")
    overview.merge_cells("B13:H13")
    set_cell_text(overview["B13"], "ملاحظة: تم استكمال اسم الباحث في سجل GRP78 من البرنامج النهائي لأن الكتيب ذكر القسم فقط دون الاسم.", False, "7F6000", 10, "right", "FFF2CC")
    for col, width in {"A": 3, "B": 34, "C": 18, "D": 58, "E": 3, "F": 10, "G": 10, "H": 10}.items():
        overview.column_dimensions[col].width = width

    tracks = wb.create_sheet("المحاور")
    tracks.sheet_view.showGridLines = False
    tracks.merge_cells("B2:F2")
    set_cell_text(tracks["B2"], "المحاور وأعداد المساهمات الموثقة في الكتيب", True, "FFFFFF", 16, "center", BLUE)
    headers = ["المحور بالعربية", "Track", "النطاق", "عدد المساهمات", "ملاحظة"]
    for col, header in enumerate(headers, 2):
        set_cell_text(tracks.cell(5, col), header, True, "FFFFFF", 10, "center", BLUE)
    for index, (ar, en, scope) in enumerate(TRACKS, 6):
        set_cell_text(tracks.cell(index, 2), ar, False, "000000", 10, "right")
        set_cell_text(tracks.cell(index, 3), en, False, "000000", 10, "left")
        set_cell_text(tracks.cell(index, 4), scope, False, "000000", 9, "left")
        tracks.cell(index, 5, track_counts.get(ar, 0))
        tracks.cell(index, 5).number_format = "#,##0"
        tracks.cell(index, 5).alignment = Alignment(horizontal="center", vertical="center")
        note = "ملخصات الجلسة الخاصة في صفحات ٧٩–٨٣" if ar == "العلوم الرياضية والحاسوبية" else ""
        set_cell_text(tracks.cell(index, 6), note, False, "555555", 9, "right")
        for col in range(2, 7):
            tracks.cell(index, col).border = border
        tracks.row_dimensions[index].height = 44
    tracks.auto_filter.ref = "B5:F14"
    tracks.freeze_panes = "B6"
    tracks.conditional_formatting.add("E6:E14", DataBarRule(start_type="min", end_type="max", color=BLUE))
    chart = BarChart()
    chart.title = "مساهمات الكتيب حسب المحور"
    chart.add_data(Reference(tracks, min_col=5, min_row=5, max_row=14), titles_from_data=True)
    chart.set_categories(Reference(tracks, min_col=2, min_row=6, max_row=14))
    chart.height = 8
    chart.width = 18
    tracks.add_chart(chart, "B17")
    for col, width in {"A": 3, "B": 31, "C": 34, "D": 50, "E": 18, "F": 36}.items():
        tracks.column_dimensions[col].width = width

    participants = wb.create_sheet("الباحثون والعروض")
    participants.sheet_view.showGridLines = False
    participants.merge_cells("B2:K2")
    set_cell_text(participants["B2"], "جدول الباحثين والمساهمات العلمية المستخرج من كتيب SCI 2026", True, "FFFFFF", 15, "center", BLUE)
    headers = ["م", "اسم الباحث/المتحدث", "الجهة", "المحور", "عنوان البحث أو العرض", "النوع", "التاريخ", "المكان", "صفحة الكتيب", "مرجع اسم الباحث"]
    for col, header in enumerate(headers, 2):
        set_cell_text(participants.cell(5, col), header, True, "FFFFFF", 10, "center", BLUE)
    for row, record in enumerate(records, 6):
        values = [
            row - 5,
            record["researcher"],
            record["affiliation"] or "غير مذكورة في الكتيب",
            record["track"],
            record["title"],
            "عرض/بحث علمي",
            record["date"],
            record["venue"],
            record["page"],
            record["researcher_source"],
        ]
        fill = "FFF2CC" if record["researcher_source"] != "كتيب المؤتمر" else None
        for col, value in enumerate(values, 2):
            set_cell_text(participants.cell(row, col), value, False, "000000", 9, "right" if col not in (3, 6) else "left", fill)
            participants.cell(row, col).border = border
        participants.row_dimensions[row].height = 46
    participants.auto_filter.ref = f"B5:K{len(records) + 5}"
    participants.freeze_panes = "B6"
    participants.sheet_properties.pageSetUpPr.fitToPage = True
    participants.page_setup.orientation = "landscape"
    participants.page_setup.fitToWidth = 1
    participants.page_setup.fitToHeight = 0
    for col, width in {"A": 3, "B": 7, "C": 32, "D": 52, "E": 30, "F": 72, "G": 16, "H": 15, "I": 22, "J": 15, "K": 36}.items():
        participants.column_dimensions[col].width = width

    sources = wb.create_sheet("المصادر والمنهجية")
    sources.sheet_view.showGridLines = False
    sources.merge_cells("B2:H2")
    set_cell_text(sources["B2"], "المصادر ومنهجية التوثيق", True, "FFFFFF", 16, "center", BLUE)
    notes = [
        f"المصدر الرئيس: {BOOKLET_NAME}، كتيب مؤتمر SCI 2026، ٩٤ صفحة، نسخة مقدمة من كلية العلوم.",
        "استُخرجت المساهمات من السجلات التي يسبق عنوانها بند Presentation في الكتيب، وعددها ٧٠ سجلاً.",
        "طابقت المحاور مع البرنامج النهائي؛ وأدرجت ملخصات الجلسة الخاصة في صفحات ٧٩–٨٣ ضمن العلوم الرياضية والحاسوبية.",
        "السجل المظلل في جدول الباحثين استُكمل فيه اسم الباحث من البرنامج النهائي، إذ إن الكتيب ذكر القسم فقط.",
        f"البرنامج النهائي: {PROGRAM_URL}",
        f"معرض صور المؤتمر: {GALLERY_URL}",
        f"تاريخ الإنشاء: {date.today().isoformat()}",
    ]
    for row, note in enumerate(notes, 5):
        sources.merge_cells(start_row=row, start_column=2, end_row=row, end_column=8)
        set_cell_text(sources.cell(row, 2), note, False, "000000", 11, "right")
        sources.row_dimensions[row].height = 36
    for col in range(1, 9):
        sources.column_dimensions[get_column_letter(col)].width = 20

    wb.save(path)


def build_final_report(output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    records = load_records()
    docx_path = output_dir / "SCI2026_Official_Conference_Report.docx"
    xlsx_path = output_dir / "SCI2026_Verified_Researcher_Table.xlsx"
    markdown_path = output_dir / "SCI2026_Official_Conference_Report.md"
    build_docx(records, docx_path)
    build_xlsx(records, xlsx_path)
    build_markdown(records, markdown_path)
    return docx_path, xlsx_path, markdown_path


if __name__ == "__main__":
    files = build_final_report(ROOT)
    for file in files:
        print(f"Created: {file}")
