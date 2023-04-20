import { SearchDocumentHit, Space, User, WingsDocument, WingsDocumentSearchResult } from '@/lib/types/es'

export type ApiResponse<T> = {
  data?: T
  error?: unknown
}
export type DocumentListResponse = ApiResponse<SearchDocumentHit[]>
export type UserResponse = ApiResponse<User>
export type DocumentHomeResponse = ApiResponse<DocumentsAndSpace>
export type DocumentResponse = ApiResponse<WingsDocument>
export type SpaceResponse = ApiResponse<Space>
export type SpaceListResponse = ApiResponse<Space[]>
export type DocumentTreeResponse = ApiResponse<WingsDocumentSearchResult[]>

export interface DocumentsAndSpace {
  documents: WingsDocument[]
  space: Space
}
