import TopNavi from '@/components/global/TopNavi'
import { Space } from '@/lib/types/elasticsearch'
import React, { useEffect, useState } from 'react'
import { getSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { CircularProgress, Container, Grid } from '@mui/material'
import SmallSpaces from '@/components/space/SmallSpaces'

const ListSpaces = (): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>()
  useEffect(() => {
    getSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'document/index.tsx', error: e }))
  }, [])

  if (!spaces) return <CircularProgress />

  return (
    <>
      <TopNavi />
      <Container>
        <Grid container direction="column">
          <Grid item>
            <SmallSpaces spaces={spaces} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ListSpaces
