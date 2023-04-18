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
}

export interface Mention {
  user_id: UserId
}

export interface WingsDocumentId {
  id: DocumentId
}

export interface WingsDocument extends WingsDocumentId, SourceWingsDocument, Timestamps {}

export interface SourceWingsDocument extends WingsDocumentMeta, WingsDocumentContent {}

export interface WingsDocumentMeta {
  title: string
  author_id: UserId
  parent_id?: DocumentId
  mentions?: Mention[]
  tags?: string[]
}

export interface WingsDocumentContent {
  content: string
}

// WingsDocument without content
export interface WingsDocumentSearchResult extends WingsDocumentId, WingsDocumentMeta {}

export interface HighlightContent {
  content: string[]
}

export interface SearchDocumentHit {
  document: WingsDocumentSearchResult
  highlight?: HighlightContent
}
