import { useState } from 'react'
import TopNavi from '../components/global/topNavi'
import DocumentCards from '../components/document/documentCards'
import { useRouter } from 'next/router'

const ListDocuments = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const { query } = router
  const searchQuery = query.q as string
  const [documents, setDocuments] = useState<Document[] | undefined>()
  // useEffect(() => {
  //   searchDocuments(searchQuery ?? '')
  //     .then((res) => setDocuments(res))
  //     .catch((err) => console.error(err))
  //   setLoading(false)
  // }, [searchQuery])

  if (loading) {
    return (
      <>
        <TopNavi query={searchQuery} />
        <div>Loading...</div>
      </>
    )
  }

  return (
    <>
      <TopNavi query={searchQuery} />
      <div className="container-xl mt-3">
        <h1>Search result for: {searchQuery}</h1>
        {/*<DocumentCards documents={documents ?? []} />*/}
      </div>
    </>
  )
}

export default ListDocuments
