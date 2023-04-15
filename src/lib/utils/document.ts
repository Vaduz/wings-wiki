import { apiGet, apiPost, apiPut, ApiResponse } from '@/lib/api/api'
import { Document } from '@/lib/types/es'

const apiPath = '/document'

export async function getDocumentApi(spaceId: string, documentId: string): Promise<Document | undefined> {
  const { data, error } = await apiGet<ApiResponse<Document>>(apiPath, { spaceId, documentId })
  if (error || !data) {
    console.error('Error fetching document:', error)
    return
  }
  return data.data
}

export async function createDocumentApi(document: Document, spaceId: string): Promise<Document | undefined> {
  const { data, error } = await apiPost<ApiResponse<Document>>(apiPath, document, { spaceId })
  if (error || !data) {
    console.error('Error creating document:', error)
    return
  }
  return data.data
}

export async function updateDocumentApi(document: Document, spaceId: string): Promise<Document | undefined> {
  const { data, error } = await apiPut<ApiResponse<Document>>(apiPath, document, { spaceId })
  if (error || !data) {
    console.error('Error updating document:', error)
    return
  }
  return data.data
}
