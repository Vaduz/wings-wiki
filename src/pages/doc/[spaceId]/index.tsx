import { SpaceId } from '@/lib/types/elasticsearch'
import { useRouter } from 'next/router'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import DocumentTree from '@/components/document/DocumentTree'
import LatestUpdatedDocuments from '@/components/document/LatestUpdatedDocuments'
import { Layout } from '@/components/layout/Layout'
import { BigSpaceCardSingle } from '@/components/space/SpaceCard'
import { DocumentContextProvider } from '@/contexts/document'

const SpaceHome = (): JSX.Element => {
  const spaceId = useRouter().query.spaceId as SpaceId
  if (!spaceId) return <></>

  return (
    <DocumentContextProvider>
      <Layout menu={<DocumentTree fromRoot />}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} mb={2}>
            <BigSpaceCardSingle />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">New updates</Typography>
          </Grid>
          <Grid item xs={12}>
            <LatestUpdatedDocuments spaceId={spaceId} noTitle />
          </Grid>
        </Grid>
      </Layout>
    </DocumentContextProvider>
  )
}

export default SpaceHome
