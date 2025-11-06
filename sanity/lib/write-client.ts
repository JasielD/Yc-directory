import "server-only"
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId,token } from '../env'

export const write_Client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token,
})

if(!write_Client.config().token){
    throw new Error("write token not found")
}