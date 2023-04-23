import React, { NextPage } from 'next'
import TopNavi from '@/components/global/TopNavi'
import { Container, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'

const Home: NextPage = () => {
  return (
    <>
      <TopNavi spaceId={undefined} />
      <Container>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h2">Home</Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
