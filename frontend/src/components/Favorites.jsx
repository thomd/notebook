import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

export function FavoritesMenu({ pages, className }) {
  const favoritePages = pages.filter((page) => page.favorite === true)
  return (
    <div className={`${className} inline`}>
      <Menu offset={[-150, 20]} autoSelect={false}>
        <MenuButton className="text-gray-400 hover:text-gray-500">Favorites</MenuButton>
        <MenuList>
          {favoritePages.map((page) => (
            <MenuItem className="hover:bg-white hover:text-gray-500" key={page.id} as="a" href={`/pages/${page.id}/`}>
              {page.title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  )
}

export function FavoritesList({ pages }) {
  const favoritePages = pages.filter((page) => page.favorite === true)
  return (
    <nav>
      <ul>
        <li className="mb-4">
          <Link to={''}>Index</Link>
        </li>
        {favoritePages.map((page) => (
          <li key={page.id}>
            <Link to={`pages/${page.id}/`}>
              {page.title}
              {page.favorite && <span className="ml-2">★</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
