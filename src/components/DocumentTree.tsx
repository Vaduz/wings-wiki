import { DocumentId, SpaceId, WingsDocument, WingsDocumentSearchResult } from '@/lib/types/es'
import { useEffect, useState } from 'react'
import { childDocumentsApi, getDocumentApi } from '@/lib/api/document'
import Link from 'next/link'
import { documentPath } from '@/components/global/link'

const DocumentTree = ({ spaceId, wingsDocument }: { spaceId: SpaceId; wingsDocument: WingsDocument }): JSX.Element => {
  return (
    <div>
      <h3>Document Tree</h3>
      <ul>
        <TraceParent spaceId={spaceId} documentId={wingsDocument.parent_id} />
        <li>
          Same Level:
          <ul>
            <DocumentTreeView spaceId={spaceId} documentId={wingsDocument.parent_id} />
          </ul>
        </li>
        <li>
          Child Level:
          <ul>
            <DocumentTreeView spaceId={spaceId} documentId={wingsDocument.id} />
          </ul>
        </li>
      </ul>
    </div>
  )
}

const TraceParent = ({ spaceId, documentId }: { spaceId: SpaceId; documentId: DocumentId }): JSX.Element => {
  const [parent, setParent] = useState<WingsDocument>()
  useEffect(() => {
    if (documentId == '-1') return
    getDocumentApi(spaceId, documentId)
      .then((res) => setParent(res))
      .catch((err) => console.error(err))
  }, [spaceId, documentId])

  if (documentId == '-1') return <div>root (-1)</div>

  if (!parent) return <div>Loading...</div>

  return (
    <>
      <li>
        <TraceParent spaceId={spaceId} documentId={parent.parent_id} />
      </li>
      <li>
        <Link href={documentPath(spaceId, parent.id)}>{parent.title}</Link> ({parent.id})
      </li>
    </>
  )
}

const DocumentTreeView = ({ spaceId, documentId }: { spaceId: SpaceId; documentId: DocumentId }): JSX.Element => {
  const [children, setChildren] = useState<WingsDocumentSearchResult[]>()
  useEffect(() => {
    childDocumentsApi(spaceId, documentId)
      .then((res) => setChildren(res))
      .catch((err) => console.error(err))
  }, [spaceId, documentId])

  if (!children) return <div>Loading...</div>

  return (
    <ul>
      {Array.from(children).map((child) => {
        return (
          <li key={child.id}>
            <Link href={documentPath(spaceId, child.id)}>{child.title}</Link> ({child.id})
          </li>
        )
      })}
      {children.length == 0 && <div>No children for {documentId}</div>}
    </ul>
  )
}

export default DocumentTree
