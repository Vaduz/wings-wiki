import { useRouter } from 'next/router'
import { SearchDocumentHit, Space, SpaceId } from '@/lib/types/elasticsearch'
import React, { useEffect, useState } from 'react'
import { getSpaceApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { searchDocumentsApi } from '@/lib/api/document'
import { documentPath } from '@/components/global/WingsLink'
import { Card, CardActionArea, CircularProgress, Container, Grid, ListItemIcon, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { LayoutBase } from '@/components/layout/Layout'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'

const SearchDocuments = () => {
  const router = useRouter()
  const [space, setSpace] = useState<Space>()
  const [loading, setLoading] = useState<boolean>(true)
  const spaceId = router.query.spaceId as SpaceId
  useEffect(() => {
    if (!spaceId) return
    setLoading(true)
    getSpaceApi(spaceId)
      .then((r) => setSpace(r))
      .catch((e) => logger.error(e))
      .finally(() => setLoading(false))
  }, [spaceId])

  if (loading) return <CircularProgress />
  if (!space) return <Typography variant="h4">Unauthorized access</Typography>

  return (
    <LayoutBase>
      <Container>
        <Grid container direction="column" pt={2}>
          <Grid item>
            <Typography variant="h2">Search</Typography>
          </Grid>
          <Search space={space} />
        </Grid>
      </Container>
    </LayoutBase>
  )
}

export const Search = ({ space }: { space: Space }): JSX.Element => {
  const [hits, setHits] = useState<SearchDocumentHit[]>([])
  const [q, setQ] = useState<string>('')

  useEffect(() => {
    searchDocumentsApi(space.id, q)
      .then((r) => setHits(r))
      .catch((e) => logger.error(e))
  }, [q, space])

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <TextField
          id="q"
          label="Input text to search this space"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{ boxShadow: 2 }}
          onChange={(e) => setQ(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <SearchHits hits={hits} space={space} />
      </Grid>
    </Grid>
  )
}

const SearchHits = ({ hits, space }: { hits: SearchDocumentHit[]; space: Space }): JSX.Element => {
  return (
    <Grid container direction="column" rowSpacing={2}>
      {Array.from(hits).map((hit) => {
        return (
          <Grid item key={`hit-${hit.document.id}`}>
            <Card key={`card-${hit.document.id}`}>
              <CardActionArea href={documentPath(space.id, hit.document.id)} sx={{ p: 1 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon sx={{ minWidth: '2rem' }}>
                    <TextSnippetOutlinedIcon />
                  </ListItemIcon>
                  {hit.document.title}
                </Typography>
                <Container>
                  <div dangerouslySetInnerHTML={{ __html: hit.highlight?.content.join('') ?? '' }}></div>
                </Container>
                <Grid container columnSpacing={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid item>
                    <Typography variant="body2" textAlign="right" color="gray">
                      {space.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" textAlign="right" color="gray">
                      {new Date(hit.document.updated_at).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default SearchDocuments
