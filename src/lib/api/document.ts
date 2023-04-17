import { apiGet, apiPost, apiPut, ApiResponse } from '@/lib/api'
import { NewWingsDocument, WingsDocument } from '@/lib/types/es'

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
