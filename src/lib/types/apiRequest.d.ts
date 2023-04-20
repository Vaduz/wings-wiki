import { Mention } from '@/lib/types/es'

export interface NewWingsDocumentRequest {
  title: string
  content: string
  parent_id?: string
  mentions: Mention[]
  tags: string[]
}
