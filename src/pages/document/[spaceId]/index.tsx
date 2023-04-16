import { useEffect, useState } from 'react'
import TopNavi from '../../../components/global/topNavi'
import DocumentCards from '../../../components/document/documentCards'
import { SpaceId, WingsDocument } from '@/lib/types/es'
import { getDocumentApi } from '@/lib/api/document'
import { useRouter } from 'next/router'
import Link from 'next/link'

const ListDocuments = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [documents, setDocuments] = useState<WingsDocument | undefined>()
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  useEffect(() => {
    getDocumentApi(spaceId, 'c79db1bc-e68e-4f5a-81e0-60df5aaaaef6')
      .then((res) => setDocuments(res))
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId])

  if (loading) {
    return (
      <div className="container-xl mt-3">
        <TopNavi spaceId={spaceId} />
        <div>Loading...</div>
      </div>
    )
  }

  console.log('document', documents)

  return (
    <div className="container-xl mt-3">
      <TopNavi spaceId={spaceId} />
      <div className="container-xl mt-3">
        <h1>Documents in {spaceId}</h1>
        <h2>
          <Link href={`/document/${spaceId}/c79db1bc-e68e-4f5a-81e0-60df5aaaaef6/`}>
            c79db1bc-e68e-4f5a-81e0-60df5aaaaef6
          </Link>
        </h2>
        <ul>
          <li>{documents?.title}</li>
          <li>{documents?.content}</li>
        </ul>
        <h2>
          <Link href={`/document/${spaceId}/b9b418d5-367b-4d91-96b0-c11f69fbeaa3`}>
            b9b418d5-367b-4d91-96b0-c11f69fbeaa3
          </Link>
        </h2>
        {/*<DocumentCards documents={documents ?? []} />*/}
      </div>
    </div>
  )
}

export default ListDocuments
