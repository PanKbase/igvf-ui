import { enhanceUserGuideContent } from "../enhance-user-guide-content";

describe("enhanceUserGuideContent", () => {
  it("adds section ids, intro class, callouts, and table badges", () => {
    document.body.innerHTML = `
      <div id="root">
        <div class="user-guide-block-markdown"><h2>1. Getting Started</h2></div>
        <div class="user-guide-block-markdown">
          <h3>1.1 What You Can Find</h3>
          <div class="markdown-table"><table><thead><tr><th>A</th><th>B</th></tr></thead>
          <tbody><tr><td>Donor</td><td>HumanDonor</td></tr></tbody></table></div>
        </div>
        <div class="user-guide-block-markdown">
          <h3>2.4 Tip: Excluding a Filter Value</h3>
          <p>Hold the checkbox.</p>
        </div>
      </div>
    `;
    const root = document.getElementById("root");
    const { sections } = enhanceUserGuideContent(root);

    expect(sections).toHaveLength(1);
    expect(document.querySelector(".user-guide-intro")).toBeTruthy();
    expect(document.querySelector(".user-guide-callout--tip")).toBeTruthy();
    expect(document.querySelector(".user-guide-badge")?.textContent).toBe(
      "HumanDonor"
    );
  });

  it("sizes screenshot figures to full content width", () => {
    document.body.innerHTML = `
      <div id="root">
        <picture data-testid="image-aligned" style="width: 33%; float: right">
          <img alt="Example screenshot" src="/pages/example.png" />
          <figcaption data-testid="image-aligned-caption">Figure 1.</figcaption>
        </picture>
      </div>
    `;
    enhanceUserGuideContent(document.getElementById("root"));
    const figure = document.querySelector('[data-testid="image-aligned"]');
    expect(figure.classList.contains("user-guide-figure")).toBe(true);
    expect(figure.style.width).toBe("100%");
    expect(figure.style.float).toBe("none");
    expect(
      document.querySelector(".user-guide-figure-caption")
    ).toBeTruthy();
  });
});
