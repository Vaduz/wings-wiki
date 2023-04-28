import { DocumentId, SpaceId } from '@/lib/types/elasticsearch'

export const documentBase = '/doc'

export const newSpacePath = `${documentBase}/createSpace`

export const spaceBase = (spaceId: SpaceId) => {
  return `${documentBase}/${spaceId}`
}

export const searchPath = (spaceId: SpaceId) => {
  return `${spaceBase(spaceId)}/search`
}

export const newDocumentPath = (spaceId: SpaceId, parentId?: DocumentId) => {
  parentId ??= '-1'
  return `${spaceBase(spaceId)}/createDocument?parentId=${parentId}`
}

export const documentPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${spaceBase(spaceId)}/${documentId}`
}

export const documentEditPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${documentPath(spaceId, documentId)}/edit`
}
