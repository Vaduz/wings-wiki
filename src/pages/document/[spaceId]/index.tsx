import { useEffect, useState } from 'react'
import TopNavi from '../../../components/global/topNavi'
import { Space, SpaceId, WingsDocument } from '@/lib/types/es'
import { getLatestDocumentsApi } from '@/lib/api/document'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { documentPath } from '@/components/global/link'

const ListDocuments = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [space, setSpace] = useState<Space>()
  const [documents, setDocuments] = useState<WingsDocument[]>()
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId

  useEffect(() => {
    if (!spaceId) return
    getLatestDocumentsApi(spaceId)
      .then((res) => {
        if (!res) return
        setSpace(res.space)
        setDocuments(res.documents)
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId])

  if (loading || documents == undefined || !space) {
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
        <h1>{space.name}</h1>
        {documents.length == 0 && <div>No documents</div>}
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
