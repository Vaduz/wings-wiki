import React, { NextPage } from 'next'
import TopNavi from '@/components/global/TopNavi'
import { Container, Grid, Paper, Typography } from '@mui/material'
import GlobalUpdates from '@/components/document/GlobalUpdates'
import SmallSpaces from '@/components/space/SmallSpaces'
import { useEffect, useState } from 'react'
import { Space } from '@/lib/types/elasticsearch'
import { getSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import SmallProfile from '@/components/profile/SmallProfile'

const Home: NextPage = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  useEffect(() => {
    getSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'GlobalUpdates', error: e }))
  }, [])

  return (
    <>
      <TopNavi />
      <Container>
        <Grid container columnSpacing={2}>
          <Grid item xs={4} my={1}>
            <Grid container>
              <Grid item xs={12} mb={2}>
                <SmallProfile />
              </Grid>
              <Grid item xs={12}>
                <SmallSpaces spaces={spaces} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={12} my={1}>
                <Typography variant="h2">Timeline</Typography>
              </Grid>
              <Grid item xs={12}>
                <GlobalUpdates spaces={spaces} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
