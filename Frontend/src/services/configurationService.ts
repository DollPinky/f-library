import axiosClient from '@/services/axiosClient'
import type { StandardResponse } from '@/types'

export interface ConfigurationResponse {
  shelfLocations: string[]
  campus: Record<string, string[]>
}

// Get configuration (shelf locations, campus data, etc.)
export const getConfiguration = async (): Promise<
  StandardResponse<ConfigurationResponse>
> => {
  const res = await axiosClient.get('/configuration')
  return res.data
}

export const configurationService = {
  getConfiguration
}

export default configurationService
