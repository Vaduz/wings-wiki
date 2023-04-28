import { Grid, ListItemIcon, Typography } from '@mui/material'
import HandymanIcon from '@mui/icons-material/Handyman'
import { Layout } from '@/components/layout/Layout'

const Starred = (): JSX.Element => {
  return (
    <Layout menuNames={['smallProfile']}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">Starred Documents</Typography>
        </Grid>
        <ListItemIcon>
          <HandymanIcon sx={{ width: 128, height: 128 }} />
        </ListItemIcon>
      </Grid>
    </Layout>
  )
}

export default Starred
