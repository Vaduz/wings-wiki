import { Grid, ListItemIcon } from '@mui/material'
import Typography from '@mui/material/Typography'
import { documentPath, spaceBase } from '@/components/global/WingsLink'
import React, { useEffect, useState } from 'react'
import { getLatestDocumentsApi } from '@/lib/api/document'
import { Space, SpaceId, WingsDocument } from '@/lib/types/es'
import { useRouter } from 'next/router'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
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

  if (loading || documents == undefined || !space) return <div>Loading...</div>

  return (
    <Grid container direction="column" sx={{ my: 2, p: 1, boxShadow: 2 }}>
      <Grid item>
        <Typography
          variant="h5"
          sx={{
            my: 1,
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
        {documents.length == 0 && <div>No documents</div>}
        {documents.map((document) => {
          return (
            <Grid
              key={document.id}
              container
              direction="column"
              sx={{ my: 1, p: 1, boxShadow: 1, '&:hover': { boxShadow: 4, cursor: 'pointer' } }}
              onClick={() => router.push(documentPath(spaceId, document.id)).then()}
            >
              <Grid item key={document.id}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon sx={{ minWidth: '2rem' }}>
                    <TextSnippetIcon />
                  </ListItemIcon>
                  {document.title}
                </Typography>
              </Grid>
              <Grid item key={`${document.id}-bottom`}>
                <Typography variant="subtitle1">
                  {document.updated_at.toString()} | {document.author_id}
                </Typography>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
export default LatestUpdatedDocuments
