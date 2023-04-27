import { SpaceId } from '@/lib/types/elasticsearch'
import { JSDOM } from 'jsdom'

export function getDocumentIndex(spaceId: SpaceId): string {
  return `document_${spaceId}`
}

export const removeHtmlTags = (html: string): string => {
  const dom = new JSDOM(html)
  return dom.window.document.body.textContent || ''
}
