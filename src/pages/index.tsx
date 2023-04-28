import { Grid, Typography } from '@mui/material'
import GlobalUpdates from '@/components/document/GlobalUpdates'
import { Layout } from '@/components/layout/Layout'

const Home = (): JSX.Element => {
  return (
    <Layout menuNames={['smallProfile', 'smallSpaces']}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
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
