import { DocumentId, SpaceId, WingsDocument, WingsDocumentSearchResult } from '@/lib/types/elasticsearch'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { childDocumentsApi, getDocumentApi } from '@/lib/api/document'
import { documentPath, newDocumentPath, spaceBase } from '@/components/global/WingsLink'
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material'
import { useRouter } from 'next/router'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import FolderIcon from '@mui/icons-material/Folder'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import AddIcon from '@mui/icons-material/Add'
import { getSpaceApi } from '@/lib/api/space'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { useDocumentContext } from '@/contexts/document'

const DocumentTree = ({ fromRoot }: { fromRoot?: Boolean }): JSX.Element => {
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const context = useDocumentContext()
  if (!context) return <CircularProgress />
  if (context.loading) return <CircularProgress />
  const documentId = (!fromRoot && context.documentId) || '-1'
  if (!fromRoot && !context.wingsDocument) {
    return <Typography variant="body1">Document not found: {documentId}</Typography>
  }
  const parentId = context.wingsDocument?.parent_id ?? '-1'

  return (
    <>
      <Paper sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
          <ListItemIcon sx={{ minWidth: '2.2rem' }}>
            <AccountTreeIcon />
          </ListItemIcon>
          Document Tree
        </Typography>
        <DocumentTreeBody spaceId={spaceId} documentId={documentId} parentId={parentId} />
      </Paper>
    </>
  )
}

const DocumentTreeBody = ({
  spaceId,
  documentId,
  parentId,
}: {
  spaceId: SpaceId
  documentId: DocumentId
  parentId: DocumentId
}): JSX.Element => {
  const [documentTreeBody, setDocumentTreeBody] = useState<JSX.Element>()

  useEffect(() => {
    setDocumentTreeBody(
      <List>
        <SpaceItem spaceId={spaceId} />
        <TraceParent spaceId={spaceId} documentId={parentId}>
          <DocumentTreeView spaceId={spaceId} parentId={parentId} documentId={documentId} />
        </TraceParent>
      </List>
    )
  }, [])
  return documentTreeBody ? documentTreeBody : <CircularProgress />
}

interface TraceParentProps {
  spaceId: SpaceId
  documentId: DocumentId
  children: ReactNode
}

const TraceParent = (props: TraceParentProps): JSX.Element => {
  const [parent, setParent] = useState<WingsDocument>()
  useEffect(() => {
    if (props.documentId == '-1') return
    getDocumentApi(props.spaceId, props.documentId)
      .then((res) => setParent(res))
      .catch((err) => console.error(err))
  }, [props.spaceId, props.documentId])

  if (props.documentId == '-1') return <Container>{props.children}</Container>
  if (!parent) {
    return (
      <>
        <CircularProgress />
        <Container>{props.children}</Container>
      </>
    )
  }

  return (
    <>
      <TraceParent spaceId={props.spaceId} documentId={parent.parent_id}>
        <Item
          title={parent.title}
          link={documentPath(props.spaceId, parent.id)}
          key={parent.id}
          itemId={parent.id}
          icon={<FolderIcon />}
          expand={1}
          spaceId={props.spaceId}
        />
        <Container>{props.children}</Container>
      </TraceParent>
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

  return (
    <>
      <Collapse in timeout="auto" unmountOnExit>
        <List component="div" disablePadding key={`${spaceId}-${parentId}-${documentId}`}>
          {neighbors &&
            Array.from(neighbors).map((neighbor) => {
              return (
                <Fragment key={`fragment-${neighbor.id}`}>
                  <Item
                    title={neighbor.title}
                    link={documentPath(spaceId, neighbor.id)}
                    itemId={neighbor.id}
                    key={neighbor.id}
                    icon={<TextSnippetOutlinedIcon />}
                    expand={Boolean(neighbor.child_count) ? (neighbor.id == documentId ? 2 : 1) : 0}
                    spaceId={spaceId}
                    documentId={neighbor.id}
                  />
                </Fragment>
              )
            })}
          <NewItem spaceId={spaceId} documentId={documentId} />
        </List>
      </Collapse>
    </>
  )
}

const SpaceItem = ({ spaceId }: { spaceId: SpaceId }): JSX.Element => {
  const [spaceTitle, setSpaceTitle] = useState('Space Home')

  useEffect(() => {
    getSpaceApi(spaceId)
      .then((res) => {
        if (!res) return
        setSpaceTitle(res.name)
      })
      .catch((err) => console.error(err))
  }, [spaceId])

  return (
    <Item
      title={spaceTitle}
      link={spaceBase(spaceId)}
      key="root"
      itemId="root"
      icon={<WorkspacesIcon />}
      expand={0}
      spaceId={spaceId}
    />
  )
}

const ChildItems = ({ spaceId, documentId }: { spaceId: SpaceId; documentId: DocumentId }): JSX.Element => {
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

  return (
    <Container>
      <Collapse in timeout="auto" unmountOnExit>
        <List component="div" disablePadding key={`children-of-${documentId}`}>
          {(children &&
            Array.from(children).map((child) => {
              return (
                <Item
                  title={child.title}
                  link={documentPath(spaceId, child.id)}
                  itemId={child.id}
                  icon={<TextSnippetOutlinedIcon />}
                  key={child.id}
                  expand={Boolean(child.child_count) ? 1 : 0}
                  spaceId={spaceId}
                  documentId={child.id}
                />
              )
            })) || <CircularProgress />}
          <NewItem spaceId={spaceId} documentId={documentId} />
        </List>
      </Collapse>
    </Container>
  )
}

const NewItem = ({ spaceId, documentId }: { spaceId: SpaceId; documentId: DocumentId }): JSX.Element => {
  return (
    <>
      <ListItemButton
        href={newDocumentPath(spaceId, documentId)}
        selected={false}
        key={`new-item-${spaceId}-${documentId}`}
        sx={{ py: '0.2rem' }}
      >
        <ListItemIcon sx={{ minWidth: '2rem' }}>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary={'New Document'} />
      </ListItemButton>
    </>
  )
}

const Item = ({
  itemId,
  title,
  link,
  icon,
  expand,
  spaceId,
  documentId,
}: {
  itemId: string
  title: string
  link: string
  icon: JSX.Element
  expand: number
  spaceId: SpaceId
  documentId?: DocumentId
}): JSX.Element => {
  const router = useRouter()
  const context = useDocumentContext()
  const [expandState, setExpandState] = useState<number>(expand)

  return (
    <>
      <ListItemButton
        href={link}
        selected={(context && documentId == context.documentId) || false}
        key={`child-${itemId}`}
        sx={{ py: '0.2rem' }}
      >
        <ListItemIcon
          sx={{ minWidth: '2rem' }}
          onClick={(e) => {
            e.preventDefault()
            setExpandState((prevState) => (prevState == 1 ? 2 : prevState))
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={title}
          onClick={(e) => {
            e.preventDefault()
            documentId && context && context.setDocumentId(documentId)
            setExpandState((prevState) => (prevState == 1 ? 2 : prevState))
            link && router.push(link, link, { shallow: true }).then()
          }}
        />
        {expandState == 1 ? (
          <ExpandLess
            onClick={(e) => {
              e.preventDefault()
              setExpandState(2)
            }}
          />
        ) : expandState == 2 ? (
          <ExpandMore
            onClick={(e) => {
              e.preventDefault()
              setExpandState(1)
            }}
          />
        ) : undefined}
      </ListItemButton>
      {((documentId && expandState == 2) || (context && documentId == context.documentId)) && (
        <ChildItems spaceId={spaceId} documentId={documentId} />
      )}
    </>
  )
}

export default DocumentTree
