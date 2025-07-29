"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useBooks } from "./useBooksApi"

const useDashboardData = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    totalReaders: 3247, // Static for now
    totalBorrowings: 45678, // Static for now
    totalLibraries: 8, // Static for now
  })

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  })

  // Refs to prevent unnecessary re-renders and API calls
  const hasInitialized = useRef(false)
  const lastStatsUpdate = useRef(0)
  const isRefreshing = useRef(false)

  // Get books data with stable references
  const { books, pagination, loading, error, loadBooks, refreshBooks } = useBooks()

  // Memoize recentBooks to prevent unnecessary recalculations
  const recentBooks = useMemo(() => {
    if (!books || books.length === 0) return []
    return books.slice(0, 5)
  }, [books])

  // Stable notification function that doesn't change
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ show: true, message, type })
  }, [])

  // Stable refresh function
  const refreshData = useCallback(async () => {
    if (isRefreshing.current) {
      console.log("useDashboardData: Refresh already in progress, skipping")
      return
    }

    isRefreshing.current = true
    console.log("useDashboardData: Starting refresh")

    try {
      await refreshBooks()
      showNotification("Dashboard data refreshed successfully", "success")
    } catch (err) {
      console.error("Error refreshing dashboard data:", err)
      showNotification("Failed to refresh dashboard data", "error")
    } finally {
      isRefreshing.current = false
    }
  }, [refreshBooks, showNotification])

  // Initial load - only once on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log("useDashboardData: Initial load triggered")
      hasInitialized.current = true
      loadBooks()
    }
  }, []) // Empty dependency array - only runs once

  // Update dashboard stats when books data changes (with throttling)
  useEffect(() => {
    if (!loading && books && hasInitialized.current) {
      const currentTotalBooks = pagination?.totalElements ?? books.length
      const now = Date.now()

      // Throttle updates to prevent excessive re-renders (minimum 1 second between updates)
      if (now - lastStatsUpdate.current > 1000 && dashboardStats.totalBooks !== currentTotalBooks) {
        console.log("useDashboardData: Updating stats", {
          oldTotal: dashboardStats.totalBooks,
          newTotal: currentTotalBooks,
        })

        setDashboardStats((prev) => ({
          ...prev,
          totalBooks: currentTotalBooks,
        }))

        lastStatsUpdate.current = now
      }
    }
  }, [books, loading, pagination?.totalElements]) // Removed dashboardStats from dependencies

  // Handle errors separately
  useEffect(() => {
    if (error) {
      console.log("useDashboardData: Error occurred", error)
      showNotification(error, "error")
    }
  }, [error, showNotification])

  return {
    dashboardStats,
    recentBooks,
    notification,
    showNotification,
    loading,
    error,
    refreshData,
    books, // For search functionality
    pagination,
  }
}

export default useDashboardData
