import React, { NextPage } from 'next'
import TopNavi from '@/components/global/topNavi'

const Home: NextPage = () => {
  return (
    <div className="container-xl mt-3">
      <TopNavi spaceId={undefined} />
      <h1>Home</h1>
    </div>
  )
}

export default Home
