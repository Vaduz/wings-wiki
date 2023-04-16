import React from 'react'
import { signIn, signOut } from 'next-auth/react'
import { documentBase, newDocumentPath } from '@/components/global/link'
import Link from 'next/link'
import { SpaceId } from '@/lib/types/es'

const TopNavi = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  // console.log(query)
  return (
    <>
      <div>
        <ul>
          <li>
            <Link href={'/'}>Home</Link>
          </li>
          <li>
            <Link href={documentBase}>Spaces</Link>
          </li>
          {spaceId && (
            <>
              <li>
                <Link href={`${documentBase}/${spaceId}`}>Documents</Link>
              </li>
              <li>
                <Link href={`${documentBase}/${spaceId}/search`}>Search</Link>
              </li>
              <li>
                <Link href={`${documentBase}/${spaceId}/new`}>new</Link>
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
