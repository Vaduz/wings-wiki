import React, { ReactNode } from 'react'
import { DocumentId, SpaceId } from '@/lib/types/es'

export const apiBase = '/api'

export const documentBase = '/doc'

export const newSpacePath = `${documentBase}/new`

export const spaceBase = (spaceId: SpaceId) => {
  return `${documentBase}/${spaceId}`
}

export const searchPath = (spaceId: SpaceId) => {
  return `${spaceBase(spaceId)}/search`
}

export const newDocumentPath = (spaceId: SpaceId) => {
  return `${spaceBase(spaceId)}/new`
}

export const documentPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${spaceBase(spaceId)}/${documentId}`
}

export const documentEditPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${documentPath(spaceId, documentId)}/edit`
}
