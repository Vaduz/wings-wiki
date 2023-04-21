import React, { useEffect, useState } from 'react'
import { Editor } from '@/components/editor/editor'
import { documentEditPath } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { SpaceId, DocumentId, WingsDocument } from '@/lib/types/es'
import { getDocumentApi } from '@/lib/api/document'
import DocumentTree from '@/components/DocumentTree'
import Button from '@mui/material/Button'

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
      <div>
        <DocumentTree spaceId={spaceId} wingsDocument={wingsDocument} />
      </div>
      <div className="container-xl mt-3">
        <h1 className="mb-3">{wingsDocument.title || ''}</h1>
        <Editor content={wingsDocument.content} disabled={true} />
        <div className="float-end">
          <Button variant="contained" href={documentEditPath(spaceId, wingsDocument.id)}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ViewDocument
