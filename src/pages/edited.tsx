import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { EditedDocumentHistory } from '@/lib/types/localStorage'
import { getEditedHistory } from '@/lib/localStorage/history'
import DocumentCard from '@/components/document/DocumentCard'
import { Layout } from '@/components/layout/Layout'

const Edited = (): JSX.Element => {
  const [histories, setHistories] = useState<EditedDocumentHistory[]>([])
  useEffect(() => {
    setHistories(getEditedHistory())
  }, [])

  return (
    <Layout menuNames={['smallProfile']}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">Edited documents</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
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
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Edited
