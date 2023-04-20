import { apiGet, apiPost, apiPut } from '@/lib/api'
import { SearchDocumentHit, SpaceId, WingsDocument } from '@/lib/types/es'
import { ApiResponse, DocumentsAndSpace } from '@/lib/types/apiResponse'
import { NewWingsDocumentRequest } from '@/lib/types/apiRequest'

const apiPath = '/document'

export async function getDocumentApi(spaceId: string, documentId: string): Promise<WingsDocument | undefined> {
  const { data, error } = await apiGet<ApiResponse<WingsDocument>>(apiPath, { spaceId, documentId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function createDocumentApi(
  document: NewWingsDocumentRequest,
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

export async function documentsAndSpaceApi(spaceId: SpaceId): Promise<DocumentsAndSpace | undefined> {
  const { data, error } = await apiPost<ApiResponse<DocumentsAndSpace>>(`${apiPath}/latest`, undefined, { spaceId })
  if (error || !data || !data.data) {
    return
  }
  return data.data as DocumentsAndSpace
}

export async function searchDocumentsApi(spaceId: SpaceId, q: string): Promise<SearchDocumentHit[]> {
  const { data, error } = await apiPost<ApiResponse<SearchDocumentHit[]>>(`${apiPath}/search`, undefined, {
    spaceId,
    q,
  })
  if (error || !data || !data.data) {
    return []
  }
  return data.data as SearchDocumentHit[]
}
