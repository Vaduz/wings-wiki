import { Grid, ListItemIcon, Typography } from '@mui/material'
import React, { NextPage } from 'next'
import HandymanIcon from '@mui/icons-material/Handyman'
import { Layout } from '@/components/layout/Layout'

const Starred: NextPage = () => {
  return (
    <Layout menuNames={['smallProfile', 'smallSpaces']}>
      <Grid container>
        <Grid item xs={12} my={1}>
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
