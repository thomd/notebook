export function Footer({ filename }) {
  const basePath = 'https://github.com/thomd/notebook-notes'
  const url = basePath + '/' + filename

  return (
    <a className="text-sm text-gray-400" href={url} target="_blank">
      {url}
    </a>
  )
}
