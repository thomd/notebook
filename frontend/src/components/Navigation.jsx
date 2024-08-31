import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import rehypeNavigation from 'rehype-navigation'
import StickyBox from 'react-sticky-box'
import { ArrowRightIcon } from '@chakra-ui/icons'

export default function Navigation({ content, showNavigation, collapsed }) {
  return (
    <div className="navigation pt-32">
      {collapsed && <ArrowRightIcon className="!w-3 !h-3 ml-2 !text-gray-400 hover:!text-gray-500 cursor-pointer" onClick={showNavigation} />}
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
