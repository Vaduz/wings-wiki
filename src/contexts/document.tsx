import { DocumentId, SpaceId, WingsDocument } from '@/lib/types/elasticsearch'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getDocumentApi } from '@/lib/api/document'
import { addVisitedDocumentHistory } from '@/lib/localStorage/history'

interface DocumentContextValue {
  documentId: DocumentId
  setDocumentId: React.Dispatch<React.SetStateAction<DocumentId>>
  wingsDocument?: WingsDocument
  setWingsDocument: React.Dispatch<React.SetStateAction<WingsDocument | undefined>>
  loading: Boolean
}

const DocumentContext = createContext<DocumentContextValue | null>(null)

interface DocumentContextProviderProps {
  children: ReactNode
}

const DocumentContextProvider = ({ children }: DocumentContextProviderProps) => {
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const defaultDocumentId = router.query.documentId as DocumentId
  const [documentId, setDocumentId] = useState<DocumentId>(defaultDocumentId)
  const [wingsDocument, setWingsDocument] = useState<WingsDocument>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setDocumentId(router.query.documentId as DocumentId)
  }, [router.query.documentId])

  useEffect(() => {
    if (!documentId || documentId == '-1') {
      setLoading(false)
      return
    }
    setLoading(true)
    getDocumentApi(spaceId, documentId)
      .then((res) => {
        if (!res) return
        setWingsDocument(res)
        addVisitedDocumentHistory({ spaceId: spaceId, documentId: documentId, title: res.title })
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId, documentId])

  return (
    <DocumentContext.Provider value={{ documentId, setDocumentId, wingsDocument, setWingsDocument, loading }}>
      {children}
    </DocumentContext.Provider>
  )
}

const useDocumentContext = () => useContext(DocumentContext)

export { useDocumentContext, DocumentContextProvider }
