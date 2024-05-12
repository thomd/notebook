import { redirect } from 'react-router-dom'
import { createPage } from '../pages'

export async function action({ request }) {
  const data = Object.fromEntries(await request.formData())
  const page = await createPage(data)
  return redirect(`/pages/${page.id}/edit`)
}


