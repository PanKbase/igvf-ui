// node_modules
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
// components
import MarkdownSection from "../markdown-section";
import PageComponent from "../page-component";
import { enhanceUserGuideContent } from "./enhance-user-guide-content";
import UserGuideHero from "./user-guide-hero";
import UserGuideToc from "./user-guide-toc";

const BLOCK_TYPE_MARKDOWN = "markdown";
const BLOCK_TYPE_COMPONENT = "component";

export default function UserGuideLayout({ blocks, page }) {
  const contentRef = useRef(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }
    const { sections: found } = enhanceUserGuideContent(contentRef.current);
    setSections(found);
  }, [blocks]);

  const updatedAt =
    page?.date_modified || page?.last_modified || page?.creation_timestamp;

  return (
    <div className="user-guide-page">
      <UserGuideHero title={page?.title || "User Guide"} updatedAt={updatedAt} />
      <div className="user-guide-shell">
        <UserGuideToc sections={sections} />
        <div
          ref={contentRef}
          className="user-guide-content"
          id="user-guide-content"
          data-testid="user-guide-content"
        >
          {blocks.map((block) => {
            if (block["@type"] === BLOCK_TYPE_MARKDOWN) {
              return (
                <div
                  key={block["@id"]}
                  className="user-guide-block user-guide-block-markdown"
                >
                  <MarkdownSection direction={block.direction}>
                    {block.body}
                  </MarkdownSection>
                </div>
              );
            }
            if (block["@type"] === BLOCK_TYPE_COMPONENT) {
              return (
                <div
                  key={block["@id"]}
                  className="user-guide-block user-guide-block-component"
                >
                  <PageComponent spec={block.body} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

UserGuideLayout.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.object.isRequired,
};
