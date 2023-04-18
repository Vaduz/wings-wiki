import { NextPage } from 'next'
import React, { PropsWithChildren, useState } from 'react'
import { CloseButton, documentPath, spaceBase } from '@/components/global/link'
import TopNavi from '../../../components/global/topNavi'
import { Editor } from '@/components/editor/editor'
import { useRouter } from 'next/router'
import { createDocumentApi } from '@/lib/api/document'
import { SourceWingsDocument, SpaceId } from '@/lib/types/es'

const NewDocument: NextPage = (props: PropsWithChildren<any>) => {
  const [title, setTitle] = useState('')
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId

  const createButtonHandler = (title: string = '', content: string = '') => {
    console.log(`Creating new document: ${title}, ${content}`)
    const newWingsDocument: SourceWingsDocument = {
      title: title,
      content: content,
      author_id: '5fe976c2-f72f-4530-951e-a7f143b4550d',
      parent_id: undefined,
      mentions: [{ user_id: '5fe976c2-f72f-4530-951e-a7f143b4550d' }],
      tags: ['hoge', 'fuga'],
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
          <a
            className="btn btn-primary"
            onClick={(e) =>
              createButtonHandler(title, document.getElementsByClassName('ck-content').item(0)?.innerHTML)
            }
          >
            <i className="bi bi-globe" />
            &nbsp;Publish
          </a>
          <CloseButton href={spaceBase(spaceId)}>
            <i className="bi bi-card-list" />
            &nbsp;Documents
          </CloseButton>
        </div>
      </div>
    </div>
  )
}

export default NewDocument
