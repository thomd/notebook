export function isReadPage(pathname) {
  return pathname.match(/^\/pages\/[^/]+\/?$/)
}

export function isEditPage(pathname) {
  return pathname.match(/^\/pages\/[^/]+\/edit/)
}
