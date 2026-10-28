import {
  formatReleaseNoteDate,
  getNewestReleaseNotes,
  WHATS_NEW,
  WHATS_NEW_COUNT,
} from "../whats-new";
import type { ReleaseNote } from "../whats-new";

function note(date: string, title = date): ReleaseNote {
  return { date, title, summary: "Summary", href: "/news/" };
}

describe("formatReleaseNoteDate", () => {
  it("formats YYYY-MM as an abbreviated month and year", () => {
    expect(formatReleaseNoteDate("2026-09")).toBe("Sep 2026");
    expect(formatReleaseNoteDate("2026-05")).toBe("May 2026");
    expect(formatReleaseNoteDate("2025-01")).toBe("Jan 2025");
    expect(formatReleaseNoteDate("2024-12")).toBe("Dec 2024");
  });

  it("returns a malformed date unchanged", () => {
    expect(formatReleaseNoteDate("2026-13")).toBe("2026-13");
    expect(formatReleaseNoteDate("2026-5")).toBe("2026-5");
    expect(formatReleaseNoteDate("")).toBe("");
  });
});

describe("getNewestReleaseNotes", () => {
  it("shows three notes", () => {
    expect(WHATS_NEW_COUNT).toBe(3);
  });

  it("sorts newest first no matter the order of the list, and keeps only the newest three", () => {
    const notes = [
      note("2025-11"),
      note("2026-09"),
      note("2024-12"),
      note("2026-05"),
    ];
    expect(getNewestReleaseNotes(notes).map((n) => n.date)).toEqual([
      "2026-09",
      "2026-05",
      "2025-11",
    ]);
  });

  it("keeps list order within the same month", () => {
    const notes = [note("2026-05", "first"), note("2026-05", "second")];
    expect(getNewestReleaseNotes(notes).map((n) => n.title)).toEqual([
      "first",
      "second",
    ]);
  });

  it("doesn't change the list it's given", () => {
    const notes = [note("2025-01"), note("2026-01")];
    getNewestReleaseNotes(notes);
    expect(notes.map((n) => n.date)).toEqual(["2025-01", "2026-01"]);
  });

  it("returns nothing for an empty list", () => {
    expect(getNewestReleaseNotes([])).toEqual([]);
  });
});

describe("WHATS_NEW config", () => {
  it("has exactly three entries with valid months", () => {
    expect(WHATS_NEW).toHaveLength(3);
    WHATS_NEW.forEach((entry) => {
      expect(entry.date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    });
  });

  it("has a non-empty title and summary in every entry, with no TODO text", () => {
    WHATS_NEW.forEach((entry) => {
      expect(entry.title.trim()).not.toBe("");
      expect(entry.summary.trim()).not.toBe("");
      expect(entry.title).not.toMatch(/todo/i);
      expect(entry.summary).not.toMatch(/todo/i);
    });
  });

  it("links every entry to an /analysis-sets/<accession>/ page or a /search/ URL with a type", () => {
    WHATS_NEW.forEach((entry) => {
      const url = new URL(entry.href, "https://example.org");
      expect(url.origin).toBe("https://example.org"); // same-site, not a full URL
      const isAnalysisSet = /^\/analysis-sets\/[A-Za-z0-9]+\/$/.test(
        entry.href
      );
      const isSearch =
        url.pathname === "/search/" && Boolean(url.searchParams.get("type"));
      expect(isAnalysisSet || isSearch).toBe(true);
    });
  });
});
