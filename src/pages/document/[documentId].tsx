import React, { useEffect, useState } from 'react'
import { Editor } from '@/components/editor/editor'
import { PrimaryButton, documentEditPath } from '@/components/global/link'
import TopNavi from '../../components/global/topNavi'
import { useRouter } from 'next/router'
import { Document } from '@/lib/types/es'
import { getDocumentApi } from '@/lib/utils/document'

const ViewDocument = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const { documentId } = router.query
  const [wingsDocument, setWingsDocument] = useState<Document | undefined>()

  useEffect(() => {
    if (!documentId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getDocumentApi('e32385ad-4d6e-4c21-abbc-2f34e797caeb', documentId as string)
      .then((res) => setWingsDocument(res))
      .catch((err) => console.error(err))
    setLoading(false)
  }, [documentId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!wingsDocument) {
    return (
      <>
        <TopNavi />
        <div>Document not found: {documentId}</div>
      </>
    )
  }

  return (
    <>
      <TopNavi />
      <div className="container-xl mt-3">
        <h1 className="mb-3">{wingsDocument.title || ''}</h1>
        <Editor content={wingsDocument.content} disabled={true} />
        <div className="float-end">
          <PrimaryButton href={documentEditPath(wingsDocument.id)} documentId={wingsDocument.id}>
            <i className="bi bi-pencil" />
            &nbsp;Edit
          </PrimaryButton>
        </div>
      </div>
    </>
  )
}

export default ViewDocument
