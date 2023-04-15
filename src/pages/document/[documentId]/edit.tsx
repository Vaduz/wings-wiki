import { Editor } from '@/components/editor/editor'
import React, { useEffect, useState } from 'react'
import { CloseButton, documentBase, documentPath } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { getDocumentApi } from '@/lib/utils/document'
import { Document } from '@/lib/types/es'

const EditDocument = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [title, setTitle] = useState('')
  const router = useRouter()
  const { documentId } = router.query
  const [wingsDocument, setWingsDocument] = useState<Document | undefined>()

  useEffect(() => {
    if (!documentId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getDocumentApi('e32385ad-4d6e-4c21-abbc-2f34e797caeb', 'c79db1bc-e68e-4f5a-81e0-60df5aaaaef6')
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

  setTitle(wingsDocument.title)

  const updateButtonHandler = (title: string = '', content: string = '') => {
    console.log(`Updating document: ${title}, ${content}`)
    // updateDocument(document.key, title, content).then(() => router.push(documentPath(document.key)))
  }

  return (
    <>
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
            value={wingsDocument.title}
          />
        </div>
        <Editor content={wingsDocument.content} disabled={false} />
        <div className="float-end">
          <a
            className="btn btn-primary"
            onClick={() => updateButtonHandler(title, document.getElementsByClassName('ck-content').item(0)?.innerHTML)}
          >
            <i className="bi bi-globe" /> Publish
          </a>
          <CloseButton href={documentBase}>Close</CloseButton>
        </div>
      </div>
    </>
  )
}

export default EditDocument
