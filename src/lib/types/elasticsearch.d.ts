export type UserId = string
export type SpaceId = string
export type DocumentId = string

interface Timestamps {
  created_at: Date
  updated_at: Date
}

export interface User extends NewUser, Timestamps {
  id: UserId
}

export interface NewUser {
  oauth_provider: OauthProvider
  oauth_id: string
  email: string
  name: string
  avatar_url: string
}

export interface Space extends NewSpace, Timestamps {
  id: SpaceId
}

export interface NewSpace {
  name: string
  description: string
  owner_id: UserId
  members: UserId[]
  visibility: number
}

export interface Mention {
  user_id: UserId
}

export interface WingsDocumentId {
  id: DocumentId
}

export interface WingsDocument extends WingsDocumentId, NewWingsDocument, Timestamps {}

export interface EsWingsDocument extends NewWingsDocument, Timestamps {}

// WingsDocument without content
export interface WingsDocumentSearchResult extends WingsDocumentId, WingsDocumentMeta, Timestamps {}

export interface NewWingsDocument extends WingsDocumentMeta, WingsDocumentContent {}

export interface WingsDocumentMeta {
  title: string
  author_id: UserId
  parent_id: DocumentId
  mentions?: Mention[]
  tags?: string[]
  child_count?: number
}

export interface WingsDocumentContent {
  content: string
  content_plain: string
}

export interface HighlightContent {
  tags?: string[]
  title?: string[]
  content_plain?: string[]
}

export interface SearchDocumentHit {
  document: WingsDocumentSearchResult
  highlight: HighlightContent
}
