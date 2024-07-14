import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import rehypeNavigation from 'rehype-navigation'
import { useNavigationObserver } from '../hooks/navigation'

export default function Navigation({ content }) {
  useNavigationObserver()
  return (
    <Markdown
      rehypePlugins={[rehypeSlug, [rehypeNavigation, { extract: true, wrapperTag: 'nav', maxDepth: 2 }]]}
      remarkRehypeOptions={{ allowDangerousHtml: true }}>
      {content}
    </Markdown>
  )
}
