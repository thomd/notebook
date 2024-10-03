import { redirect } from 'react-router-dom'
import { deletePage } from '../services/pages'

export async function action({ params }) {
  await deletePage(params.pageId)
  return redirect('/')
}
