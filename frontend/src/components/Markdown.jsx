import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import remarkHeadlineEdit from 'remark-headline-edit'
import { visit } from 'unist-util-visit'
import 'katex/dist/katex.min.css'

export default function MarkdownViewer({ content }) {
  return (
    <div className="markdown mb-8">
      <Markdown
        remarkPlugins={[
          remarkDirective,
          remarkAside,
          remarkGfm,
          [remarkHeadlineEdit, { position: 'after', linkText: '[ edit ]', className: 'headline'}],
          remarkMath
        ]}
        rehypePlugins={[
          rehypeKatex,
          rehypeSlug,
          rehypeRaw
        ]}
        remarkRehypeOptions={{allowDangerousHtml: true}}
      >
        {content}
      </Markdown>
    </div>
  )
}

function remarkAside() {
  //
  // TRANSLATE
  //
  //     :::aside
  //     text
  //     :::
  //
  // TO
  //
  //     <aside>
  //     <p>text</p>
  //     </aside>
  //
  return function(tree) {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'aside') {
        const data = node.data || (node.data = {})
        data.hName = 'aside'
      }
    })
  }
}
