import React from 'react'
import { DocumentId, SpaceId } from '@/lib/types/es'

export const documentBase = '/doc'

export const newSpacePath = `${documentBase}/new`

export const spaceBase = (spaceId: SpaceId) => {
  return `${documentBase}/${spaceId}`
}

export const searchPath = (spaceId: SpaceId) => {
  return `${spaceBase(spaceId)}/search`
}

export const newDocumentPath = (spaceId: SpaceId, parentId?: DocumentId) => {
  parentId ??= '-1'
  return `${spaceBase(spaceId)}/new?parentId=${parentId}`
}

export const documentPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${spaceBase(spaceId)}/${documentId}`
}

export const documentEditPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${documentPath(spaceId, documentId)}/edit`
}
