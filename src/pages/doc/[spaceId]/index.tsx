import { SpaceId } from '@/lib/types/elasticsearch'
import { useRouter } from 'next/router'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import DocumentTree from '@/components/document/DocumentTree'
import LatestUpdatedDocuments from '@/components/document/LatestUpdatedDocuments'
import { Layout } from '@/components/layout/Layout'

const ListDocuments = () => {
  const spaceId = useRouter().query.spaceId as SpaceId
  if (!spaceId) return

  return (
    <Layout menu={<DocumentTree parentId={'-1'} />}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">New updates</Typography>
        </Grid>
        <Grid item xs={12}>
          <LatestUpdatedDocuments spaceId={spaceId} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ListDocuments
