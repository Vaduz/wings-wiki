import React from 'react'
import { signIn, signOut } from 'next-auth/react'
import { documentBase, newDocumentPath } from '@/components/global/link'
import Link from 'next/link'

const TopNavi = ({ query }: { query?: string }): JSX.Element => {
  // console.log(query)
  return (
    <>
      <div>
        <ul>
          <li>
            <Link href={documentBase}>Top</Link>
          </li>
          <li>
            <Link href={`/search`}>search</Link>
          </li>
          <li>
            <Link href={newDocumentPath}>new</Link>
          </li>
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
