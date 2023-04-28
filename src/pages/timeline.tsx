import { Layout } from '@/components/layout/Layout'
import { Grid, Typography } from '@mui/material'
import GlobalUpdates from '@/components/document/GlobalUpdates'

const Timeline = (): JSX.Element => {
  return (
    <Layout menuNames={['smallProfile']}>
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

export default Timeline
