import { Editor } from '@/components/editor/editor'
import { documentEditPath } from '@/components/global/WingsLink'
import { useRouter } from 'next/router'
import { SpaceId, DocumentId } from '@/lib/types/elasticsearch'
import DocumentTree from '@/components/document/DocumentTree'
import Button from '@mui/material/Button'
import { CircularProgress, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Layout } from '@/components/layout/Layout'
import { DocumentContextProvider, useDocumentContext } from '@/contexts/document'

const ViewDocument = (): JSX.Element => {
  return (
    <DocumentContextProvider>
      <Layout menu={<DocumentTree />}>
        <TitleAndContent />
      </Layout>
    </DocumentContextProvider>
  )
}

const TitleAndContent = (): JSX.Element => {
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const documentId = router.query.documentId as DocumentId
  const context = useDocumentContext()
  if (!context) return <CircularProgress />
  if (context.loading) return <CircularProgress />
  if (!context.wingsDocument) return <Typography variant="body1">Document not found: {documentId}</Typography>
  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">{context.wingsDocument.title || ''}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Editor content={context.wingsDocument.content} disabled={true} />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-end" py="1rem">
        <Button variant="contained" href={documentEditPath(spaceId, documentId)}>
          Edit
        </Button>
      </Grid>
    </Grid>
  )
}

export default ViewDocument
