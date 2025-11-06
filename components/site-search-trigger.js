"use client"

import { useState } from "react"

import PropTypes from "prop-types"

import { useRouter } from "next/router"
import { encodeUriElement } from "../lib/query-encoding"

function SiteSearchTrigger({ isExpanded = false }) {
  const [searchValue, setSearchValue] = useState("")
  const [isOpen, setIsOpen] = useState(isExpanded)
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/site-search?term=${encodeUriElement(searchValue)}`)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search datasets by name, description, or keywords..."
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-teal-200 bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all shadow-md"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:from-teal-700 hover:to-cyan-700"
          >
            Search
          </button>
        </div>
      </form>
      {isOpen && (
        <div className="mb-8 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Quick filters</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-all font-medium">
              scRNA-seq
            </button>
            <button className="px-4 py-2 bg-white border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-all font-medium">
              snATAC-seq
            </button>
            <button className="px-4 py-2 bg-white border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-all font-medium">
              Donor data
            </button>
            <button className="px-4 py-2 bg-white border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-all font-medium">
              Metadata
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

SiteSearchTrigger.propTypes = {
  isExpanded: PropTypes.bool,
}

export default SiteSearchTrigger
