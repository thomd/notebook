import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'

export function FavoritesMenu({ pages }) {
  const favoritePages = pages.filter((page) => page.favorite === true)
  return (
    <Menu>
      <MenuButton>Favorites</MenuButton>
      <MenuList>
        <MenuItem as="a" href="/">
          Home
        </MenuItem>
        <MenuDivider />
        {favoritePages.map((page) => (
          <MenuItem key={page.id} as="a" href={`/pages/${page.id}/`}>
            {page.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export function Favorites({ pages }) {
  const favoritePages = pages.filter((page) => page.favorite === true)
  return (
    <nav>
      <ul>
        <li className="mb-4">
          <Link to={''}>Home</Link>
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
