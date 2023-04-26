import React, { useEffect, useState } from 'react'
import { Editor } from '@/components/editor/editor'
import { documentEditPath } from '@/components/global/WingsLink'
import TopNavi from '../../../components/global/TopNavi'
import { useRouter } from 'next/router'
import { SpaceId, DocumentId, WingsDocument } from '@/lib/types/elasticsearch'
import { getDocumentApi } from '@/lib/api/document'
import DocumentTree from '@/components/document/DocumentTree'
import Button from '@mui/material/Button'
import { CircularProgress, Container, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { addVisitedDocumentHistory } from '@/lib/localStorage/history'

const ViewDocument = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const documentId = router.query.documentId as DocumentId
  const [wingsDocument, setWingsDocument] = useState<WingsDocument | undefined>()

  useEffect(() => {
    if (!documentId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getDocumentApi(spaceId, documentId)
      .then((res) => {
        if (!res) return
        setWingsDocument(res)
        addVisitedDocumentHistory({ spaceId: spaceId, documentId: documentId, title: res.title })
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId, documentId])

  if (loading) return <CircularProgress />

  if (!wingsDocument) {
    return (
      <>
        <TopNavi spaceId={spaceId} />
        <Typography variant="body1">Document not found: {documentId}</Typography>
      </>
    )
  }

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={4} my="1rem">
            <DocumentTree spaceId={spaceId} parentId={wingsDocument.parent_id} documentId={wingsDocument.id} />
          </Grid>
          <Grid item xs={8}>
            <Grid item xs={12} my="1rem">
              <Typography variant="h3">{wingsDocument.title || ''}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Editor content={wingsDocument.content} disabled={true} />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" py="1rem">
              <Button variant="contained" href={documentEditPath(spaceId, wingsDocument.id)}>
                Edit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ViewDocument
