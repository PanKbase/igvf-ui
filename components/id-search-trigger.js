// node_modules
import { useRouter } from "next/router";
// import PropTypes from "prop-types";
import { useState } from "react";
// components
// import SearchModal from "./search-modal";
// lib
// import { UC } from "../lib/constants";
import { encodeUriElement } from "../lib/query-encoding";

export default function IdSearchTrigger() {
  const [idTerm, setIdTerm] = useState("");
  const router = useRouter();

  function handleIdSearch(e) {
    e.preventDefault();
    if (idTerm) {
      router.push(`/id-search?id=${encodeUriElement(idTerm)}`);
    }
  }

  return (
    <form onSubmit={handleIdSearch} className="flex items-center">
      <input
        type="text"
        value={idTerm}
        onChange={(e) => setIdTerm(e.target.value)}
        placeholder="Enter identifier (e.g. accession, uuid)"
        className="border rounded p-2 w-full"
      />
      <button type="submit" className="ml-2 p-2 rounded bg-green-500 text-white">
        Search ID
      </button>
    </form>
  );
}

IdSearchTrigger.propTypes = {};
