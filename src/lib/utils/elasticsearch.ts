import { SpaceId } from '@/lib/types/es'

export function getDocumentIndex(spaceId: SpaceId): string {
  return `document_${spaceId}`
}
