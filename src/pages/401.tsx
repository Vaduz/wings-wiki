import { signIn } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/router'
import TopNavi from '../components/global/topNavi'

export default function Custom401() {
  const router = useRouter()
  const backTo = (router.query.backTo as string) ?? '/'
  return (
    <>
      <TopNavi />
      <div className="container-xl mt-3">
        <h1>401 - Unauthorized</h1>
        <p>You need to login to use this feature</p>
        <p>
          <a href="#" onClick={() => signIn('google', { callbackUrl: backTo })}>
            Sign in with Google
          </a>
        </p>
      </div>
    </>
  )
}
