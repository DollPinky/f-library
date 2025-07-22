import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'BORROWED':
      return 'bg-blue-100 text-blue-800'
    case 'RETURNED':
      return 'bg-green-100 text-green-800'
    case 'OVERDUE':
      return 'bg-red-100 text-red-800'
    case 'RENEWED':
      return 'bg-yellow-100 text-yellow-800'
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800'
    case 'MAINTENANCE':
      return 'bg-red-100 text-red-800'
    case 'RESERVED':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800'
    case 'LIBRARIAN':
      return 'bg-blue-100 text-blue-800'
    case 'MANAGER':
      return 'bg-purple-100 text-purple-800'
    case 'READER':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Pagination compatibility utilities
export function getPageNumber(response: any): number {
  return response.number ?? response.pageNumber ?? 0
}

export function getPageSize(response: any): number {
  return response.size ?? response.pageSize ?? 20
}

export function getTotalPages(response: any): number {
  return response.totalPages ?? 0
}

export function getTotalElements(response: any): number {
  return response.totalElements ?? 0
}

export function hasNextPage(response: any): boolean {
  return response.hasNext ?? false
}

export function hasPreviousPage(response: any): boolean {
  return response.hasPrevious ?? false
}

export function isFirstPage(response: any): boolean {
  return response.isFirst ?? false
}

export function isLastPage(response: any): boolean {
  return response.isLast ?? false
} 