import { apiGet, apiPost, apiPut, ApiResponse } from '@/lib/api'
import { NewWingsDocument, SpaceId, WingsDocument } from '@/lib/types/es'

const apiPath = '/document'

export async function getDocumentApi(spaceId: string, documentId: string): Promise<WingsDocument | undefined> {
  const { data, error } = await apiGet<ApiResponse<WingsDocument>>(apiPath, { spaceId, documentId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function createDocumentApi(
  document: NewWingsDocument,
  spaceId: string
): Promise<WingsDocument | undefined> {
  const { data, error } = await apiPost<ApiResponse<WingsDocument>>(apiPath, document, { spaceId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function updateDocumentApi(document: WingsDocument, spaceId: string): Promise<WingsDocument | undefined> {
  const { data, error } = await apiPut<ApiResponse<WingsDocument>>(apiPath, document, { spaceId })
  if (error || !data) {
    return
  }
  return data.data
}

const apiSearchPath = `${apiPath}/search`

export async function searchDocumentApi(spaceId: SpaceId): Promise<WingsDocument[]> {
  const { data, error } = await apiPost<ApiResponse<WingsDocument[]>>(apiSearchPath, undefined, { spaceId })
  if (error || !data || !data.data) {
    return []
  }
  return data.data
}
