import TopNavi from '../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { SpaceId } from '@/lib/types/es'

const ListDocuments = () => {
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId

  return (
    <div className="container-xl mt-3">
      <TopNavi spaceId={spaceId} />
      <div className="container-xl mt-3">
        <h1>Search</h1>
      </div>
    </div>
  )
}

export default ListDocuments
