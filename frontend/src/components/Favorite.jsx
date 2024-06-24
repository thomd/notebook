import { useFetcher } from 'react-router-dom'

export default function Favorite({ page }) {
  const fetcher = useFetcher()
  let favorite = page.favorite
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true"
  }
  return (
    <fetcher.Form method="post" className="inline ml-4">
      <button name="favorite" value={favorite ? "false" : "true"} className="text-gray-400">
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  )
}
