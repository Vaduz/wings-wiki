import TopNavi from '@/components/global/topNavi'
import { useRouter } from 'next/router'
import { SpaceId } from '@/lib/types/es'
import Link from 'next/link'

const ListSpaces = (): JSX.Element => {
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  return (
    <div className="container-xl mt-3">
      <TopNavi spaceId={spaceId} />
      <h1>Spaces</h1>
      <ul>
        <li>
          <Link href={'/document/e32385ad-4d6e-4c21-abbc-2f34e797caeb/'}>e32385ad-4d6e-4c21-abbc-2f34e797caeb</Link>
        </li>
      </ul>
    </div>
  )
}

export default ListSpaces
