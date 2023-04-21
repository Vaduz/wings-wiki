import { Editor } from '@/components/editor/editor'
import React, { useEffect, useState } from 'react'
import { documentPath } from '@/components/global/link'
import TopNavi from '../../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { getDocumentApi, updateDocumentApi } from '@/lib/api/document'
import { DocumentId, SpaceId, WingsDocument } from '@/lib/types/es'
import Button from '@mui/material/Button'
import { ButtonGroup } from '@mui/material'

const EditDocument = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [title, setTitle] = useState('')
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
      .then((res) => {
        setWingsDocument(res)
        if (res) {
          setTitle(res.title)
        }
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [documentId, spaceId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!wingsDocument) {
    return (
      <div className="container-xl mt-3">
        <TopNavi />
        <div>Document not found: {documentId}</div>
      </div>
    )
  }

  // setTitle(wingsDocument.title)

  const updateButtonHandler = (title: string = '', content: string = '') => {
    // console.log(`Updating document: ${title}, ${content}`)
    wingsDocument.title = title
    wingsDocument.content = content
    updateDocumentApi(wingsDocument, spaceId).then(() => router.push(documentPath(spaceId, wingsDocument.id)))
  }

  return (
    <div className="container-xl mt-3">
      <TopNavi />
      <div className="container-xl mt-3">
        <div className="input-group">
          <input
            id="title"
            type="text"
            className="form-control form-control-lg mb-3"
            placeholder="Title"
            aria-label="Title"
            onChange={(e) => setTitle(e.currentTarget.value)}
            value={title}
          />
        </div>
        <Editor content={wingsDocument.content} disabled={false} />
        <div className="float-end">
          <ButtonGroup variant="text" aria-label="text button grou">
            <Button
              variant="contained"
              onClick={() =>
                updateButtonHandler(title, document.getElementsByClassName('ck-content').item(0)?.innerHTML)
              }
            >
              Publish
            </Button>
            <Button variant="text" href={documentPath(spaceId, documentId)}>
              Close
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}

export default EditDocument
