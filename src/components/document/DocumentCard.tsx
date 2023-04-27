import { Card, CardActionArea, ListItemIcon } from '@mui/material'
import { documentPath } from '@/components/global/WingsLink'
import Typography from '@mui/material/Typography'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import React from 'react'
import { useRouter } from 'next/router'
import { SpaceId, DocumentId } from '@/lib/types/elasticsearch'

const DocumentCard = ({
  spaceId,
  documentId,
  title,
  date,
}: {
  spaceId: SpaceId
  documentId: DocumentId
  title: string
  date: Date
}) => {
  return (
    <Card key={documentId} sx={{ my: 1, width: '100%' }}>
      <CardActionArea href={documentPath(spaceId, documentId)} sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon sx={{ minWidth: '2rem' }}>
            <TextSnippetOutlinedIcon />
          </ListItemIcon>
          {title}
        </Typography>
        <Typography variant="body2" textAlign="right" color="gray">
          {date.toLocaleString()}
        </Typography>
      </CardActionArea>
    </Card>
  )
}

export default DocumentCard
