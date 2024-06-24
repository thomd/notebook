export default function Title({ page }) {
  return (
    <>
      {page.category ? (
        <>
          <span className="text-gray-400">{page.category}</span>
          <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-2" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span className="text-gray-400">{page.title}</span>
        </>
      ) : (
        <span className="text-gray-400">{page.title}</span>
      )}
    </>
  )
}
