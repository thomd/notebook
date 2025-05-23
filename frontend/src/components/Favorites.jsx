import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

export const whiteCircle = '&#x25CB;'
export const blackCircle = '&#x25CF;'

export function FavoritesMenu({ pages, className }) {
  const favoritePages = pages.filter((page) => page.favorite === true)

  return (
    <>
      {favoritePages.length > 0 && (
        <div className={`${className || ''} inline`}>
          <Menu offset={[-10, 10]} autoSelect={false}>
            <MenuButton className="text-lg text-[#bc0a6f] hover:text-[#bc0a6f] font-medium">Favorites</MenuButton>
            <MenuList>
              {favoritePages.map((page) => (
                <MenuItem className="!py-1 hover:bg-white !text-gray-600 hover:!text-gray-900" key={page.id} as="a" href={`/pages/${page.id}/`}>
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
