"use client";

import { useState } from "react";

import PropTypes from "prop-types";

import SiteSearchTrigger from "../components/site-search-trigger";

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

function Search({ className }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function FileText({ className }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function Newspaper({ className }) {
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
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function Plug({ className }) {
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
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v2a10 10 0 1 1-12 0V8" />
    </svg>
  );
}

function Package({ className }) {
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
      <path d="m21 16-8-7-8 7" />
      <path d="M21 16v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
      <path d="M3 16l8-7 8 7" />
      <path d="M12 9v13" />
    </svg>
  );
}

function Settings({ className }) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

Users.propTypes = { className: PropTypes.string };

Flask.propTypes = { className: PropTypes.string };

Microscope.propTypes = { className: PropTypes.string };

Database.propTypes = { className: PropTypes.string };

GitBranch.propTypes = { className: PropTypes.string };

ChartBar.propTypes = { className: PropTypes.string };

Code.propTypes = { className: PropTypes.string };

BookOpen.propTypes = { className: PropTypes.string };

Search.propTypes = { className: PropTypes.string };

FileText.propTypes = { className: PropTypes.string };

Newspaper.propTypes = { className: PropTypes.string };

Plug.propTypes = { className: PropTypes.string };

Package.propTypes = { className: PropTypes.string };

Settings.propTypes = { className: PropTypes.string };

// Featured Datasets Carousel Component
function FeaturedDatasetsCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 320;
  const gap = 24;
  const itemWidthWithGap = itemWidth + gap;

  function scrollLeft() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function scrollRight() {
    setCurrentIndex((prev) => {
      const maxIndex = items.length - 1;
      return Math.min(maxIndex, prev + 1);
    });
  }

  function handleDownload(item) {
    if (item.s3Url) {
      window.location.href = item.s3Url;
    }
  }

  function handleBrowse(item) {
    if (item.browseUrl) {
      window.open(item.browseUrl, "_blank", "noopener,noreferrer");
    }
  }

  const maxScrollIndex = items.length - 1;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg px-20 py-12 border border-slate-100">
      <button
        onClick={scrollLeft}
        disabled={currentIndex === 0}
        className={`absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-teal-600 cursor-pointer text-xl text-teal-600 flex items-center justify-center transition-all z-10 hover:bg-teal-50 hover:shadow-xl font-bold ${
          currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
        }`}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * itemWidthWithGap}px)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="min-w-80 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600 rounded-xl p-7 text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-teal-400/30 flex flex-col"
            >
              <div className="text-xl font-bold mb-3 text-white">{item.title}</div>
              <div className="text-sm opacity-95 leading-relaxed mb-4">{item.description}</div>
              <div className="text-xs opacity-75 pt-4 border-t border-white/20 mb-4">{item.meta}</div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleDownload(item)}
                  className="flex-1 px-4 py-2 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Download
                </button>
                <button
                  onClick={() => handleBrowse(item)}
                  className="flex-1 px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-all duration-200 shadow-md hover:shadow-lg border border-teal-600"
                >
                  Browse
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollRight}
        disabled={currentIndex >= maxScrollIndex}
        className={`absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-teal-600 cursor-pointer text-xl text-teal-600 flex items-center justify-center transition-all z-10 hover:bg-teal-50 hover:shadow-xl font-bold ${
          currentIndex >= maxScrollIndex ? "opacity-40 cursor-not-allowed" : ""
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
      browseUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

// Resource Card Component for Tools & Resources
function ResourceCard({ icon, title, description, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-teal-600 hover:border-teal-700 bg-gradient-to-br from-white to-slate-50"
    >
      {typeof icon === "string" ? (
        <div className="text-4xl mb-5">{icon}</div>
      ) : (
        <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-2xl mb-5 shadow-lg group-hover:shadow-xl transition-shadow">
          {icon}
        </div>
      )}
      <div className="text-lg font-bold text-slate-900 mb-3">{title}</div>
      <div className="text-sm text-slate-600 leading-relaxed">{description}</div>
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
      className="group block bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-teal-600 hover:border-teal-700 bg-gradient-to-br from-white to-slate-50"
    >
      {typeof icon === "string" ? (
        <div className="text-4xl mb-5">{icon}</div>
      ) : (
        <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-2xl mb-5 shadow-lg group-hover:shadow-xl transition-shadow">
          {icon}
        </div>
      )}
      <div className="text-lg font-bold text-slate-900 mb-3">
        {title}
        {count && <span className="ml-2 text-base font-semibold text-slate-500">({count})</span>}
      </div>
      <div className="text-sm text-slate-600 leading-relaxed">{description}</div>
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
    title: "Pancreatic islet scRNA map",
    description: "Single cell RNA-seq from human pancreatic islets",
    meta: "Updated: Oct 2025 | 246,856 cells & 191 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-scrna-umap-v3.3.tar.gz",
    filename: "pankbase-scrna-umap-v3.3.tar.gz",
    browseUrl: "https://data.pankbase.org/analysis-sets/PKBDS7658QIGY/",
  },
  {
    title: "snATAC Marker Peaks",
    description: "Cell type marker peaks from single-nucleus ATAC-seq analysis",
    meta: "Updated: Oct 2025 | 97,659 cells & 41 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-peak-counts-snATAC-seq-umap1.0.tar.gz",
    filename: "pankbase-peak-counts-snATAC-seq-umap1.0.tar.gz",
    browseUrl: "https://data.pankbase.org/search/?type=AnalysisSet&query=Peak+counts&file_set_type=principal+analysis",
  },
  {
    title: "Pancreatic islet snATAC map",
    description: "Single nuclear ATAC-seq from human pancreatic islets",
    meta: "Updated: Oct 2025 | 97,659 cells & 41 donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-snatac-umap-v1.0.tar.gz",
    filename: "pankbase-snatac-umap-v1.0.tar.gz",
    browseUrl: "https://data.pankbase.org/analysis-sets/PKBDS0470WCHR/",
  },
  {
    title: "Donor meta-data",
    description: "Comprehensive donor metadata including demographics and clinical information",
    meta: "Updated: Oct 2025 | 3.7K donors",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-donors.tar.gz",
    filename: "pankbase-donors.tar.gz",
    browseUrl: "https://data.pankbase.org/analysis-sets/PKBDS5236MJJT/",
  },
  {
    title: "Islet biosample meta-data",
    description: "Pancreatic biosample collection with detailed experimental protocols",
    meta: "Updated: Oct 2025 | 3.6K samples",
    s3Url: "https://pankbase-data-v1.s3.amazonaws.com/download/pankbase-biosamples.tar.gz",
    filename: "pankbase-biosamples.tar.gz",
    browseUrl: "https://data.pankbase.org/analysis-sets/PKBDS1057RJYW/",
  },
];

// Data Access buttons data
const dataAccessButtons = [
  {
    icon: <Plug className="w-6 h-6" />,
    title: "API access",
    description: "Programmatic access to the PanKbase data library through RESTful API endpoints",
    url: "https://pankbase.github.io/pankbase-client-openapi-spec",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Scripts",
    description: "Example scripts for accessing the PanKbase data library",
    url: "https://github.com/PanKbase/PanKbase-data-library-scripts",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Browse",
    description: "Browse the PanKbase data library",
    url: "/browse",
  },
];

// Resources buttons data
const resourcesButtons = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Data standards",
    description: "Standards used for meta-data and data processing in the PanKbase data library",
    url: "https://data.pankbase.org/standards/",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "User guide",
    description: "Comprehensive guide for using the PanKbase Data Library and navigating available resources",
    url: "https://data.pankbase.org/help/general-help/user-guide",
  },
  {
    icon: <Newspaper className="w-6 h-6" />,
    title: "News",
    description: "Updates to PanKbase data library",
    url: "https://data.pankbase.org/help/news/",
  },
];

export default function Home() {
  return (
    <div className="@container/home min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Featured Datasets Carousel Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 text-balance">Featured Datasets</h2>
            <p className="text-lg text-slate-600">Featured datasets and resources in the Pankbase data library</p>
            <div className="h-1 w-20 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full mt-4" />
          </div>
          <FeaturedDatasetsCarousel items={carouselItems} />
        </section>

        {/* Data Access Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 text-balance">Data Access</h2>
            <p className="text-lg text-slate-600">Multiple ways to access and interact with the Pankbase data library</p>
            <div className="h-1 w-20 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full mt-4" />
          </div>
          <div className="mb-8">
            <SiteSearchTrigger />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataAccessButtons.map((button, index) => (
              <ResourceCard key={index} {...button} />
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 text-balance">Resources</h2>
            <p className="text-lg text-slate-600">Documentation and updates to the Pankbase data library</p>
            <div className="h-1 w-20 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesButtons.map((button, index) => (
              <ResourceCard key={index} {...button} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

Home.propTypes = {};
