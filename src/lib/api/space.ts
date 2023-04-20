import { Space, UserId } from '@/lib/types/es'
import { apiGet, apiPost, apiPut } from '@/lib/api/index'
import { ApiResponse } from '@/lib/types/apiResponse'

const apiPath = '/space'

export async function getSpaceApi(spaceId: string): Promise<Space | undefined> {
  const { data, error } = await apiGet<ApiResponse<Space>>(apiPath, { spaceId })
  if (error || !data) {
    return
  }
  return data.data
}

export interface CreateSpaceRequest {
  name: string
  description: string
  members: UserId[]
}

export async function createSpaceApi(space: CreateSpaceRequest): Promise<Space | undefined> {
  const { data, error } = await apiPost<ApiResponse<Space>>(apiPath, space, {})
  if (error || !data) {
    return
  }
  return data.data
}

export async function updateSpaceApi(space: Space): Promise<Space | undefined> {
  const { data, error } = await apiPut<ApiResponse<Space>>(apiPath, space, {})
  if (error || !data) {
    return
  }
  return data.data
}

const apiSearchPath = `${apiPath}/search`

export async function getUserSpacesApi(): Promise<Space[]> {
  const { data, error } = await apiPost<ApiResponse<Space[]>>(apiSearchPath, {})
  if (error || !data || !data.data) {
    return []
  }
  return data.data
}
