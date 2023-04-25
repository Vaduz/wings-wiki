import { Editor } from '@/components/editor/editor'
import React, { useEffect, useState } from 'react'
import { documentPath } from '@/components/global/WingsLink'
import TopNavi from '../../../../components/global/TopNavi'
import { useRouter } from 'next/router'
import { getDocumentApi, updateDocumentApi } from '@/lib/api/document'
import { DocumentId, SpaceId, WingsDocument } from '@/lib/types/elasticsearch'
import Button from '@mui/material/Button'
import { Container, ButtonGroup, Grid, TextField, CircularProgress, Typography } from '@mui/material'

const EditDocument = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [title, setTitle] = useState('')
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
        setWingsDocument(res)
        if (res) {
          setTitle(res.title)
        }
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [documentId, spaceId])

  if (loading) {
    return (
      <>
        <TopNavi />
        <CircularProgress />
      </>
    )
  }

  if (!wingsDocument) {
    return (
      <>
        <TopNavi />
        <Typography variant="body1">Document not found: {documentId}</Typography>
      </>
    )
  }

  const updateButtonHandler = (title: string = '', content: string = '') => {
    // console.log(`Updating document: ${title}, ${content}`)
    wingsDocument.title = title
    wingsDocument.content = content
    updateDocumentApi(wingsDocument, spaceId).then(() => router.push(documentPath(spaceId, wingsDocument.id)))
  }

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Container>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ boxShadow: 2 }}
              onChange={(e) => setTitle(e.currentTarget.value)}
              value={title}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Editor content={wingsDocument.content} disabled={false} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <ButtonGroup variant="text" aria-label="text button grou">
              <Button
                variant="contained"
                onClick={() =>
                  updateButtonHandler(title, document.getElementsByClassName('ck-content').item(0)?.innerHTML)
                }
              >
                Update
              </Button>
              <Button variant="text" href={documentPath(spaceId, documentId)}>
                Close
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default EditDocument
