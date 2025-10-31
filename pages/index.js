import React, { useState } from "react";
import PropTypes from "prop-types";

// SVG Icon Components
function Users({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Flask({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 3h6" />
      <path d="M10 9h4" />
      <path d="M20 21H4a2 2 0 0 1-2-2V9c0-.6.4-1 1-1h18c.6 0 1 .4 1 1v10a2 2 0 0 1-2 2Z" />
      <path d="M6.1 15h11.8" />
    </svg>
  );
}

function Microscope({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M8 6h4" />
      <path d="M10 6a2 2 0 1 0 0-4" />
    </svg>
  );
}

function Database({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function GitBranch({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function ChartBar({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

// New icon components for additional cards
function Code({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  );
}

function BookOpen({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// PropTypes for SVG components
Users.propTypes = { className: PropTypes.string };
Flask.propTypes = { className: PropTypes.string };
Microscope.propTypes = { className: PropTypes.string };
Database.propTypes = { className: PropTypes.string };
GitBranch.propTypes = { className: PropTypes.string };
ChartBar.propTypes = { className: PropTypes.string };
Code.propTypes = { className: PropTypes.string };
BookOpen.propTypes = { className: PropTypes.string };

// Featured Datasets Carousel Component
function FeaturedDatasetsCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 280;
  const gap = 20;
  const itemWidthWithGap = itemWidth + gap;

  function scrollLeft() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function scrollRight() {
    setCurrentIndex((prev) => {
      // Allow scrolling until the last item is visible
      // For 6 items, we can scroll from 0 to items.length - 1 (0 to 5)
      const maxIndex = items.length - 1;
      return Math.min(maxIndex, prev + 1);
    });
  }

  function handleItemClick(item) {
    if (item.s3Url) {
      window.location.href = item.s3Url;
    }
  }

  // Maximum scroll position: can scroll up to show the last item
  const maxScrollIndex = items.length - 1;

  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] px-[60px] py-[30px]">
      <button
        onClick={scrollLeft}
        disabled={currentIndex === 0}
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border-none cursor-pointer text-lg text-[#219197] flex items-center justify-center transition-all z-10 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
          currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div className="overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * itemWidthWithGap}px)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className="min-w-[280px] bg-gradient-to-br from-[#219197] to-[#1a7471] rounded-lg p-6 text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(33,145,151,0.3)]"
            >
              <div className="text-lg font-semibold mb-2.5">
                {item.title}
              </div>
              <div className="text-[13px] opacity-90 leading-[1.4]">
                {item.description}
              </div>
              <div className="text-[11px] opacity-70 mt-4 pt-4 border-t border-white/20">
                {item.meta}
          </div>
          </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollRight}
        disabled={currentIndex >= maxScrollIndex}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border-none cursor-pointer text-lg text-[#219197] flex items-center justify-center transition-all z-10 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
          currentIndex >= maxScrollIndex
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}

FeaturedDatasetsCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      meta: PropTypes.string.isRequired,
      s3Url: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Resource Card Component for Tools & Resources
function ResourceCard({ icon, title, description, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg p-[25px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-t-4 border-[#219197]"
    >
      {typeof icon === "string" ? (
        <div className="text-4xl mb-4">{icon}</div>
      ) : (
        <div className="w-12 h-12 bg-gradient-to-br from-[#219197] to-[#1a7471] rounded-lg flex items-center justify-center text-white text-2xl mb-4">
          {icon}
        </div>
      )}
      <div className="text-lg font-semibold text-gray-900 mb-2.5">
        {title}
      </div>
      <div className="text-[13px] text-gray-600 leading-relaxed">
        {description}
      </div>
    </a>
  );
}

ResourceCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

// Data Access Card Component
function DataAccessCard({ icon, title, count, description, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg p-[25px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-t-4 border-[#219197]"
    >
      {typeof icon === "string" ? (
        <div className="text-4xl mb-4">{icon}</div>
      ) : (
        <div className="w-12 h-12 bg-gradient-to-br from-[#219197] to-[#1a7471] rounded-lg flex items-center justify-center text-white text-2xl mb-4">
          {icon}
        </div>
      )}
      <div className="text-lg font-semibold text-gray-900 mb-2.5">
        {title}
        {count && (
          <span className="ml-2 text-base font-semibold text-gray-600">
            ({count})
          </span>
        )}
      </div>
      <div className="text-[13px] text-gray-600 leading-relaxed">
        {description}
      </div>
    </a>
  );
}

DataAccessCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

// Carousel items data
const carouselItems = [
  {
    title: "PanKbase scRNA UMAP",
    description: "Single-cell RNA-seq UMAP visualization with cell type annotations",
    meta: "Updated: Oct 2025 | 246,856 cells & 100 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-scrna-umap-v3.3.tar.gz",
    filename: "pankbase-scrna-umap-v3.3.tar.gz",
  },
  {
    title: "Pseudo-Bulk Counts (RUV-normalized, scRNA UMAP v3.3)",
    description: "RUV-normalized pseudo-bulk gene expression counts for differential analysis",
    meta: "Updated: Oct 2025 | 246,856 cells & 100 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-ruv-normalized-pseudo-bulk-counts-umap3.3.tar.gz",
    filename: "pankbase-ruv-normalized-pseudo-bulk-counts-umap3.3.tar.gz",
  },
  {
    title: "snATAC Marker Peaks",
    description: "Cell type marker peaks from single-nucleus ATAC-seq analysis",
    meta: "Updated: Oct 2025 | 97,659 cells & 41 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-peak-counts-snATAC-seq-umap1.0.tar.gz",
    filename: "pankbase-peak-counts-snATAC-seq-umap1.0.tar.gz",
  },
  {
    title: "snATAC UMAP",
    description: "Single-nucleus ATAC-seq UMAP visualization of chromatin accessibility",
    meta: "Updated: Oct 2025 | 97,659 cells & 41 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-snatac-umap-v1.0.tar.gz",
    filename: "pankbase-snatac-umap-v1.0.tar.gz",
  },
  {
    title: "PanKbase Donors",
    description: "Comprehensive donor metadata including demographics and clinical information",
    meta: "Updated: Oct 2025 | 3.7K donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-donors.tar.gz",
    filename: "pankbase-donors.tar.gz",
  },
  {
    title: "PanKbase Biosamples",
    description: "Pancreatic biosample collection with detailed experimental protocols",
    meta: "Updated: Oct 2025 | 3.6K samples",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-biosamples.tar.gz",
    filename: "pankbase-biosamples.tar.gz",
  },
];

// Tools & Resources data
const toolsResources = [
  {
    icon: "🔌",
    title: "API Access",
    description: "Programmatic access to PanKbase data through RESTful API endpoints for integration with your analysis pipelines",
    url: "https://pankbase.github.io/pankbase-client-openapi-spec",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Scripts",
    description: "Data exploration scripts and tools for PanKbase analysis workflows and custom data processing",
    url: "https://github.com/PanKbase/PanKbase-data-library-scripts",
  },
  {
    icon: "📋",
    title: "Data Standards",
    description: "Data schema and metadata profiles used in PanKbase for standardized pancreatic research data",
    url: "https://data.pankbase.org/standards/",
  },
  {
    icon: "📖",
    title: "User Guide",
    description: "Comprehensive guide for using the PanKbase Data Library and navigating available resources",
    url: "https://data.pankbase.org/help/general-help/user-guide",
  },
  {
    icon: "📰",
    title: "Data Library News",
    description: "Latest updates, announcements, and news about the PanKbase Data Library and new resources",
    url: "https://data.pankbase.org/help/news/",
  },
  {
    icon: "🔍",
    title: "Search",
    description: "Search and query the PanKbase Data Library using fuzzy search across all resources",
    url: "https://data.pankbase.org/search/",
  },
];

// Data Access cards data
const dataAccessCards = [
  {
    icon: "👥",
    title: "Donors",
    count: "3.7K",
    description: "Human donors of a pancreatic biosample",
    url: "https://data.pankbase.org/search/?type=HumanDonor",
  },
  {
    icon: "🧪",
    title: "Biosamples",
    count: "3.6K",
    description: "Pancreatic biosamples obtained from a donor",
    url: "https://data.pankbase.org/search/?type=Biosample",
  },
  {
    icon: "🔬",
    title: "Measurement Sets",
    count: "627",
    description: "Experimental assays performed on a biosample",
    url: "https://data.pankbase.org/search/?type=MeasurementSet",
  },
  {
    icon: "📊",
    title: "Intermediate Analysis Results",
    count: "378",
    description: "Standardized processing of data generated from an assay",
    url: "https://data.pankbase.org/search/?type=AnalysisSet&file_set_type=intermediate+analysis",
  },
  {
    icon: "📦",
    title: "Resource Analysis",
    count: "3",
    description: "Resource used to perform a principal analysis such as a donor x gene count matrix",
    url: "https://data.pankbase.org/search/?type=AnalysisSet&file_set_type=resource+analysis",
  },
  {
    icon: "📈",
    title: "Principal Analysis Results",
    count: "47",
    description: "End result of analyzing data such as differential expression or peak calls",
    url: "https://data.pankbase.org/search/?type=AnalysisSet&file_set_type=principal+analysis",
  },
  {
    icon: "⚙️",
    title: "Workflows",
    count: "5",
    description: "Analysis workflows used to processed data and create resources",
    url: "https://data.pankbase.org/search/?type=Workflow",
  },
];

export default function Home() {
  return (
    <div className="@container/home max-w-[1400px] mx-auto px-10 py-10 bg-[#f5f5f5] min-h-screen">
      {/* Featured Datasets Carousel Section */}
      <section className="mb-12">
        <h2 className="text-[26px] font-semibold mb-6 pb-2.5 border-b-2 border-[#219197]">
          Featured Datasets
        </h2>
        <FeaturedDatasetsCarousel items={carouselItems} />
      </section>

      {/* Tools & Resources Section */}
      <section className="mb-12">
        <h2 className="text-[26px] font-semibold mb-6 pb-2.5 border-b-2 border-[#219197]">
          Tools & Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
          {toolsResources.map((tool, index) => (
            <ResourceCard key={index} {...tool} />
          ))}
        </div>
      </section>

      {/* Data Access Section */}
      <section>
        <h2 className="text-[26px] font-semibold mb-6 pb-2.5 border-b-2 border-[#219197]">
          Data Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
          {dataAccessCards.map((card, index) => (
            <DataAccessCard key={index} {...card} />
          ))}
      </div>
      </section>
    </div>
  );
}
