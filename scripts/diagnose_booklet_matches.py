import importlib.util
import json
from pathlib import Path

from reconcile_booklet_records import title_similarity


root = Path("/home/ubuntu")
records = json.loads((root / "booklet_presentation_records.json").read_text(encoding="utf-8"))
spec = importlib.util.spec_from_file_location(
    "report_generator", root / "sci-conference-2026/scripts/build_sci2026_report.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

for record in records:
    if record["page"] >= 79:
        continue
    best_score, best_row = max(
        (title_similarity(record["title"], row[4]), row) for row in module.PROGRAM_ROWS
    )
    if best_score < 0.34:
        print(f"{best_score:.3f}\t{record['researcher']}\t{record['title']}\tBEST: {best_row[4]}")
