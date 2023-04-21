import React, { useEffect, useState } from 'react'
import { Editor } from '@/components/editor/editor'
import { documentEditPath } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { SpaceId, DocumentId, WingsDocument } from '@/lib/types/es'
import { getDocumentApi } from '@/lib/api/document'
import DocumentTree from '@/components/DocumentTree'
import Button from '@mui/material/Button'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'

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
      .then((res) => setWingsDocument(res))
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId, documentId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!wingsDocument) {
    return (
      <>
        <TopNavi spaceId={spaceId} />
        <div>Document not found: {documentId}</div>
      </>
    )
  }

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <DocumentTree spaceId={spaceId} wingsDocument={wingsDocument} />
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12} my={'1rem'}>
            <Typography variant="h3" gutterBottom>
              {wingsDocument.title || ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ boxShadow: 2 }}>
            <Editor content={wingsDocument.content} disabled={true} />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end" py="1rem">
            <Button variant="contained" href={documentEditPath(spaceId, wingsDocument.id)}>
              Edit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ViewDocument