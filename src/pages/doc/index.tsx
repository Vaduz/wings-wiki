import { Grid, Typography } from '@mui/material'
import SmallSpaces from '@/components/space/SmallSpaces'
import { Layout } from '@/components/layout/Layout'

const ListSpaces = (): JSX.Element => {
  return (
    <Layout menuNames={['smallProfile']}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">Space List</Typography>
        </Grid>
        <Grid item xs={12}>
          <SmallSpaces />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ListSpaces
