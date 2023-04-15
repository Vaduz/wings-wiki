import { NextApiRequest, NextApiResponse } from 'next'
import { Document, DocumentId } from '@/lib/types/es'
import { createDocument, getDocument, updateDocument } from '@/lib/helpers/elasticsearch'

type DocumentResponse = {
  data?: Document
  error?: unknown
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req

  try {
    switch (method) {
      case 'GET':
        const documentId: DocumentId = req.query.documentId as string
        // TODO user validation
        const fetchedDocument = await getDocument(req.query.spaceId as string, documentId)
        if (!fetchedDocument) {
          res.status(404).json({ error: `${documentId} not found` })
        } else {
          res.status(200).json({ data: fetchedDocument })
        }
        break

      case 'POST':
        // TODO user validation
        const newDocument: Document = await createDocument(req.query.spaceId as string, JSON.parse(body))
        res.status(200).json({ data: newDocument })
        break

      case 'PUT':
        // TODO user validation
        const document = JSON.parse(body)
        await updateDocument(req.query.spaceId as string, document)
        res.status(200).json({ data: document })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    console.error(new Date().toISOString(), e)
    res.status(500).json({ error: e })
  }
  console.info(`${new Date().toISOString()} ${method} /api/document`, res.statusCode, req.query, req.body)
}
