import importlib.util
import tempfile
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("build_sci2026_report.py")
spec = importlib.util.spec_from_file_location("report_generator", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


with tempfile.TemporaryDirectory() as temp_dir:
    module.OUT_XLSX = Path(temp_dir) / "SCI2026_Researcher_Participant_Table.xlsx"
    module.build_xlsx()
    assert module.OUT_XLSX.exists(), "Workbook was not created"
    assert module.OUT_XLSX.stat().st_size > 0, "Workbook is empty"

print("Report workbook generation test passed")
