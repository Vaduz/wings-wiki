import { useEffect, useState } from 'react'
import TopNavi from '../components/global/topNavi'
import DocumentCards from '../components/document/documentCards'
import { Document } from '@/lib/types/es'
import { getDocumentApi } from '@/lib/utils/document'

const ListDocuments = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [documents, setDocuments] = useState<Document | undefined>()
  useEffect(() => {
    getDocumentApi('e32385ad-4d6e-4c21-abbc-2f34e797caeb', 'c79db1bc-e68e-4f5a-81e0-60df5aaaaef6')
      .then((res) => setDocuments(res))
      .catch((err) => console.error(err))
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <>
        <TopNavi />
        <div>Loading...</div>
      </>
    )
  }

  console.log('document', documents)

  return (
    <div>
      <TopNavi />
      <div className="container-xl mt-3">
        <h1>hoge</h1>
        <div>{documents?.title}</div>
        <div>{documents?.content}</div>
        <div>asdf</div>
        {/*<DocumentCards documents={documents ?? []} />*/}
      </div>
    </div>
  )
}

export default ListDocuments
