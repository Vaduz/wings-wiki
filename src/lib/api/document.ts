import { apiGet, apiPost, apiPut, ApiResponse } from '@/lib/api'
import { SearchDocumentHit, SpaceId, WingsDocument, Mention } from '@/lib/types/es'
import { DocumentsAndSpace } from '@/lib/types/wings'

const apiPath = '/document'

export async function getDocumentApi(spaceId: string, documentId: string): Promise<WingsDocument | undefined> {
  const { data, error } = await apiGet<ApiResponse<WingsDocument>>(apiPath, { spaceId, documentId })
  if (error || !data) {
    return
  }
  return data.data
}

export interface NewWingsDocumentRequest {
  title: string
  content: string
  parent_id?: string
  mentions: Mention[]
  tags: string[]
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
