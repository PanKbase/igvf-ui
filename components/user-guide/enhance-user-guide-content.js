/**
 * Post-render DOM enhancements for the user guide page.
 * Does not modify stored page content — only adds classes and wrappers.
 */

const CALLOUT_PATTERN = /(tip|note|warning|caution)\s*:/i;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCalloutType(headingText) {
  const match = CALLOUT_PATTERN.exec(headingText);
  if (!match) {
    return null;
  }
  const kind = match[1].toLowerCase();
  if (kind === "caution") {
    return "warning";
  }
  return kind;
}

function wrapCallout(h3) {
  const type = getCalloutType(h3.textContent);
  if (!type) {
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.className = `user-guide-callout user-guide-callout--${type}`;
  h3.parentNode.insertBefore(wrapper, h3);
  wrapper.appendChild(h3);
  let sibling = wrapper.nextElementSibling;
  while (sibling && !["H2", "H3"].includes(sibling.tagName)) {
    const next = sibling.nextElementSibling;
    wrapper.appendChild(sibling);
    sibling = next;
  }
}

function styleEntryCards(container) {
  container.querySelectorAll("h3").forEach((h3) => {
    if (!/three ways to enter/i.test(h3.textContent)) {
      return;
    }
    const ul = h3.nextElementSibling;
    if (ul?.tagName === "UL") {
      ul.classList.add("user-guide-entry-cards");
    }
  });
}

function styleTables(container) {
  container.querySelectorAll(".markdown-table table").forEach((table, index) => {
    table.classList.add("user-guide-table");
    if (index !== 0) {
      return;
    }
    table.querySelectorAll("tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 2) {
        return;
      }
      const cell = cells[1];
      const value = cell.textContent.trim();
      if (!value || cell.querySelector(".user-guide-badge")) {
        return;
      }
      const badge = document.createElement("span");
      badge.className = "user-guide-badge";
      badge.textContent = value;
      cell.textContent = "";
      cell.appendChild(badge);
    });
  });
}

function addSectionIds(container) {
  const sections = [];
  container.querySelectorAll("h2").forEach((h2, index) => {
    if (!h2.id) {
      const id = slugify(h2.textContent) || `section-${index + 1}`;
      h2.id = id;
    }
    sections.push({ id: h2.id, label: h2.textContent.replace(/^\d+\.\s*/, "").trim() });
  });
  return sections;
}

function markIntro(container) {
  const firstMarkdown = container.querySelector(".user-guide-block-markdown");
  if (firstMarkdown) {
    firstMarkdown.classList.add("user-guide-intro");
  }
}

/** Readable screenshot width; overrides narrow IMAGE_ALIGNED width from CMS. */
function styleScreenshots(container) {
  container.querySelectorAll('[data-testid="image-aligned"]').forEach((figure) => {
    figure.classList.add("user-guide-figure");
    figure.style.width = "65%";
    figure.style.float = "none";
    const caption = figure.querySelector('[data-testid="image-aligned-caption"]');
    if (caption) {
      caption.classList.add("user-guide-figure-caption");
    }
  });
}

/**
 * @param {HTMLElement} container Root content element
 * @returns {{ sections: Array<{id: string, label: string}> }}
 */
export function enhanceUserGuideContent(container) {
  if (!container) {
    return { sections: [] };
  }
  markIntro(container);
  const sections = addSectionIds(container);
  styleEntryCards(container);
  styleTables(container);
  styleScreenshots(container);
  container.querySelectorAll("h3").forEach(wrapCallout);
  return { sections };
}
