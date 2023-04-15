import React, { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { documentBase } from '@/components/global/link'

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(documentBase).then((r) => console.log('Redirecting to documents'))
  })
  return <></>
}

export default Home
