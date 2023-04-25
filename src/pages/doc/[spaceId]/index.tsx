import React from 'react'
import TopNavi from '../../../components/global/TopNavi'
import { SpaceId } from '@/lib/types/elasticsearch'
import { useRouter } from 'next/router'
import { Container, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import DocumentTree from '@/components/document/DocumentTree'
import LatestUpdatedDocuments from '@/components/document/LatestUpdatedDocuments'

const ListDocuments = () => {
  const spaceId = useRouter().query.spaceId as SpaceId
  if (!spaceId) return

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={4} my="1rem">
            <DocumentTree spaceId={spaceId} parentId={'-1'} documentId={'-1'} />
          </Grid>
          <Grid item xs={8} rowSpacing={2}>
            <Typography variant="h2" sx={{ my: 2 }}>
              New updates
            </Typography>
            <LatestUpdatedDocuments spaceId={spaceId} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ListDocuments
