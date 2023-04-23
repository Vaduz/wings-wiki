import { signIn } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/router'
import TopNavi from '../components/global/TopNavi'
import { Container, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'

export default function Custom401() {
  const router = useRouter()
  const backTo = (router.query.backTo as string) ?? '/'
  return (
    <>
      <TopNavi />
      <Container>
        <Grid container direction="column">
          <Grid item xs={12} sx={{ pt: '1rem' }}>
            <Typography variant="h3" gutterBottom>
              401 - Unauthorized
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">You need to login to use this feature</Typography>
            <Button variant="contained" onClick={() => signIn('google', { callbackUrl: backTo })}>
              Sign in with Google
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
