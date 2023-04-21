import TopNavi from '../../../components/global/topNavi'
import { useRouter } from 'next/router'
import { SearchDocumentHit, Space, SpaceId } from '@/lib/types/es'
import React, { useEffect, useState } from 'react'
import { getSpaceApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import { searchDocumentsApi } from '@/lib/api/document'
import Link from 'next/link'
import { documentPath } from '@/components/global/link'
import { Grid, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

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

  if (loading) return <div>Loading...</div>
  if (!space) return <div>Unauthorized access</div>

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Grid container spacing={2}>
        <Grid item xs={12} my={'1rem'}>
          <Typography variant="h3" gutterBottom>
            Search
          </Typography>
        </Grid>
        <Search space={space} />
      </Grid>
    </>
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
    <>
      <Grid item xs={12}>
        <TextField
          id="q"
          label="Input text to search this space"
          variant="outlined"
          fullWidth
          onChange={(e) => setQ(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <ul>
          {Array.from(hits).map((hit) => {
            return (
              <li key={hit.document.id}>
                <Link href={documentPath(space.id, hit.document.id)}>{hit.document.title}</Link>
                <div dangerouslySetInnerHTML={{ __html: hit.highlight?.content.join('') ?? '' }}></div>
              </li>
            )
          })}
        </ul>
      </Grid>
    </>
  )
}

export default SearchDocuments