"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon, BookOpenIcon, UserIcon, CalendarIcon } from "@heroicons/react/24/outline"

const RealTimeSearch = ({
                          onSearch,
                          placeholder = "Tìm kiếm sách, tác giả, ISBN...",
                          className = "",
                          searchResults = [],
                          loading = false,
                          onResultClick = null,
                          showAllOnEmpty = true, // New prop to control showing all results when empty
                        }) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          searchRef.current &&
          !searchRef.current.contains(event.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const debouncedSearch = useCallback(
      (value) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
          onSearch(value)
        }, 300)
      },
      [onSearch],
  )

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Only show dropdown and search when user has typed something or when showAllOnEmpty is true and input is focused
    if (value.length >= 2) {
      setIsDropdownOpen(true)
      setSelectedIndex(-1)
      debouncedSearch(value)
    } else if (value.length === 0 && showAllOnEmpty) {
      // Only search for empty when user clears the input, not on every keystroke
      setIsDropdownOpen(true)
      setSelectedIndex(-1)
      debouncedSearch(value)
    } else {
      setIsDropdownOpen(false)
      setSelectedIndex(-1)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || searchResults.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultClick(searchResults[selectedIndex])
        } else if (searchTerm.trim()) {
          router.push(`/books?search=${encodeURIComponent(searchTerm.trim())}`)
          setIsDropdownOpen(false)
        }
        break
      case "Escape":
        setIsDropdownOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultClick = (book) => {
    if (onResultClick) {
      onResultClick(book)
    } else {
      router.push(`/books/${book.bookId || book.id}`)
    }
    setIsDropdownOpen(false)
    setSearchTerm("")
    setSelectedIndex(-1)
  }

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchTerm.trim())}`)
      setIsDropdownOpen(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSelectedIndex(-1)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Only show all results and keep dropdown open if showAllOnEmpty is true
    if (showAllOnEmpty) {
      setIsDropdownOpen(true)
      onSearch("") // Trigger search for all results only when clearing
    } else {
      setIsDropdownOpen(false)
    }
  }

  const handleFocus = () => {
    if (showAllOnEmpty && searchTerm === "") {
      setIsDropdownOpen(true)
      // Only trigger search on focus, not continuously
      onSearch("")
    } else if (searchTerm.length >= 2 && searchResults.length > 0) {
      setIsDropdownOpen(true)
    }
  }

  return (
      <div className={`relative ${className}`} ref={searchRef}>
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-sage-400" />
          </div>
          <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              className="block w-full pl-12 pr-12 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
              placeholder={placeholder}
              aria-label="Search books"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              role="combobox"
          />

          {/* Loading indicator */}
          {loading && (
              <div className="absolute inset-y-0 right-12 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
              </div>
          )}

          {/* Clear button */}
          {searchTerm && (
              <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-sage-400 hover:text-sage-600 dark:hover:text-sage-300 transition-colors duration-200"
                  aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && (
            <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-sage-200 dark:border-sage-700 rounded-xl shadow-soft z-50 max-h-96 overflow-y-auto"
                role="listbox"
            >
              {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-600 mx-auto"></div>
                    <p className="text-sage-600 dark:text-sage-400 mt-2">Đang tìm kiếm...</p>
                  </div>
              ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((book, index) => (
                        <div
                            key={book.bookId || book.id}
                            onClick={() => handleResultClick(book)}
                            className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                                index === selectedIndex
                                    ? "bg-sage-100 dark:bg-sage-800"
                                    : "hover:bg-sage-50 dark:hover:bg-sage-900/50"
                            }`}
                            role="option"
                            aria-selected={index === selectedIndex}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-sage-100 dark:bg-sage-800 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpenIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sage-900 dark:text-sage-100 truncate">{book.title}</h4>
                                {book.isbn && (
                                    <span className="text-xs bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 px-2 py-1 rounded">
                            {book.isbn}
                          </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-sage-600 dark:text-sage-400">
                                {book.author && (
                                    <div className="flex items-center space-x-1">
                                      <UserIcon className="w-3 h-3" />
                                      <span className="truncate">{book.author}</span>
                                    </div>
                                )}
                                {(book.publicationYear || book.year) && (
                                    <div className="flex items-center space-x-1">
                                      <CalendarIcon className="w-3 h-3" />
                                      <span>{book.publicationYear || book.year}</span>
                                    </div>
                                )}
                                {book.category?.name && (
                                    <span className="bg-sage-100 dark:bg-sage-800 px-2 py-1 rounded text-xs">
                            {book.category.name}
                          </span>
                                )}
                              </div>
                              {book.bookCopies && (
                                  <div className="mt-1 text-xs text-sage-500 dark:text-sage-400">
                                    {book.bookCopies.filter((copy) => copy.status === "AVAILABLE").length} bản có sẵn
                                  </div>
                              )}
                            </div>
                          </div>
                        </div>
                    ))}

                    {/* View All Results - only show if there's a search term */}
                    {searchTerm.trim() && (
                        <div className="border-t border-sage-200 dark:border-sage-700">
                          <button
                              onClick={handleSearchClick}
                              className="w-full px-4 py-3 text-left text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/50 transition-colors duration-150"
                          >
                            <div className="flex items-center justify-between">
                              <span>Xem tất cả kết quả cho "{searchTerm}"</span>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <div className="p-4 text-center text-sage-600 dark:text-sage-400">
                    <BookOpenIcon className="w-8 h-8 mx-auto mb-2 text-sage-400" />
                    <p>{searchTerm ? "Không tìm thấy sách phù hợp" : "Không có sách nào"}</p>
                    <p className="text-sm">{searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Hãy thêm sách vào hệ thống"}</p>
                  </div>
              )}
            </div>
        )}
      </div>
  )
}

export default RealTimeSearch
