import { redirect } from 'react-router-dom'
import { createPage } from '../services/pages'

export async function action({ request }) {
  const data = Object.fromEntries(await request.formData())
  const page = await createPage(data)
  if (page.status === 201) {
    return redirect(`/pages/${page.data.id}/edit`)
  } else {
    const pageId = page.data.detail.replace("Page '", '').replace("' does already exist", '')
    return redirect(`/pages/${pageId}`)
  }
}
