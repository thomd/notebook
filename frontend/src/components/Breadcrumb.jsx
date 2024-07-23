import { Link, useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export default function Breadcrumb({ pages, page }) {
  const navigate = useNavigate()

  useHotkeys('shift+i', () => {
    navigate('/')
  })

  useHotkeys('shift+c', () => {
    navigate(`/category/${page.cid}`)
  })

  return (
    <>
      <Link className="text-lg text-gray-400 hover:text-gray-600" to={'/'}>
        Index
      </Link>
      <Chevron />
      {page.category ? (
        <>
          <CategoriesMenu pages={pages} page={page} />
          <Chevron />
          <span className="text-lg text-gray-400">{page.title}</span>
        </>
      ) : (
        <span className="text-lg text-gray-400">{page.title}</span>
      )}
    </>
  )
}

function Chevron() {
  return (
    <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-[9px]" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
    </svg>
  )
}

function CategoriesMenu({ pages, page }) {
  const categoryPages = pages.filter((p) => page.cid === p.cid)

  return (
    <div className="inline">
      <Menu offset={[-10, 10]} autoSelect={false}>
        <MenuButton className="text-lg text-gray-400 hover:text-gray-500">{page.category}</MenuButton>
        <MenuList>
          {categoryPages.map((categoryPage) => (
            <MenuItem className="hover:bg-white hover:text-gray-500" key={categoryPage.id} as="a" href={`/pages/${categoryPage.id}/`}>
              {categoryPage.title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  )
}
