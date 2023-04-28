import { Mention, SpaceId, UserId } from '@/lib/types/elasticsearch'

export interface NewWingsDocumentRequest {
  title: string
  content: string
  parent_id?: string
  mentions: Mention[]
  tags: string[]
}

export interface CreateSpaceRequest {
  name: string
  description: string
  members: UserId[]
  visibility: number
  language: string
}

export interface UpdateSpaceRequest {
  id: SpaceId
  name: string
  description: string
  members: UserId[]
  visibility: number
}
