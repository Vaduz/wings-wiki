import { CircularProgress, Grid, ListItemIcon } from '@mui/material'
import Typography from '@mui/material/Typography'
import { spaceBase } from '@/components/global/WingsLink'
import React, { useEffect, useState } from 'react'
import { getLatestDocumentsApi } from '@/lib/api/document'
import { Space, SpaceId, WingsDocument } from '@/lib/types/elasticsearch'
import { useRouter } from 'next/router'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import DocumentCard from '@/components/document/DocumentCard'

const LatestUpdatedDocuments = ({ spaceId }: { spaceId: SpaceId }): JSX.Element => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [space, setSpace] = useState<Space>()
  const [documents, setDocuments] = useState<WingsDocument[]>()
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

  if (loading || documents == undefined || !space) return <CircularProgress />

  return (
    <Grid container direction="column" sx={{ py: 1 }}>
      <Grid item my={1}>
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            ':hover': { cursor: 'pointer', textDecoration: 'underline' },
          }}
          onClick={() => router.push(spaceBase(spaceId)).then()}
        >
          <ListItemIcon sx={{ minWidth: '2rem' }}>
            <WorkspacesIcon />
          </ListItemIcon>
          {space.name}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container ml={2}>
          {documents.length == 0 && <Typography variant="body1">No documents</Typography>}
          {documents.map((document) => {
            return (
              <DocumentCard
                key={`${spaceId}-${document.id}`}
                spaceId={spaceId}
                documentId={document.id}
                title={document.title}
                date={new Date(document.updated_at)}
              />
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}
export default LatestUpdatedDocuments
