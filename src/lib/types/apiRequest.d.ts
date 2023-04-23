import { Mention, UserId } from '@/lib/types/es'

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
}
