"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { API_URL } from "../lib/constants";

// Sparkles icon for AI
function Sparkles({ className }) {
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
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

Sparkles.propTypes = { className: PropTypes.string };

// Loading spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-teal-600">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent"></div>
      <span className="text-sm">Thinking...</span>
    </div>
  );
}

export default function BedrockAgentQuery({ apiBaseUrl = null }) {
  // Use API_URL from constants if apiBaseUrl not provided
  const baseUrl = apiBaseUrl || API_URL || "";
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const exampleQueries = [
    "How many files are in analysis set PKBDS1349YHGQ?",
    "What is the latest version of the scRNA map?",
    "Show me all analysis sets with more than 100 donors",
    "What file formats are available in PanKbase?",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError("");
    const userQuery = query.trim();
    setQuery("");

    try {
      // Call the Bedrock agent API endpoint
      const response = await fetch(`${baseUrl}/bedrock-agent/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const assistantResponse = data.response || "I couldn't generate a response. Please try again.";
      setResponse(assistantResponse);
    } catch (err) {
      const errorMessage = err.message || "Failed to get response. Please try again.";
      setError(errorMessage);
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleExampleClick(exampleQuery) {
    setQuery(exampleQuery);
  }


  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 rounded-2xl shadow-xl border border-teal-200 p-8 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Ask PanKbase AI</h3>
          <p className="text-sm text-slate-600">
            Get instant answers about PanKbase data using natural language
          </p>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="mb-6 bg-white rounded-lg p-4 border border-slate-200">
          <div className="text-sm text-slate-900 whitespace-pre-wrap">{response}</div>
        </div>
      )}
      
      {isLoading && (
        <div className="mb-6 bg-white rounded-lg p-4 border border-slate-200">
          <LoadingSpinner />
        </div>
      )}

      {/* Query Input Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about PanKbase data..."
            className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Ask</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ask</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Example Queries */}
      {!response && !isLoading && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg hover:border-teal-600 hover:bg-teal-50 text-slate-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Response Button */}
      {response && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setResponse("");
              setError("");
            }}
            className="text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

BedrockAgentQuery.propTypes = {
  apiBaseUrl: PropTypes.string,
};
