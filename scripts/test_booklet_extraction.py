import json
from pathlib import Path


records = json.loads(Path("/home/ubuntu/booklet_presentation_records.json").read_text(encoding="utf-8"))

assert len(records) == 70, f"Expected 70 booklet presentations, got {len(records)}"
assert records[0]["researcher"] == "Major General Dr. Khaled Amer", records[0]
assert any(
    record["researcher"] == "Dr. Waleed Abdallah"
    and record["title"].startswith("Neutrino Anomalies and New Physics")
    for record in records
), "The second presentation on page 80 was not linked to Dr. Waleed Abdallah"

iron_record = next(record for record in records if record["title"].startswith("Egyptian Iron Ore for Supporting National Economy"))
assert iron_record["researcher"] == "Prof. Dr. Mortada Mourad Taha El Aref", iron_record

water_record = next(record for record in records if record["title"] == "Water generator")
assert water_record["researcher"] == "Ass. Prof. Walaa Abbas Elsayed Omar", water_record

print("Booklet extraction test passed")
