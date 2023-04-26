import { EditedDocumentHistory, VisitedDocumentHistory } from '@/lib/types/localStorage'

const addHistory = (data: Record<string, any> = {}, keyName: string) => {
  const history = JSON.parse(localStorage.getItem(keyName) || '[]')
  history.push({
    timestamp: new Date().toISOString(),
    ...data,
  })
  localStorage.setItem(keyName, JSON.stringify(history))
}

const getRecentHistory = (historyKey: string, batch = 0) => {
  const history = JSON.parse(localStorage.getItem(historyKey) || '[]')
  // console.log('history', history)
  const start = batch * 20
  const end = start + 20
  return history.slice(-end, -start || undefined).reverse()
}

export const visitedDocumentKey = 'visitedDocuments'
export const addVisitedDocumentHistory = (data: Record<string, any> = {}): void => {
  addHistory(data, visitedDocumentKey)
}

export const getVisitedHistory = (batch = 0): VisitedDocumentHistory[] => {
  return getRecentHistory(visitedDocumentKey, batch)
}

export const editedDocumentKey = 'editedDocuments'
export const addEditedDocumentHistory = (data: Record<string, any> = {}): void => {
  addHistory(data, editedDocumentKey)
}

export const getEditedHistory = (batch = 0): EditedDocumentHistory[] => {
  return getRecentHistory(editedDocumentKey, batch)
}
