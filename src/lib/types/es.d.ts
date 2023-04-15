export type UserId = string
export type SpaceId = string
export type DocumentId = string

export interface User {
  id: UserId
  email: string
  name: string
  avatar_url: string
  created_at: Date
  updated_at: Date
}

export interface Space {
  id: SpaceId
  name: string
  description: string
  owner_id: UserId
  members: UserId[]
  created_at: Date
  updated_at: Date
}

export interface Mention {
  user_id: UserId
}

export interface Document {
  id: DocumentId
  title: string
  content: string
  author_id: UserId
  created_at: Date
  updated_at: Date
  parent_id: DocumentId | null
  mentions: Mention[]
  tags: string[]
}
