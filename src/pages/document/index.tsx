import TopNavi from '@/components/global/topNavi'
import { useRouter } from 'next/router'
import { Space, SpaceId } from '@/lib/types/es'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { spaceBase } from '@/components/global/link'

const ListSpaces = (): JSX.Element => {
  const router = useRouter()
  const [spaces, setSpaces] = useState<Space[]>()
  useEffect(() => {
    getUserSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'document/index.tsx', error: e }))
  }, [])

  if (!spaces) {
    return <div>Loading...</div>
  }

  return (
    <div className="container-xl mt-3">
      <TopNavi />
      <h1>Spaces</h1>
      <ul>
        {spaces.map((space) => {
          return (
            <li key={space.id}>
              <Link href={spaceBase(space.id)}>{space.name}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ListSpaces
