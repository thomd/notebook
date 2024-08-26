import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import rehypeNavigation from 'rehype-navigation'
import StickyBox from 'react-sticky-box'

export default function Navigation({ content }) {
  return (
    <div className="navigation pt-32">
      <StickyBox className="self-start" offsetTop={130} offsetBottom={30}>
        <Markdown
          rehypePlugins={[rehypeSlug, [rehypeNavigation, { extract: true, wrapperTag: 'nav', maxDepth: 2, fullMonty: false }]]}
          remarkRehypeOptions={{ allowDangerousHtml: true }}>
          {content}
        </Markdown>
      </StickyBox>
    </div>
  )
}
