import { Card, CardActionArea, CircularProgress, Divider, Grid, ListItemIcon, Paper } from '@mui/material'
import Typography from '@mui/material/Typography'
import { documentPath, spaceBase } from '@/components/global/WingsLink'
import React, { useEffect, useState } from 'react'
import { getLatestDocumentsApi } from '@/lib/api/document'
import { Space, SpaceId, WingsDocument } from '@/lib/types/elasticsearch'
import { useRouter } from 'next/router'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import HomeIcon from '@mui/icons-material/Home'

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
    <Grid container direction="column" sx={{ my: 2, p: 1 }}>
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
            <HomeIcon />
          </ListItemIcon>
          {space.name}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container ml={2}>
          {documents.length == 0 && <Typography variant="body1">No documents</Typography>}
          {documents.map((document) => {
            return (
              <Card key={document.id} sx={{ my: 1, width: '100%' }}>
                <CardActionArea onClick={() => router.push(documentPath(spaceId, document.id)).then()} sx={{ p: 1 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon sx={{ minWidth: '2rem' }}>
                      <TextSnippetOutlinedIcon />
                    </ListItemIcon>
                    {document.title}
                  </Typography>
                  <Typography variant="subtitle1">
                    {document.updated_at.toString()} | {document.author_id}
                  </Typography>
                </CardActionArea>
              </Card>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}
export default LatestUpdatedDocuments
