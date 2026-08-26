import json
import re
from pathlib import Path

import pdfplumber


PDF_PATH = Path("/home/ubuntu/upload/SCI2026_Booklet_NHmmmm.pdf")
OUT_PATH = Path("/home/ubuntu/booklet_presentation_records.json")

HEADER_PATTERNS = [
    re.compile(r"^Cairo University$", re.I),
    re.compile(r"^Cairo University\s+SCI 2026$", re.I),
    re.compile(r"^Annual Conference$", re.I),
    re.compile(r"^Faculty of Science$", re.I),
    re.compile(r"^Faculty of Science\s+7-8 April 2026$", re.I),
    re.compile(r"^SCI 2026$", re.I),
    re.compile(r"^7-8 April 2026$", re.I),
    re.compile(r"^\d+$"),
]


def clean(line: str) -> str:
    return re.sub(r"\s+", " ", line.replace("\ufeff", "")).strip()


def is_header(line: str) -> bool:
    return not line or any(pattern.match(line) for pattern in HEADER_PATTERNS)


def looks_like_person_name(line: str) -> bool:
    line = clean(line)
    if not line or any(term in line.lower() for term in ("department", "faculty", "university", "abstract", "presentation")):
        return False
    if re.match(r"^(Major General|Prof\.|Assoc\.|Ass\.|Dr\.|Eng\.|Ms\.|Mr\.)", line):
        return True
    return bool(re.match(r"^[A-Z][A-Za-z'’.-]+(?:\s+[A-Z][A-Za-z'’.-]+){1,5}$", line))


def collect_title(lines, start_index):
    title_parts = []
    for index, line in enumerate(lines[start_index:], start_index):
        if line.startswith("Abstract:"):
            break
        next_lines = lines[index + 1 : index + 4]
        if looks_like_person_name(line) and any(next_line.startswith("Presentation:") for next_line in next_lines):
            break
        if line:
            title_parts.append(line)
    return " ".join(title_parts)


def extract_preceding_identity(lines, presentation_index):
    start = 0
    for pos in range(presentation_index - 1, -1, -1):
        line = lines[pos]
        if line.startswith("Abstract:") or line.startswith("Presentation:") or set(line) == {"-"}:
            start = pos + 1
            break
    candidates = [line for line in lines[start:presentation_index] if not is_header(line)]
    if not candidates:
        return "", ""
    name = candidates[0]
    affiliation = " ".join(candidates[1:])
    return name, affiliation


records = []
with pdfplumber.open(PDF_PATH) as pdf:
    for page_no, page in enumerate(pdf.pages, 1):
        raw_text = page.extract_text(x_tolerance=2, y_tolerance=3) or ""
        lines = [clean(line) for line in raw_text.splitlines()]
        for idx, line in enumerate(lines):
            if not line.startswith("Presentation:"):
                continue
            title = line.removeprefix("Presentation:").strip()
            continuation = collect_title(lines, idx + 1)
            if continuation:
                title = f"{title} {continuation}".strip()
            name, affiliation = extract_preceding_identity(lines, idx)
            if not looks_like_person_name(name):
                previous_on_page = next((item for item in reversed(records) if item["page"] == page_no), None)
                if previous_on_page:
                    name = previous_on_page["researcher"]
                    affiliation = previous_on_page["affiliation"]
            records.append(
                {
                    "page": page_no,
                    "researcher": name,
                    "affiliation": affiliation,
                    "title": title,
                    "source": "SCI2026_Booklet_NHmmmm.pdf",
                }
            )

OUT_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Extracted {len(records)} presentation records to {OUT_PATH}")
for record in records:
    print(f"p.{record['page']:02d} | {record['researcher']} | {record['title']}")
