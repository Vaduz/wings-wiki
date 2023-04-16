import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { documentBase, newDocumentPath, searchPath, spaceBase } from '@/components/global/link'
import Link from 'next/link'
import { SpaceId } from '@/lib/types/es'
import Image from 'next/image'

import getConfig from 'next/config'

const TopNavi = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  const { publicRuntimeConfig } = getConfig()
  // console.log('My config value:', publicRuntimeConfig.myConfigValue)
  const { data: session, status } = useSession()

  return (
    <>
      <div>
        {status == 'authenticated' && session && session.user && (
          <>
            <h3>Hello {session.user.name}</h3>
            <h4>{session.user.email}</h4>
            <Image src={session.user.image ?? ''} alt={`user image`} width={32} height={32} />
          </>
        )}
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
                <Link href={spaceBase(spaceId)}>Documents</Link>
              </li>
              <li>
                <Link href={searchPath(spaceId)}>Search</Link>
              </li>
              <li>
                <Link href={newDocumentPath(spaceId)}>New</Link>
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
