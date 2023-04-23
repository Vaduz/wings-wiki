import React, { useEffect, useState } from 'react'
import TopNavi from '../../../components/global/TopNavi'
import { Space, SpaceId, WingsDocument } from '@/lib/types/es'
import { getLatestDocumentsApi } from '@/lib/api/document'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { documentPath } from '@/components/global/link'
import { Container, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import DocumentTree from '@/components/DocumentTree'

const ListDocuments = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [space, setSpace] = useState<Space>()
  const [documents, setDocuments] = useState<WingsDocument[]>()
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId

  useEffect(() => {
    if (!spaceId) return
    getLatestDocumentsApi(spaceId)
      .then((res) => {
        if (!res) return
        setSpace(res.space)
        setDocuments(res.documents)
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [spaceId])

  if (loading || documents == undefined || !space) {
    return (
      <>
        <TopNavi spaceId={spaceId} />
        <div>Loading...</div>
      </>
    )
  }

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={3} my="1rem">
            <DocumentTree spaceId={spaceId} parentId={'-1'} documentId={'-1'} />
          </Grid>
          <Grid item xs={9}>
            <Grid container direction="column">
              <Grid item sx={{ p: '1rem' }}>
                <Typography variant="h2">{space.name}</Typography>
              </Grid>
              <Grid item sx={{ boxShadow: 2, p: '1rem' }}>
                <Grid container direction="column" spacing={1}>
                  <Typography variant="h4">Updated recently</Typography>
                  {documents.length == 0 && <div>No documents</div>}
                  {documents.map((document) => {
                    return (
                      <Grid item key={document.id}>
                        <Link href={documentPath(spaceId, document.id)}>{document.title}</Link>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ListDocuments
