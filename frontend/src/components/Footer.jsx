export function Footer({ filename, className }) {
  const basePath = process.env.REACT_APP_REMOTE_PAGES_REPO_URL
  const url = filename ? basePath + '/' + filename : basePath

  return (
    <div className={`${className || ''}`}>
      {basePath && (
        <p className="text-sm text-gray-500">
          Source:
          <a className="text-sm text-gray-400 hover:text-gray-600 ml-2" href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
      )}
    </div>
  )
}
