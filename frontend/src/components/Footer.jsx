export function Footer({ filename, className }) {
  const basePath = 'https://github.com/thomd/notebook-notes'
  const url = filename ? basePath + '/' + filename : basePath

  return (
    <p className={`text-sm text-gray-400 ${className || ''}`}>
      Source:
      <a className="text-sm text-gray-400 hover:text-gray-600 ml-2" href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
    </p>
  )
}
