import React, { NextPage } from 'next'
import { Grid, Typography } from '@mui/material'
import GlobalUpdates from '@/components/document/GlobalUpdates'
import { Layout } from '@/components/layout/Layout'

const Home: NextPage = () => {
  return (
    <Layout menuNames={['smallProfile', 'smallSpaces']}>
      <Grid container>
        <Grid item xs={12} my={1}>
          <Typography variant="h2">Timeline</Typography>
        </Grid>
        <Grid item xs={12}>
          <GlobalUpdates />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Home
