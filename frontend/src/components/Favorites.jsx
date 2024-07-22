import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

export function FavoritesMenu({ pages, className }) {
  const favoritePages = pages.filter((page) => page.favorite === true)
  return (
    <div className={`${className} inline`}>
      <Menu offset={[-150, 20]} autoSelect={false}>
        <MenuButton className="text-lg text-gray-400 hover:text-gray-500">Favorites</MenuButton>
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
