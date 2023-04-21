import { NextPage } from 'next'
import React, { PropsWithChildren, useState } from 'react'
import { documentPath, spaceBase } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { Editor } from '@/components/editor/editor'
import { useRouter } from 'next/router'
import { createDocumentApi } from '@/lib/api/document'
import { Mention, NewWingsDocument, SpaceId } from '@/lib/types/es'
import Button from '@mui/material/Button'
import { Container, ButtonGroup, Grid, TextField } from '@mui/material'

const NewDocument: NextPage = (props: PropsWithChildren<any>) => {
  const [title, setTitle] = useState<string>('')
  const [mentions, setMentions] = useState<Mention[]>([])
  const [tags, setTags] = useState<string[]>([])
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId

  const createButtonHandler = (title: string = '', content: string = '') => {
    console.log(`Creating new document: ${title}, ${content}`)
    const newWingsDocument = {
      title: title,
      content: content,
      parent_id: '-1',
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
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ boxShadow: 2 }}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sx={{ boxShadow: 2 }}>
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
