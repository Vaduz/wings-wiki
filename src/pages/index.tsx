import React, { NextPage } from 'next'
import TopNavi from '@/components/global/TopNavi'
import { Container, Grid, Typography } from '@mui/material'

const Home: NextPage = () => {
  return (
    <>
      <TopNavi />
      <Container>
        <Grid container columnSpacing={2}>
          <Grid item xs={3} my="1rem">
            <Grid container rowSpacing={2}>
              <Grid item xs={12} sx={{ boxShadow: 2 }} my="1rem">
                <div>Profile module</div>
              </Grid>
              <Grid item xs={12} sx={{ boxShadow: 2 }}>
                <div>Space module</div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container rowSpacing={2}>
              <Grid item xs={12} my="1rem">
                <Typography variant="h2">Home</Typography>
              </Grid>
              <Grid item xs={12} sx={{ boxShadow: 2 }}>
                <div>Touched module</div>
              </Grid>
              <Grid item xs={12} sx={{ boxShadow: 2 }}>
                <div>Global updates</div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
