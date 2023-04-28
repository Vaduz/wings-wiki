import { Space } from '@/lib/types/elasticsearch'
import { apiGet, apiPost, apiPut } from '@/lib/api/index'
import { ApiResponse } from '@/lib/types/apiResponse'
import { CreateSpaceRequest, UpdateSpaceRequest } from '@/lib/types/apiRequest'

export async function getSpaceApi(spaceId: string): Promise<Space | undefined> {
  const { data, error } = await apiGet<ApiResponse<Space>>('/space', { spaceId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function createSpaceApi(space: CreateSpaceRequest): Promise<Space | undefined> {
  const { data, error } = await apiPost<ApiResponse<Space>>('/space/create', space, {})
  if (error || !data) {
    return
  }
  return data.data
}

export async function updateSpaceApi(space: UpdateSpaceRequest): Promise<Space | undefined> {
  const { data, error } = await apiPut<ApiResponse<Space>>('/space/update', space, { spaceId: space.id })
  if (error || !data) {
    return
  }
  return data.data
}

export async function getSpacesApi(): Promise<Space[]> {
  const { data, error } = await apiPost<ApiResponse<Space[]>>('/space/search', {})
  if (error || !data || !data.data) {
    return []
  }
  return data.data
}
