import { SearchDocumentHit, Space } from '@/lib/types/elasticsearch'
import { Card, CardActionArea, Chip, Container, Grid, ListItemIcon, Stack } from '@mui/material'
import { documentPath } from '@/components/global/WingsLink'
import Typography from '@mui/material/Typography'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import React from 'react'
import styles from './SearchHits.module.scss'

const SearchHits = ({ hits, space }: { hits: SearchDocumentHit[]; space: Space }): JSX.Element => {
  return (
    <Grid container direction="column" rowSpacing={2}>
      {Array.from(hits).map((hit) => {
        return (
          <Grid item key={`hit-${hit.document.id}`}>
            <Card key={`card-${hit.document.id}`}>
              <CardActionArea href={documentPath(space.id, hit.document.id)} sx={{ p: 1 }} className={styles.cardEm}>
                <Grid container direction="column" rowSpacing={2}>
                  <Grid item>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon sx={{ minWidth: '2rem' }}>
                        <TextSnippetOutlinedIcon />
                      </ListItemIcon>
                      {hit.highlight.title ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: hit.highlight.title?.join('') ?? '',
                          }}
                        />
                      ) : (
                        hit.document.title
                      )}
                    </Typography>
                  </Grid>

                  {hit.highlight.tags && (
                    <Grid item>
                      <Stack direction="row" spacing={1}>
                        {Array.from(hit.highlight.tags).map((tag) => {
                          return (
                            <Chip
                              label={tag.replace(/<\/?em>/g, '')}
                              key={`${hit.document.id}-${tag}`}
                              variant="outlined"
                              color="primary"
                            />
                          )
                        })}
                      </Stack>
                    </Grid>
                  )}

                  {hit.highlight.content_plain && (
                    <Grid item>
                      <div dangerouslySetInnerHTML={{ __html: hit.highlight.content_plain?.join('') ?? '' }} />
                    </Grid>
                  )}
                </Grid>
                <Grid
                  container
                  columnSpacing={2}
                  sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                >
                  <Grid item>
                    <Stack direction="row" spacing={1}>
                      {hit.document.tags &&
                        Array.from(hit.document.tags).map((tag) => {
                          return <Chip label={tag} key={`${hit.document.id}-${tag}`} variant="outlined" size="small" />
                        })}
                    </Stack>
                  </Grid>
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

export default SearchHits
