import TopNavi from '@/components/global/topNavi'
import { Space } from '@/lib/types/es'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getUserSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { spaceBase } from '@/components/global/link'
import { Container, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Search } from '@/pages/doc/[spaceId]/search'

const ListSpaces = (): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>()
  useEffect(() => {
    getUserSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'document/index.tsx', error: e }))
  }, [])

  if (!spaces) {
    return <div>Loading...</div>
  }

  return (
    <>
      <TopNavi />
      <Container>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h2">Spaces</Typography>
          </Grid>
          <Grid item>
            <ul>
              {spaces.map((space) => {
                return (
                  <li key={space.id}>
                    <Link href={spaceBase(space.id)}>{space.name}</Link>
                    <p>{space.description}</p>
                  </li>
                )
              })}
            </ul>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ListSpaces
