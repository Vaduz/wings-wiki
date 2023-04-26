import { DocumentId, SpaceId } from '@/lib/types/elasticsearch'

export interface HistoryBase {
  timestamp: Date
}

export interface VisitedDocumentHistory extends HistoryBase {
  spaceId: SpaceId
  documentId: DocumentId
  title: string
}

export interface EditedDocumentHistory extends HistoryBase {
  spaceId: SpaceId
  documentId: DocumentId
  title: string
  action: string
}
