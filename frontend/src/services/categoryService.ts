import axiosClient from '@/services/axiosClient'
import type { Category, StandardResponse } from '@/types'

// Get all categories (hierarchy)
export const getAllCategories = async (): Promise<
  StandardResponse<Category[]>
> => {
  const res = await axiosClient.get('/categories/all')
  return res.data
}

// Get category by ID
export const getCategoryById = async (
  categoryId: string
): Promise<StandardResponse<Category>> => {
  const res = await axiosClient.get(`/categories/${categoryId}`)
  return res.data
}

// Get category children
export const getCategoryChildren = async (
  categoryId: string
): Promise<StandardResponse<Category[]>> => {
  const res = await axiosClient.get(`/categories/${categoryId}/children`)
  return res.data
}

// Search categories with filters
export const searchCategories = async (params?: {
  name?: string
  parentCategoryId?: string
}): Promise<StandardResponse<Category[]>> => {
  const res = await axiosClient.get('/categories/search', { params })
  return res.data
}

// Create new category
export const createCategory = async (payload: {
  name: string
  description?: string
  color?: string
  parentCategoryId?: string
}): Promise<StandardResponse<Category>> => {
  const res = await axiosClient.post('/categories/create', payload)
  return res.data
}

// Update category
export const updateCategory = async (
  categoryId: string,
  payload: {
    name?: string
    description?: string
    color?: string
    parentCategoryId?: string
  }
): Promise<StandardResponse<Category>> => {
  const res = await axiosClient.put(`/categories/${categoryId}`, payload)
  return res.data
}

// Delete category
export const deleteCategory = async (
  categoryId: string
): Promise<StandardResponse<{ success: boolean; message: string }>> => {
  const res = await axiosClient.delete(`/categories/${categoryId}`)
  return res.data
}

export const categoryService = {
  getAllCategories,
  getCategoryById,
  getCategoryChildren,
  searchCategories,
  createCategory,
  updateCategory,
  deleteCategory
}

export default categoryService
