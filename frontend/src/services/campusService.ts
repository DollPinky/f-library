import axiosClient from '@/services/axiosClient'
import type { Campus, StandardResponse } from '@/types'

// Get all campuses
export const getAllCampuses = async (): Promise<StandardResponse<Campus[]>> => {
  const res = await axiosClient.get('/campuses/all')
  return res.data
}

// Get campus by ID
export const getCampusById = async (
  campusId: string
): Promise<StandardResponse<Campus>> => {
  const res = await axiosClient.get(`/campuses/${campusId}`)
  return res.data
}

export const campusService = {
  getAllCampuses,
  getCampusById
}

export default campusService
