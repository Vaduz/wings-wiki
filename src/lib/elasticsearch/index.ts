import { Client } from '@elastic/elasticsearch'
import config from '@/app'

const client = new Client({
  node: config.esApiUrl,
})

export default client
