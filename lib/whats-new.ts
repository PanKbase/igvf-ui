/**
 * Release notes for the "What's new" strip on the Data Library landing page. The page shows the
 * `WHATS_NEW_COUNT` newest entries, sorted by `date`, so entries can be added in any order. With
 * no entries, the strip doesn't render. This list lives in code, not in a CMS or an igvfd object.
 */

export type ReleaseNote = {
  /** Month of the release, "YYYY-MM" */
  date: string;
  title: string;
  /** One line describing the release; keep it short enough to fit a compact card */
  summary: string;
  /** Where the title links to; a same-site path or a full URL */
  href: string;
};

/** Number of release notes the landing page shows. */
export const WHATS_NEW_COUNT = 3;

/** Where "All updates →" goes. */
export const NEWS_URL = "https://pankbase.org/news.html";

/**
 * TODO: Every entry below is a PLACEHOLDER. Replace the titles, summaries and links (all of
 * them currently point to the News page) with the real release notes before the page goes live.
 */
export const WHATS_NEW: ReadonlyArray<ReleaseNote> = [
  {
    // TODO: placeholder entry; replace date, title, summary and href.
    date: "2026-09",
    title: "cRE-to-gene links (ABC) by islet cell type",
    summary: "TODO: one-line summary goes here.",
    href: NEWS_URL,
  },
  {
    // TODO: placeholder entry; replace date, title, summary and href.
    date: "2026-05",
    title: "Per-donor dynamic perifusion traits for 413 donors",
    summary: "TODO: one-line summary goes here.",
    href: NEWS_URL,
  },
  {
    // TODO: placeholder entry; replace date, title, summary and href.
    date: "2026-05",
    title: "Differential expression results by cell type",
    summary: "TODO: one-line summary goes here.",
    href: NEWS_URL,
  },
];

/**
 * Format a "YYYY-MM" date as an abbreviated month and year, e.g. "Sep 2026". Done without `Date`
 * so the result can't shift with the time zone and the server and browser render the same text.
 * @param date Month in "YYYY-MM" format
 * @returns Month and year, or the input unchanged if it isn't in "YYYY-MM" format
 */
export function formatReleaseNoteDate(date: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(date);
  if (!match) {
    return date;
  }
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(match[2]) - 1]} ${match[1]}`;
}

/**
 * Get the release notes the landing page shows: the newest `limit`, newest first. Entries from
 * the same month keep the order they have in the list.
 * @param notes Release notes in any order
 * @param limit Maximum number of notes to return
 * @returns Newest notes first
 */
export function getNewestReleaseNotes(
  notes: ReadonlyArray<ReleaseNote> = WHATS_NEW,
  limit = WHATS_NEW_COUNT
): Array<ReleaseNote> {
  // "YYYY-MM" strings sort chronologically as text. `sort` is stable, so ties keep list order.
  return [...notes]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}
