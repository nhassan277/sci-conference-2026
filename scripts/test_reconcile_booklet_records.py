import importlib.util
import json
from pathlib import Path

from reconcile_booklet_records import reconcile_records


root = Path("/home/ubuntu")
records = json.loads((root / "booklet_presentation_records.json").read_text(encoding="utf-8"))
program_spec = importlib.util.spec_from_file_location(
    "report_generator", root / "sci-conference-2026/scripts/build_sci2026_report.py"
)
program_module = importlib.util.module_from_spec(program_spec)
program_spec.loader.exec_module(program_module)

reconciled = reconcile_records(records, program_module.PROGRAM_ROWS)

assert len(reconciled) == 70
assert all(row["researcher"] and row["title"] and row["track"] for row in reconciled)

by_name = {row["researcher"]: row for row in reconciled}
assert by_name["Prof. Dr. Ahmed Galal"]["track"] == "العلوم الكيميائية"
assert by_name["Dr. Waleed Abdallah"]["track"] == "العلوم الرياضية والحاسوبية"
assert by_name["Kyrillos ElAbd"]["track"] == "العلوم الرياضية والحاسوبية"
assert by_name["Dr. Sahar Hassan"]["track"] == "علوم الأرض وأنظمة الأرض"

grp78_record = next(row for row in reconciled if row["title"].startswith("GRP78 and Cell-Surface GRP78"))
assert grp78_record["researcher"] == "Prof. Abdo El Fiki", grp78_record

tarek_record = next(row for row in reconciled if row["researcher"] == "Dr. em. Tarek Kapiel")
assert tarek_record["researcher_source"] == "كتيب المؤتمر", tarek_record

print("Booklet track reconciliation test passed")
