import { DocumentId, SpaceId, WingsDocument, WingsDocumentSearchResult } from '@/lib/types/elasticsearch'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { childDocumentsApi, getDocumentApi } from '@/lib/api/document'
import { documentPath, newDocumentPath, spaceBase } from '@/components/global/WingsLink'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Box,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return documentTreeBody ? (
    documentTreeBody
  ) : (
    <List>
      <SpaceItem spaceId={spaceId} />
      <CircularProgress />
    </List>
  )
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

  if (props.documentId == '-1') return <Box pl={3}>{props.children}</Box>
  if (!parent) {
    return (
      <>
        <CircularProgress />
        <Box pl={3}>{props.children}</Box>
      </>
    )
  }

  return (
    <>
      <TraceParent spaceId={props.spaceId} documentId={parent.parent_id}>
        <FolderItem
          key={parent.id}
          spaceId={props.spaceId}
          documentId={parent.id}
          parentId={parent.parent_id}
          title={parent.title}
          link={documentPath(props.spaceId, parent.id)}
        >
          {props.children}
        </FolderItem>
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
      <List component="div" disablePadding key={`${spaceId}-${parentId}-${documentId}`}>
        {(neighbors &&
          Array.from(neighbors).map((neighbor) => {
            return (
              <Fragment key={`fragment-${neighbor.id}`}>
                <Item
                  title={neighbor.title}
                  link={documentPath(spaceId, neighbor.id)}
                  itemId={neighbor.id}
                  key={neighbor.id}
                  icon={<TextSnippetOutlinedIcon />}
                  expand={
                    Boolean(neighbor.child_count)
                      ? neighbor.id == documentId
                        ? ExpandState.AUTO_EXPAND
                        : ExpandState.HAS_CHILDREN
                      : ExpandState.NO_CHILDREN
                  }
                  spaceId={spaceId}
                  documentId={neighbor.id}
                />
              </Fragment>
            )
          })) || <CircularProgress />}
        <NewItem spaceId={spaceId} documentId={documentId} />
      </List>
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
      expand={ExpandState.NO_CHILDREN}
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
    <Box pl={3}>
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
                expand={Boolean(child.child_count) ? ExpandState.HAS_CHILDREN : 0}
                spaceId={spaceId}
                documentId={child.id}
              />
            )
          })) || <CircularProgress />}
        <NewItem spaceId={spaceId} documentId={documentId} />
      </List>
    </Box>
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

interface FolderItemProps {
  title: string
  link: string
  spaceId: SpaceId
  documentId: DocumentId
  parentId: DocumentId
  children: ReactNode
}

const FolderItem = (props: FolderItemProps): JSX.Element => {
  const router = useRouter()
  const context = useDocumentContext()
  const [folderExpanded, setFolderExpanded] = useState<Boolean>(false)
  const [childrenExpanded, setChildrenExpanded] = useState<Boolean>(true)
  const [childDocuments, setChildDocuments] = useState<WingsDocumentSearchResult[]>()

  function getChildren() {
    childDocumentsApi(props.spaceId, props.parentId)
      .then((res) => setChildDocuments(res))
      .catch((err) => console.error(err))
  }

  if (folderExpanded) {
    !childDocuments && getChildren()
    return (
      <>
        {(childDocuments &&
          Array.from(childDocuments)
            .filter((child) => child.id != props.documentId)
            .map((child) => {
              return (
                <>
                  <Item
                    title={child.title}
                    link={documentPath(props.spaceId, child.id)}
                    itemId={child.id}
                    icon={<TextSnippetOutlinedIcon />}
                    key={child.id}
                    expand={Boolean(child.child_count) ? 1 : 0}
                    spaceId={props.spaceId}
                    documentId={child.id}
                  />
                </>
              )
            })) || <CircularProgress />}
        <Item
          title={props.title}
          link={documentPath(props.spaceId, props.documentId)}
          itemId={props.documentId}
          icon={<TextSnippetOutlinedIcon />}
          key={props.documentId}
          expand={2}
          spaceId={props.spaceId}
          documentId={props.documentId}
        >
          {props.children}
        </Item>
      </>
    )
  }

  return (
    <>
      <ListItemButton
        href={props.link}
        selected={(context && props.documentId == context.documentId) || false}
        key={`child-${props.documentId}`}
        sx={{ py: '0.2rem' }}
      >
        <ListItemIcon
          sx={{ minWidth: '2rem' }}
          onClick={(e) => {
            e.preventDefault()
            props.documentId && context && context.setDocumentId(props.documentId)
            setFolderExpanded(true)
            props.link && router.push(props.link, props.link, { shallow: true }).then()
          }}
        >
          <FolderIcon />
        </ListItemIcon>
        <ListItemText
          primary={props.title}
          onClick={(e) => {
            e.preventDefault()
            props.documentId && context && context.setDocumentId(props.documentId)
            setFolderExpanded(true)
            props.link && router.push(props.link, props.link, { shallow: true }).then()
          }}
        />
        {childrenExpanded ? (
          <ExpandLess
            onClick={(e) => {
              e.preventDefault()
              setChildrenExpanded(true)
            }}
          />
        ) : (
          <ExpandMore
            onClick={(e) => {
              e.preventDefault()
              setChildrenExpanded(false)
            }}
          />
        )}
      </ListItemButton>
      <Box pl={3}>{props.children}</Box>
    </>
  )
}

interface ItemProps {
  itemId: string
  title: string
  link: string
  icon: JSX.Element
  expand: ExpandState
  spaceId: SpaceId
  documentId?: DocumentId
  children?: ReactNode
}

const Item = (props: ItemProps): JSX.Element => {
  const router = useRouter()
  const context = useDocumentContext()
  const [expandState, setExpandState] = useState<ExpandState>(props.expand)

  return (
    <>
      <ListItemButton
        href={props.link}
        selected={(context && props.documentId == context.documentId) || false}
        key={`child-${props.itemId}`}
        sx={{ py: '0.2rem' }}
      >
        <ListItemIcon
          sx={{ minWidth: '2rem' }}
          onClick={(e) => {
            e.preventDefault()
            setExpandState((prevState) => (prevState == ExpandState.HAS_CHILDREN ? ExpandState.EXPANDED : prevState))
            props.link && router.push(props.link, props.link, { shallow: true }).then()
          }}
        >
          {props.icon}
        </ListItemIcon>
        <ListItemText
          primary={props.title}
          onClick={(e) => {
            e.preventDefault()
            props.documentId && context && context.setDocumentId(props.documentId)
            setExpandState((prevState) => (prevState == ExpandState.HAS_CHILDREN ? ExpandState.EXPANDED : prevState))
            props.link && router.push(props.link, props.link, { shallow: true }).then()
          }}
        />
        {expandState == ExpandState.HAS_CHILDREN ? (
          <ExpandLess
            onClick={(e) => {
              e.preventDefault()
              setExpandState(ExpandState.EXPANDED)
            }}
          />
        ) : expandState >= ExpandState.EXPANDED ? (
          <ExpandMore
            onClick={(e) => {
              e.preventDefault()
              setExpandState(ExpandState.HAS_CHILDREN)
            }}
          />
        ) : undefined}
      </ListItemButton>
      {props.documentId && (expandState == ExpandState.EXPANDED || expandState == ExpandState.AUTO_EXPAND) && (
        <ChildItems spaceId={props.spaceId} documentId={props.documentId} />
      )}
    </>
  )
}

enum ExpandState {
  NO_CHILDREN,
  HAS_CHILDREN,
  EXPANDED,
  AUTO_EXPAND,
}

export default DocumentTree
