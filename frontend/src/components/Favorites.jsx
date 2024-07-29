import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

export function FavoritesMenu({ pages, className }) {
  const favoritePages = pages.filter((page) => page.favorite === true)

  return (
    <>
      {favoritePages.length > 0 && (
        <div className={`${className || ''} inline`}>
          <Menu offset={[-10, 10]} autoSelect={false}>
            <MenuButton className="text-lg text-gray-400 hover:text-gray-500">Favorites</MenuButton>
            <MenuList>
              {favoritePages.map((page) => (
                <MenuItem className="!py-1 hover:bg-white !text-gray-400 hover:!text-gray-600" key={page.id} as="a" href={`/pages/${page.id}/`}>
                  {page.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      )}
    </>
  )
}
