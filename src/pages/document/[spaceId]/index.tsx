import { useEffect, useState } from 'react'
import TopNavi from '../../../components/global/topNavi'
import { SpaceId, WingsDocument } from '@/lib/types/es'
import { searchDocumentApi } from '@/lib/api/document'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { documentPath } from '@/components/global/link'

const ListDocuments = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [documents, setDocuments] = useState<WingsDocument[]>()
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  useEffect(() => {
    searchDocumentApi(spaceId)
      .then((res) => setDocuments(res))
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId])

  if (loading || !documents) {
    return (
      <div className="container-xl mt-3">
        <TopNavi spaceId={spaceId} />
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container-xl mt-3">
      <TopNavi spaceId={spaceId} />
      <div className="container-xl mt-3">
        <h1>Documents in {spaceId}</h1>
        {documents.map((document) => {
          return (
            <h3 key={document.id}>
              <Link href={documentPath(spaceId, document.id)}>{document.title}</Link>
            </h3>
          )
        })}
      </div>
    </div>
  )
}

export default ListDocuments
