import importlib.util
import tempfile
from pathlib import Path


spec = importlib.util.spec_from_file_location(
    "final_report", Path(__file__).with_name("build_sci2026_final_report.py")
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

with tempfile.TemporaryDirectory() as temp_dir:
    output_dir = Path(temp_dir)
    docx_path, xlsx_path, markdown_path = module.build_final_report(output_dir)
    assert docx_path.exists() and docx_path.stat().st_size > 0
    assert xlsx_path.exists() and xlsx_path.stat().st_size > 0
    assert markdown_path.exists() and markdown_path.stat().st_size > 0

print("Final report build test passed")
