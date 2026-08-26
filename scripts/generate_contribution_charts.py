import csv
import json
from collections import Counter
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator


ROOT = Path("/home/ubuntu")
SOURCE_PATH = ROOT / "booklet_reconciled_records.json"
OUTPUT_DIR = ROOT / "SCI2026_contribution_charts"

TRACK_LABELS = {
    "العلوم الحياتية": "Life Sciences",
    "العلوم الفيزيائية": "Physical Sciences",
    "العلوم الكيميائية": "Chemical Sciences",
    "علوم الأرض وأنظمة الأرض": "Geoscience & Earth Systems",
    "العلوم الرياضية والحاسوبية": "Mathematical & Computational Sciences",
    "العلوم الطبية والصحية": "Medical & Health Sciences",
    "المجالات البينية والحديثة": "Interdisciplinary & Emerging Fields",
    "علوم المواد المتقدمة": "Advanced Materials Science",
    "الفلك والفضاء والأرصاد الجوية": "Astronomy, Space & Meteorology",
}

PALETTE = {
    "navy": "#1F4E79",
    "blue": "#3B82B6",
    "teal": "#0F766E",
    "gold": "#C28A00",
    "sky": "#85C1E9",
    "pale": "#EAF2F8",
    "ink": "#17324D",
    "muted": "#5B6B7A",
}


def affiliation_group(affiliation: str) -> str:
    text = (affiliation or "").lower()
    if "faculty of science" in text and "cairo university" in text:
        return "Faculty of Science, Cairo University"
    if "cairo university" in text:
        return "Other Cairo University units"
    if any(
        term in text
        for term in (
            "national research",
            "research institute",
            "research centre",
            "research center",
            "ecrrm",
            "tbri",
            "animal health research",
            "agricultural research",
            "ageri",
            "arc",
        )
    ):
        return "National research centres / institutes"
    if any(
        term in text
        for term in (
            "biogeneric",
            "bgp",
            "slb",
            "wasco",
            "dana gas",
            "techno taste",
            "startup grind",
            "pharma",
            "company",
        )
    ):
        return "Industry / professional sector"
    if any(
        term in text
        for term in (
            "university",
            "zewail",
            "auc",
            "msa",
            "british university",
            "guc",
        )
    ):
        return "Other universities / academia"
    return "Other / not specified"


def institution_label(affiliation: str) -> str:
    text = (affiliation or "").lower()
    if "faculty of science" in text and "cairo university" in text:
        return "Faculty of Science, Cairo University"
    if "ecrrm" in text or "egypt centre for research and regenerative medicine" in text:
        return "Egypt Centre for Research and Regenerative Medicine"
    if "theodor bilharz" in text or "tbri" in text:
        return "Theodor Bilharz Research Institute"
    if "national research centre" in text or "national research center" in text:
        return "National Research Centre"
    if "agricultural research" in text or "ageri" in text or "arc" in text:
        return "Agricultural Research Center"
    if "animal health research" in text:
        return "Animal Health Research Institute"
    if "cairo university" in text:
        return "Cairo University (other units)"
    if "zewail" in text:
        return "Zewail City of Science and Technology"
    if "german university" in text or "guc" in text:
        return "German University in Cairo"
    if "american university" in text or "auc" in text:
        return "American University in Cairo"
    if "ain shams" in text:
        return "Ain Shams University"
    if "king salman" in text:
        return "King Salman International University"
    if "british university" in text:
        return "British University in Egypt"
    if "msa university" in text:
        return "MSA University"
    if "suez university" in text:
        return "Suez University"
    if "biogeneric" in text or "bgp" in text:
        return "BioGeneric Pharma"
    if "slb" in text:
        return "SLB"
    if "wasco" in text or "dana gas" in text:
        return "El Wastani Petroleum Company / Dana Gas"
    if "techno taste" in text:
        return "Techno Taste"
    return "Other named / unspecified institutions"


def build_chart_data(records):
    track_counts = Counter(record["track"] for record in records)
    affiliation_counts = Counter(affiliation_group(record.get("affiliation", "")) for record in records)
    institution_counts = Counter(institution_label(record.get("affiliation", "")) for record in records)
    return {
        "track_counts": dict(track_counts),
        "affiliation_counts": dict(affiliation_counts),
        "institution_counts": dict(institution_counts),
    }


def setup_style():
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "axes.titleweight": "bold",
            "axes.titlecolor": PALETTE["ink"],
            "axes.labelcolor": PALETTE["ink"],
            "xtick.color": PALETTE["muted"],
            "ytick.color": PALETTE["ink"],
            "figure.facecolor": "white",
            "axes.facecolor": "white",
        }
    )


def draw_horizontal_bar(labels, values, title, subtitle, path, color):
    setup_style()
    figure_height = max(5.3, 0.62 * len(labels) + 1.8)
    fig, ax = plt.subplots(figsize=(12, figure_height), dpi=220)
    labels = list(reversed(labels))
    values = list(reversed(values))
    bars = ax.barh(labels, values, color=color, height=0.66, edgecolor="white", linewidth=1.2)
    ax.set_title(title, loc="left", fontsize=18, pad=22)
    ax.text(0, 1.02, subtitle, transform=ax.transAxes, fontsize=10.5, color=PALETTE["muted"], va="bottom")
    ax.set_xlabel("Number of named scientific contributions", fontsize=10.5, labelpad=9)
    ax.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax.grid(axis="x", color="#D9E2F3", linewidth=0.8)
    ax.set_axisbelow(True)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.spines["bottom"].set_color("#B9C5D0")
    max_value = max(values)
    ax.set_xlim(0, max_value + max(2, round(max_value * 0.16)))
    for bar, value in zip(bars, values):
        ax.text(value + max_value * 0.025, bar.get_y() + bar.get_height() / 2, str(value), va="center", fontsize=10.5, fontweight="bold", color=PALETTE["ink"])
    fig.text(
        0.01,
        0.015,
        "Source: SCI 2026 Conference Booklet (70 named Presentation records). One contribution = one titled record.",
        fontsize=8.4,
        color=PALETTE["muted"],
    )
    fig.tight_layout(rect=(0.0, 0.05, 1, 1))
    fig.savefig(path, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def draw_summary(track_items, affiliation_items, path):
    setup_style()
    fig, axes = plt.subplots(1, 2, figsize=(16, 8), dpi=220, gridspec_kw={"wspace": 0.45})
    fig.suptitle("SCI 2026 Researcher Contributions: Track and Affiliation Distribution", x=0.07, ha="left", fontsize=20, fontweight="bold", color=PALETTE["ink"])
    fig.text(0.07, 0.92, "Validated from 70 named scientific contribution records in the official conference booklet", fontsize=11, color=PALETTE["muted"])

    for axis, items, title, color in (
        (axes[0], track_items, "By scientific track", PALETTE["blue"]),
        (axes[1], affiliation_items, "By affiliation group", PALETTE["teal"]),
    ):
        labels = [label for label, _ in items]
        values = [value for _, value in items]
        labels = list(reversed(labels))
        values = list(reversed(values))
        bars = axis.barh(labels, values, color=color, height=0.66)
        axis.set_title(title, loc="left", fontsize=14, pad=13)
        axis.xaxis.set_major_locator(MaxNLocator(integer=True))
        axis.grid(axis="x", color="#D9E2F3", linewidth=0.8)
        axis.set_axisbelow(True)
        axis.spines[["top", "right", "left"]].set_visible(False)
        axis.spines["bottom"].set_color("#B9C5D0")
        max_value = max(values)
        axis.set_xlim(0, max_value + max(2, round(max_value * 0.18)))
        for bar, value in zip(bars, values):
            axis.text(value + max_value * 0.03, bar.get_y() + bar.get_height() / 2, str(value), va="center", fontsize=10, fontweight="bold", color=PALETTE["ink"])
    fig.text(0.07, 0.03, "Affiliation groups are derived from the affiliation text supplied in the booklet; they reflect contribution records, not unique persons or attendance counts.", fontsize=8.6, color=PALETTE["muted"])
    fig.savefig(path, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def write_summary_data(track_items, affiliation_items, institution_items, output_dir):
    with (output_dir / "SCI2026_contribution_chart_data.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.writer(handle)
        writer.writerow(["Dimension", "Category", "Contributions"])
        writer.writerows(("Scientific track", label, value) for label, value in track_items)
        writer.writerows(("Affiliation group", label, value) for label, value in affiliation_items)
        writer.writerows(("Named institution", label, value) for label, value in institution_items)
    (output_dir / "README.md").write_text(
        "# SCI 2026 Contribution Charts\n\n"
        "These standalone PNG charts summarize **70 named scientific contribution records** extracted from the official SCI 2026 conference booklet.\n\n"
        "- **Scientific track** was reconciled with the final conference programme.\n"
        "- **Affiliation group** is a high-level grouping derived from the affiliation text in the booklet.\n"
        "- **Named institutions** identifies the most frequent institutions parsed from the same affiliation text; lower-frequency entries are combined as Other institutions.\n"
        "- Figures represent contribution records, not unique researchers, total registrations, or confirmed attendance.\n",
        encoding="utf-8",
    )


def generate_charts(output_dir=OUTPUT_DIR):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    records = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    data = build_chart_data(records)
    track_items = sorted(
        ((TRACK_LABELS.get(label, label), value) for label, value in data["track_counts"].items()),
        key=lambda item: (-item[1], item[0]),
    )
    affiliation_items = sorted(data["affiliation_counts"].items(), key=lambda item: (-item[1], item[0]))
    institution_items = sorted(data["institution_counts"].items(), key=lambda item: (-item[1], item[0]))
    named_institutions = [item for item in institution_items if item[0] != "Other named / unspecified institutions"]
    top_institutions = named_institutions[:8]
    other_count = len(records) - sum(value for _, value in top_institutions)
    if other_count:
        top_institutions.append(("Other institutions / unspecified", other_count))
    draw_horizontal_bar(
        [label for label, _ in track_items],
        [value for _, value in track_items],
        "SCI 2026 Scientific Contributions by Track",
        "Named contribution records extracted from the official conference booklet",
        output_dir / "SCI2026_contributions_by_track.png",
        PALETTE["blue"],
    )
    draw_horizontal_bar(
        [label for label, _ in affiliation_items],
        [value for _, value in affiliation_items],
        "SCI 2026 Scientific Contributions by Affiliation Group",
        "High-level affiliation groups derived from the official conference booklet",
        output_dir / "SCI2026_contributions_by_affiliation.png",
        PALETTE["teal"],
    )
    draw_horizontal_bar(
        [label for label, _ in top_institutions],
        [value for _, value in top_institutions],
        "SCI 2026 Contributions by Named Institution",
        "Top eight named institutions parsed from booklet affiliations; remaining records are combined as Other",
        output_dir / "SCI2026_contributions_by_named_institution.png",
        PALETTE["gold"],
    )
    draw_summary(track_items, affiliation_items, output_dir / "SCI2026_contribution_distribution_summary.png")
    write_summary_data(track_items, affiliation_items, top_institutions, output_dir)
    return output_dir


if __name__ == "__main__":
    destination = generate_charts()
    print(f"Created charts in {destination}")
