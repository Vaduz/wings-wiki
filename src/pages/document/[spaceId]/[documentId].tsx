import React, { useEffect, useState } from 'react'
import { Editor } from '@/components/editor/editor'
import { PrimaryButton, documentEditPath } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { SpaceId, DocumentId, WingsDocument } from '@/lib/types/es'
import { getDocumentApi } from '@/lib/api/document'

const ViewDocument = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const documentId = router.query.documentId as DocumentId
  const [wingsDocument, setWingsDocument] = useState<WingsDocument | undefined>()

  useEffect(() => {
    if (!documentId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getDocumentApi(spaceId, documentId)
      .then((res) => setWingsDocument(res))
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId, documentId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!wingsDocument) {
    return (
      <>
        <TopNavi spaceId={spaceId} />
        <div>Document not found: {documentId}</div>
      </>
    )
  }

  return (
    <div className="container-xl mt-3">
      <TopNavi spaceId={spaceId} />
      <div className="container-xl mt-3">
        <h1 className="mb-3">{wingsDocument.title || ''}</h1>
        <Editor content={wingsDocument.content} disabled={true} />
        <div className="float-end">
          <PrimaryButton href={documentEditPath(spaceId, wingsDocument.id)} documentId={wingsDocument.id}>
            <i className="bi bi-pencil" />
            &nbsp;Edit
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default ViewDocument
