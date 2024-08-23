export function Footer({ filename, className }) {
  const basePath = 'https://github.com/thomd/notebook-notes'
  const url = filename ? basePath + '/' + filename : basePath

  return (
    <div className={`${className || ''}`}>
      <p className="text-xs text-gray-500">
        Source:
        <a className="text-xs text-gray-400 hover:text-gray-600 ml-2" href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      </p>
    </div>
  )
}
