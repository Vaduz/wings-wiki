import { NextPage } from 'next'
import React, { PropsWithChildren, useState } from 'react'
import { CloseButton, documentBase, documentPath } from '@/components/global/link'
import TopNavi from '../../components/global/topNavi'
import { Editor } from '@/components/editor/editor'
import { useRouter } from 'next/router'

const NewDocument: NextPage = (props: PropsWithChildren<any>) => {
  const [title, setTitle] = useState('')
  const router = useRouter()

  const createButtonHandler = (title: string = '', content: string = '') => {
    console.log(`Creating new document: ${title}, ${content}`)
    // createDocument(title, content).then((r) => router.push(r ? documentPath(r) : documentBase).then())
  }

  return (
    <>
      <TopNavi />
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
          <CloseButton href={documentBase}>
            <i className="bi bi-card-list" />
            &nbsp;Documents
          </CloseButton>
        </div>
      </div>
    </>
  )
}

export default NewDocument
