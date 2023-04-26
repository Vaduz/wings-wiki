import { NextPage } from 'next'
import React, { PropsWithChildren, useState } from 'react'
import { documentPath, spaceBase } from '@/components/global/WingsLink'
import TopNavi from '../../../components/global/TopNavi'
import { Editor } from '@/components/editor/editor'
import { useRouter } from 'next/router'
import { createDocumentApi } from '@/lib/api/document'
import { DocumentId, Mention, SpaceId } from '@/lib/types/elasticsearch'
import { Container, Button, ButtonGroup, Grid, TextField, Paper, Typography } from '@mui/material'

const NewDocument: NextPage = (props: PropsWithChildren<any>) => {
  const [title, setTitle] = useState<string>('')
  const [mentions, setMentions] = useState<Mention[]>([])
  const [tags, setTags] = useState<string[]>([])
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const parentId = router.query.parentId ? (router.query.parentId as DocumentId) : '-1'

  const createButtonHandler = (title: string = '', content: string = '') => {
    console.log(`Creating new document: ${title}, ${content}`)
    const newWingsDocument = {
      title: title,
      content: content,
      parent_id: parentId,
      mentions: mentions,
      tags: tags,
    }
    createDocumentApi(newWingsDocument, spaceId)
      .then((r) =>
        router
          .push(r ? documentPath(spaceId, r.id) : spaceBase(spaceId))
          .catch((err) => console.error('Redirect error', err))
      )
      .catch((err) => console.error('createDocumentApi error', err))
      .finally(() => console.log(new Date().toISOString(), ' Redirected'))
  }

  return (
    <>
      <TopNavi spaceId={spaceId} />
      <Container>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ mt: 2 }}>
              New Document
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <TextField
                id="title"
                label="Title"
                variant="outlined"
                fullWidth
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Editor content={props.content ?? ''} disabled={false} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <ButtonGroup variant="text" aria-label="text button group">
              <Button
                variant="contained"
                onClick={() =>
                  createButtonHandler(title, document.getElementsByClassName('ck-content').item(0)?.innerHTML)
                }
              >
                Publish
              </Button>
              <Button variant="text" href={spaceBase(spaceId)}>
                Close
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default NewDocument