import { describe, it, expect, vi, beforeEach } from "vitest";

// Test the workshop multi-select logic (pure logic, no DB calls needed)
describe("Multi-Workshop Registration Logic", () => {
  const ALL_WORKSHOPS = [
    { key: "chitosan", fee: 100, tag: "Pre-Conference" },
    { key: "agitech", fee: 200, tag: "Pre-Conference" },
    { key: "nawah", fee: 200, tag: "During Conference" },
    { key: "marc", fee: 200, tag: "During Conference" },
    { key: "geochemistry", fee: 0, tag: "During Conference", isFree: true },
    { key: "scrna_seq", fee: 200, tag: "Post-Conference" },
    { key: "ai_biotech", fee: 100, tag: "Post-Conference" },
    { key: "gesr_scholarships", fee: 0, tag: "Post-Conference", isFree: true },
    { key: "hvd_genomics", fee: 200, tag: "Post-Conference" },
    { key: "colors_metagenomics", fee: 200, tag: "TBA" },
  ];

  it("should allow selecting multiple workshops from different date groups", () => {
    const selected = new Set(["chitosan", "nawah", "scrna_seq"]);
    expect(selected.size).toBe(3);
    const preConf = ALL_WORKSHOPS.filter(w => selected.has(w.key) && w.tag === "Pre-Conference");
    const during = ALL_WORKSHOPS.filter(w => selected.has(w.key) && w.tag === "During Conference");
    const post = ALL_WORKSHOPS.filter(w => selected.has(w.key) && w.tag === "Post-Conference");
    expect(preConf.length).toBe(1);
    expect(during.length).toBe(1);
    expect(post.length).toBe(1);
  });

  it("should correctly calculate total fees for multiple workshops", () => {
    const selected = ["chitosan", "nawah", "scrna_seq"];
    const totalFee = selected.reduce((sum, key) => {
      const ws = ALL_WORKSHOPS.find(w => w.key === key);
      return sum + (ws?.fee ?? 0);
    }, 0);
    expect(totalFee).toBe(100 + 200 + 200); // 500 EGP
  });

  it("should not charge for free workshops", () => {
    const selected = ["geochemistry", "gesr_scholarships"];
    const totalFee = selected.reduce((sum, key) => {
      const ws = ALL_WORKSHOPS.find(w => w.key === key);
      return sum + (ws?.fee ?? 0);
    }, 0);
    expect(totalFee).toBe(0);
  });

  it("should require invoice only for paid workshops", () => {
    const selected = ["geochemistry", "gesr_scholarships", "nawah"];
    const paidWorkshops = selected.filter(key => {
      const ws = ALL_WORKSHOPS.find(w => w.key === key);
      return ws && ws.fee > 0;
    });
    expect(paidWorkshops).toEqual(["nawah"]);
    expect(paidWorkshops.length).toBe(1);
  });

  it("should allow selecting all 10 workshops at once", () => {
    const allKeys = ALL_WORKSHOPS.map(w => w.key);
    const selected = new Set(allKeys);
    expect(selected.size).toBe(10);
    const totalFee = allKeys.reduce((sum, key) => {
      const ws = ALL_WORKSHOPS.find(w => w.key === key);
      return sum + (ws?.fee ?? 0);
    }, 0);
    expect(totalFee).toBe(100 + 200 + 200 + 200 + 0 + 200 + 100 + 0 + 200 + 200); // 1400 EGP
  });

  it("should correctly derive wantsWorkshop from selectedWorkshops", () => {
    const duringConferenceKeys = ["nawah", "marc", "medsol", "agitech", "geochemistry"];
    const selected = ["chitosan", "nawah", "scrna_seq"];
    const wantsWorkshop = selected.some(k => duringConferenceKeys.includes(k));
    const wantsExtWorkshop = selected.some(k => !duringConferenceKeys.includes(k));
    expect(wantsWorkshop).toBe(true);
    expect(wantsExtWorkshop).toBe(true);
  });

  it("should handle empty selection gracefully", () => {
    const selected: string[] = [];
    const totalFee = selected.reduce((sum, key) => {
      const ws = ALL_WORKSHOPS.find(w => w.key === key);
      return sum + (ws?.fee ?? 0);
    }, 0);
    expect(totalFee).toBe(0);
    expect(selected.length).toBe(0);
  });
});
