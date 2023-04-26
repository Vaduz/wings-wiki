import TopNavi from '@/components/global/TopNavi'
import { Container, Grid, Typography } from '@mui/material'
import SmallProfile from '@/components/profile/SmallProfile'
import React, { NextPage } from 'next'
import SmallSpaces from '@/components/space/SmallSpaces'
import { useEffect, useState } from 'react'
import { Space } from '@/lib/types/elasticsearch'
import { getSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { EditedDocumentHistory } from '@/lib/types/localStorage'
import { getEditedHistory } from '@/lib/localStorage/history'
import DocumentCard from '@/components/document/DocumentCard'

const Edited: NextPage = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  useEffect(() => {
    getSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'GlobalUpdates', error: e }))
  }, [])

  const [histories, setHistories] = useState<EditedDocumentHistory[]>([])
  useEffect(() => {
    setHistories(getEditedHistory())
  }, [])

  return (
    <>
      <TopNavi />
      <Container>
        <Grid container columnSpacing={2}>
          <Grid item xs={4} my={1}>
            <Grid container>
              <Grid item xs={12} mb={2}>
                <SmallProfile />
              </Grid>
              <Grid item xs={12}>
                <SmallSpaces spaces={spaces} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={12} my={1}>
                <Typography variant="h2">Edited Documents</Typography>
              </Grid>
              {histories.length == 0 && (
                <Grid item xs={12}>
                  <Typography>No history</Typography>
                </Grid>
              )}
              {histories.length > 0 &&
                Array.from(histories).map((history) => {
                  return (
                    <DocumentCard
                      key={`${history.spaceId}-${history.documentId}`}
                      spaceId={history.spaceId}
                      documentId={history.documentId}
                      title={history.title}
                      date={new Date(history.timestamp)}
                    />
                  )
                })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Edited
