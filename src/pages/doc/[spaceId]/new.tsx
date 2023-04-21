import { NextPage } from 'next'
import React, { PropsWithChildren, useState } from 'react'
import { documentPath, spaceBase } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { Editor } from '@/components/editor/editor'
import { useRouter } from 'next/router'
import { createDocumentApi } from '@/lib/api/document'
import { Mention, NewWingsDocument, SpaceId } from '@/lib/types/es'
import Button from '@mui/material/Button'
import { ButtonGroup } from '@mui/material'

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
    <div className="container-xl mt-3">
      <TopNavi spaceId={spaceId} />
      <div className="container-xl mt-3">
        <div className="input-group">
          <input
            id="title"
            type="text"
            className="form-control form-control-lg mb-3"
            placeholder="Title"
            aria-label="Title"
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </div>
        <Editor content={props.content ?? ''} disabled={false} />
        <div className="float-end">
          <ButtonGroup variant="text" aria-label="text button grou">
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
        </div>
      </div>
    </div>
  )
}

export default NewDocument
