import json
import tempfile
from pathlib import Path

from generate_contribution_charts import affiliation_group, build_chart_data, generate_charts, institution_label


assert affiliation_group("Chemistry Department, Faculty of Science, Cairo University") == "Faculty of Science, Cairo University"
assert affiliation_group("Faculty of Medicine (Kasr Al-Ainy), Cairo University") == "Other Cairo University units"
assert affiliation_group("Egypt Centre for Research and Regenerative Medicine (ECRRM)") == "National research centres / institutes"
assert affiliation_group("Operations Director at BioGeneric pharma (BGP)") == "Industry / professional sector"
assert affiliation_group("Zewail City of Science and Technology") == "Other universities / academia"

assert institution_label("Chemistry Department, Faculty of Science, Cairo University") == "Faculty of Science, Cairo University"
assert institution_label("Egypt Centre for Research and Regenerative Medicine (ECRRM)") == "Egypt Centre for Research and Regenerative Medicine"
assert institution_label("Professor, Molecular Biology Department, Biotechnology Research Institute, National Research Centre") == "National Research Centre"
assert institution_label("Startup Grind Chapter Director") == "Other named / unspecified institutions"

records = json.loads(Path("/home/ubuntu/booklet_reconciled_records.json").read_text(encoding="utf-8"))
data = build_chart_data(records)
assert sum(data["track_counts"].values()) == 70
assert sum(data["affiliation_counts"].values()) == 70
assert len(data["track_counts"]) == 9

with tempfile.TemporaryDirectory() as temp_dir:
    output_dir = generate_charts(temp_dir)
    assert (output_dir / "SCI2026_contributions_by_named_institution.png").exists()
    csv_data = (output_dir / "SCI2026_contribution_chart_data.csv").read_text(encoding="utf-8-sig")
    assert "Named institution" in csv_data

print("Contribution chart data test passed")
