import { apiGet, apiPost, apiPut } from '@/lib/api'
import { DocumentId, SearchDocumentHit, SpaceId, WingsDocument, WingsDocumentSearchResult } from '@/lib/types/es'
import {
  DocumentHomeResponse,
  DocumentListResponse,
  DocumentResponse,
  DocumentsAndSpace,
  DocumentTreeResponse,
} from '@/lib/types/apiResponse'
import { NewWingsDocumentRequest } from '@/lib/types/apiRequest'

const apiPath = '/document'

export async function getDocumentApi(spaceId: string, documentId: string): Promise<WingsDocument | undefined> {
  const { data, error } = await apiGet<DocumentResponse>(apiPath, { spaceId, documentId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function createDocumentApi(
  document: NewWingsDocumentRequest,
  spaceId: string
): Promise<WingsDocument | undefined> {
  const { data, error } = await apiPost<DocumentResponse>(`${apiPath}/create`, document, { spaceId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function updateDocumentApi(document: WingsDocument, spaceId: string): Promise<WingsDocument | undefined> {
  const { data, error } = await apiPut<DocumentResponse>(`${apiPath}/update`, document, { spaceId })
  if (error || !data) {
    return
  }
  return data.data
}

export async function getLatestDocumentsApi(spaceId: SpaceId): Promise<DocumentsAndSpace | undefined> {
  const { data, error } = await apiPost<DocumentHomeResponse>(`${apiPath}/latest`, undefined, { spaceId })
  if (error || !data || !data.data) {
    return
  }
  return data.data as DocumentsAndSpace
}

export async function searchDocumentsApi(spaceId: SpaceId, q: string): Promise<SearchDocumentHit[]> {
  const { data, error } = await apiPost<DocumentListResponse>(`${apiPath}/search`, undefined, {
    spaceId,
    q,
  })
  if (error || !data || !data.data) {
    return []
  }
  return data.data as SearchDocumentHit[]
}

export async function childDocumentsApi(spaceId: SpaceId, parentId: DocumentId): Promise<WingsDocumentSearchResult[]> {
  const { data, error } = await apiPost<DocumentTreeResponse>(`${apiPath}/children`, undefined, {
    spaceId,
    parentId,
  })
  if (error || !data || !data.data) {
    return []
  }
  return data.data as WingsDocumentSearchResult[]
}

export async function touchedDocumentsApi(
  spaceId: SpaceId,
  parentId: DocumentId
): Promise<WingsDocumentSearchResult[]> {
  const { data, error } = await apiPost<DocumentTreeResponse>(`${apiPath}/touched`, undefined, {
    spaceId,
    parentId,
  })
  if (error || !data || !data.data) {
    return []
  }
  return data.data as WingsDocumentSearchResult[]
}
