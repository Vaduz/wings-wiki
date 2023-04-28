import { useRouter } from 'next/router'
import { SearchDocumentHit, Space, SpaceId } from '@/lib/types/elasticsearch'
import { useEffect, useState } from 'react'
import { getSpaceApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { searchDocumentsApi } from '@/lib/api/document'
import { CircularProgress, Container, Grid, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { LayoutBase } from '@/components/layout/Layout'
import SearchHits from '@/components/document/SearchHits'

const SearchDocuments = (): JSX.Element => {
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
          autoFocus
        />
      </Grid>
      <Grid item xs={12}>
        <SearchHits hits={hits} space={space} />
      </Grid>
    </Grid>
  )
}

export default SearchDocuments
