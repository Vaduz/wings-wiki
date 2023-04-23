import { DocumentId, SpaceId, WingsDocument, WingsDocumentSearchResult } from '@/lib/types/es'
import { Fragment, useEffect, useState } from 'react'
import { childDocumentsApi, getDocumentApi } from '@/lib/api/document'
import { documentPath, newDocumentPath, spaceBase } from '@/components/global/WingsLink'
import { Collapse, Grid, List, ListItemButton, ListItemIcon, ListItemText, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import HomeIcon from '@mui/icons-material/Home'
import FolderIcon from '@mui/icons-material/Folder'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import AddIcon from '@mui/icons-material/Add'
import { getSpaceApi } from '@/lib/api/space'

const DocumentTree = ({
  spaceId,
  parentId,
  documentId,
}: {
  spaceId: SpaceId
  parentId: DocumentId
  documentId: DocumentId
}): JSX.Element => {
  return (
    <>
      <Grid item sx={{ boxShadow: 2 }} p="0.5rem">
        <Typography variant="h5" gutterBottom>
          Document Tree
        </Typography>
        <List>
          <TraceParent spaceId={spaceId} documentId={parentId} />
          <DocumentTreeView spaceId={spaceId} parentId={parentId} documentId={documentId} />
        </List>
      </Grid>
    </>
  )
}

const TraceParent = ({ spaceId, documentId }: { spaceId: SpaceId; documentId: DocumentId }): JSX.Element => {
  const [parent, setParent] = useState<WingsDocument>()
  const [spaceTitle, setSpaceTitle] = useState('Space Home')
  useEffect(() => {
    if (documentId == '-1') return
    getDocumentApi(spaceId, documentId)
      .then((res) => setParent(res))
      .catch((err) => console.error(err))
  }, [spaceId, documentId])

  useEffect(() => {
    getSpaceApi(spaceId)
      .then((res) => {
        if (!res) return
        setSpaceTitle(res.name)
      })
      .catch((err) => console.error(err))
  }, [spaceId])

  if (documentId == '-1')
    return <Item title={spaceTitle} link={spaceBase(spaceId)} key="root" itemId="root" icon={<HomeIcon />} />
  if (!parent) return <div>Loading...</div>

  return (
    <>
      <TraceParent spaceId={spaceId} documentId={parent.parent_id} />
      <Item
        title={parent.title}
        link={documentPath(spaceId, parent.id)}
        key={parent.id}
        itemId={parent.id}
        icon={<FolderIcon />}
      />
    </>
  )
}

const DocumentTreeView = ({
  spaceId,
  parentId,
  documentId,
}: {
  spaceId: SpaceId
  parentId: DocumentId
  documentId: DocumentId
}): JSX.Element => {
  const [neighbors, setNeighbors] = useState<WingsDocumentSearchResult[]>()
  useEffect(() => {
    childDocumentsApi(spaceId, parentId)
      .then((res) => setNeighbors(res))
      .catch((err) => console.error(err))
  }, [spaceId, parentId])

  const [children, setChildren] = useState<WingsDocumentSearchResult[]>()
  useEffect(() => {
    if (documentId == '-1') {
      setChildren([])
      return
    }
    childDocumentsApi(spaceId, documentId)
      .then((res) => setChildren(res))
      .catch((err) => console.error(err))
  }, [spaceId, documentId])

  if (!neighbors || !children) return <div>Loading...</div>

  return (
    <>
      <Collapse in timeout="auto" unmountOnExit>
        <List component="div" disablePadding key={`${spaceId}-${parentId}-${documentId}`}>
          {Array.from(neighbors).map((neighbor) => {
            return (
              <Fragment key={`fragment-${neighbor.id}`}>
                <Item
                  title={neighbor.title}
                  link={documentPath(spaceId, neighbor.id)}
                  itemId={neighbor.id}
                  key={neighbor.id}
                  icon={<TextSnippetIcon />}
                />
                {neighbor.id == documentId && (
                  <Container>
                    <Collapse in timeout="auto" unmountOnExit>
                      <List component="div" disablePadding key={`children-of-${neighbor.id}`}>
                        {Array.from(children).map((child) => {
                          return (
                            <Item
                              title={child.title}
                              link={documentPath(spaceId, child.id)}
                              itemId={child.id}
                              icon={<TextSnippetIcon />}
                              key={child.id}
                            />
                          )
                        })}
                        <Item
                          title="New Document"
                          link={newDocumentPath(spaceId, documentId)}
                          key="New Document in child"
                          itemId="New Document in child"
                          icon={<AddIcon />}
                        />
                      </List>
                    </Collapse>
                  </Container>
                )}
              </Fragment>
            )
          })}
          <Item
            title="New Document"
            link={newDocumentPath(spaceId, parentId)}
            key="New Document"
            itemId="New Document"
            icon={<AddIcon />}
          />
        </List>
      </Collapse>
    </>
  )
}

const Item = ({
  itemId,
  title,
  link,
  icon,
}: {
  itemId: string
  title: string
  link: string
  icon: JSX.Element
}): JSX.Element => {
  const router = useRouter()
  return (
    <ListItemButton key={`child-${itemId}`} sx={{ py: '0.2rem' }}>
      <ListItemIcon sx={{ minWidth: '2rem' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={title}
        onClick={(e) => {
          e.preventDefault()
          router.push(link).then()
        }}
      />
    </ListItemButton>
  )
}

export default DocumentTree
