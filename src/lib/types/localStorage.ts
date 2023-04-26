export interface HistoryBase {
  timestamp: Date
}

export interface VisitedDocumentHistory extends HistoryBase {
  url: string
  title: string
}

export interface EditedDocumentHistory extends HistoryBase {
  url: string
  title: string
}
