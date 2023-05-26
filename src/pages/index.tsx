import { Card, Grid, ListItemIcon, Typography } from '@mui/material'
import { Layout } from '@/components/layout/Layout'
import EditIcon from '@mui/icons-material/Edit'
import { SmallSpaceCards } from '@/components/space/SpaceCard'

const Home = (): JSX.Element => {
  return (
    <Layout menuNames={['smallProfile']}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Wings Wiki</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <ListItemIcon sx={{ minWidth: '2rem' }}>
              <EditIcon />
            </ListItemIcon>
            <Typography variant="h5">Select space to start!</Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <SmallSpaceCards />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Home
