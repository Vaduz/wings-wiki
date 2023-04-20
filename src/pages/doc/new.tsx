import TopNavi from '@/components/global/topNavi'
import { useState } from 'react'
import { createSpaceApi, CreateSpaceRequest } from '@/lib/api/space'
import { useRouter } from 'next/router'
import logger from '@/lib/logger/pino'
import { spaceBase } from '@/components/global/link'

const NewSpace = (): JSX.Element => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [members, setMembers] = useState<string[]>([])
  const router = useRouter()

  const createButtonHandler = () => {
    if (!name) return
    const createSpaceRequest: CreateSpaceRequest = {
      name: name,
      description: description,
      members: members,
    }
    createSpaceApi(createSpaceRequest)
      .then((res) => {
        if (!res) {
          logger.error({ message: 'Invalid response from API', request: createSpaceRequest, res: res })
        } else {
          router.push(spaceBase(res.id)).then()
        }
      })
      .catch((err) => logger.error({ message: 'Failed to create space', request: createSpaceRequest, err: err }))
  }

  return (
    <div className="container-xl mt-3">
      <TopNavi />
      <div className="container">
        <h1>Create new space</h1>
        <input
          id="text"
          type="text"
          placeholder="title"
          className="form-control form-control-lg- mb3"
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          id="description"
          placeholder="description"
          className="form-control form-control-lg- mb3"
          onChange={(e) => setDescription(e.target.value)}
        />
        <a className="btn btn-primary" onClick={() => createButtonHandler()}>
          Create a new Space
        </a>
      </div>
    </div>
  )
}

export default NewSpace
