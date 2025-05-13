// node_modules
// import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useState } from "react";
//import { useEffect } from "react";
// components
// import SearchModal from "./search-modal";
// lib
// import { UC } from "../lib/constants";
import { encodeUriElement } from "../lib/query-encoding";

export default function SiteSearchTrigger({ isExpanded }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/site-search?term=${encodeUriElement(searchTerm)}`);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`flex items-center ${isExpanded ? "w-full" : "w-auto"}`}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search the site"
        className="border rounded p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        className="ml-2 p-2 rounded text-white bg-[#219197] dark:bg-gray-700"
      >
        Search
      </button>
    </form>
  );
}

SiteSearchTrigger.propTypes = {
  // True if the navigation area is expanded
  isExpanded: PropTypes.bool,
};
