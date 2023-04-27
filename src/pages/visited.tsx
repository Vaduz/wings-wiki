import { Grid, Typography } from '@mui/material'
import React, { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { getVisitedHistory } from '@/lib/localStorage/history'
import { VisitedDocumentHistory } from '@/lib/types/localStorage'
import DocumentCard from '@/components/document/DocumentCard'
import { Layout } from '@/components/layout/Layout'

const Visited: NextPage = () => {
  const [histories, setHistories] = useState<VisitedDocumentHistory[]>([])
  useEffect(() => {
    setHistories(getVisitedHistory())
  }, [])

  return (
    <Layout menuNames={['smallProfile', 'smallSpaces']}>
      <Grid container>
        <Grid item xs={12} my={1}>
          <Typography variant="h2">Visited History</Typography>
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
                key={`${history.spaceId}-${history.documentId}-${history.timestamp}`}
                spaceId={history.spaceId}
                documentId={history.documentId}
                title={history.title}
                date={new Date(history.timestamp)}
              />
            )
          })}
      </Grid>
    </Layout>
  )
}

export default Visited
