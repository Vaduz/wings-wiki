import React, { NextPage } from 'next'
import TopNavi from '@/components/global/TopNavi'
import { Container, Grid, Typography } from '@mui/material'
import GlobalUpdates from '@/components/document/GlobalUpdates'
import SmallSpaces from '@/components/space/SmallSpaces'
import { useEffect, useState } from 'react'
import { Space } from '@/lib/types/es'
import { getSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'

const Home: NextPage = () => {
  const [spaces, setSpaces] = useState<Space[]>()
  useEffect(() => {
    getSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'GlobalUpdates', error: e }))
  }, [])

  if (!spaces) return <div>Loading</div>

  return (
    <>
      <TopNavi />
      <Container>
        <Grid container columnSpacing={2}>
          <Grid item xs={3} my="1rem">
            <Grid container>
              <Grid item xs={12} sx={{ boxShadow: 2 }} my="1rem">
                <div>Profile module</div>
              </Grid>
              <Grid item xs={12} sx={{ boxShadow: 2 }}>
                <SmallSpaces spaces={spaces} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container>
              <Grid item xs={12} my="1rem">
                <Typography variant="h2">Home</Typography>
              </Grid>
              <Grid item xs={12} sx={{ boxShadow: 2 }}>
                <div>Touched module</div>
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
