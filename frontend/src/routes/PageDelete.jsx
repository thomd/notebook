import { redirect } from 'react-router-dom'
import { deletePage } from '../pages'

export async function action({ params }) {
  await deletePage(params.pageId)
  return redirect('/')
}

