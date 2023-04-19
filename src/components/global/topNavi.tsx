import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { documentBase, newDocumentPath, newSpacePath, searchPath, spaceBase } from '@/components/global/link'
import Link from 'next/link'
import { SpaceId } from '@/lib/types/es'
import Image from 'next/image'

import getConfig from 'next/config'

const TopNavi = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  const { data, status } = useSession()

  return (
    <>
      <div>
        {status == 'authenticated' && data && data.user && (
          <>
            <h3>Hello {data.user.name}</h3>
            <h4>{data.user.email}</h4>
            <Image src={data.user.image ?? ''} alt={`user image`} width={32} height={32} />
          </>
        )}
        <ul>
          <li>
            <Link href={'/'}>Home</Link>
          </li>
          <li>
            <Link href={documentBase}>Spaces</Link>
          </li>
          <li>
            <Link href={newSpacePath}>New Space</Link>
          </li>
          {spaceId && (
            <>
              <li>
                <Link href={spaceBase(spaceId)}>Documents</Link>
              </li>
              <li>
                <Link href={searchPath(spaceId)}>Search</Link>
              </li>
              <li>
                <Link href={newDocumentPath(spaceId)}>New Document</Link>
              </li>
            </>
          )}
          <li>
            <Link onClick={() => signIn()} href={`#`}>
              Sign in
            </Link>
          </li>
          <li>
            <Link onClick={() => signOut()} href={`#`}>
              Sign out
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default TopNavi
