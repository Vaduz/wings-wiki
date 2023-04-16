import React, { ReactNode } from 'react'
import { DocumentId, SpaceId } from '@/lib/types/es'

export const documentBase = '/document/'

export const newDocumentPath = `${documentBase}new`

export const documentPath = (documentId: string) => {
  return `${documentBase}${documentId}`
}

export const documentEditPath = (spaceId: SpaceId, documentId: DocumentId) => {
  return `${spaceId}/${documentPath(documentId)}/edit`
}

interface PrimaryButtonProps {
  children: ReactNode
  documentId: string
  href: string
}
export const PrimaryButton = (props: PrimaryButtonProps) => {
  return (
    <a className="btn btn-primary" href={props.href} key={props.documentId}>
      {props.children}
    </a>
  )
}

interface CloseButtonProps {
  children: ReactNode
  href: string
}
export const CloseButton = (props: CloseButtonProps) => {
  return (
    <a className="btn btn-link" href={props.href}>
      {props.children}
    </a>
  )
}
