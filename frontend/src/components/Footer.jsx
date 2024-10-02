export function Footer({ filename, className }) {
  const baseURL = process.env.REACT_APP_REMOTE_PAGES_REPO_URL
  const url = filename ? baseURL + '/' + filename : baseURL

  return (
    <div className={`${className || ''}`}>
      {baseURL && (
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
