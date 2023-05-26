import { Grid, Typography } from '@mui/material'
import { Layout } from '@/components/layout/Layout'
import { SmallSpaceCards } from '@/components/space/SpaceCard'

const ListSpaces = (): JSX.Element => {
  return (
    <Layout menuNames={['smallProfile']}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Space List</Typography>
        </Grid>
        <Grid item xs={12}>
          <SmallSpaceCards />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ListSpaces
