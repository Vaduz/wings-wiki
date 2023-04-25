import { SpaceId } from '@/lib/types/elasticsearch'

export function getDocumentIndex(spaceId: SpaceId): string {
  return `document_${spaceId}`
}
