import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import remarkHeadlineEdit from 'remark-headline-edit'
import 'katex/dist/katex.min.css'

export default function MarkdownViewer({ content }) {
  return (
    <div className="markdown mb-8">
      <Markdown
        remarkPlugins={[remarkGfm, [remarkHeadlineEdit, { maxDepth: 2, linkText: '[ edit ]'}], remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]}
        remarkRehypeOptions={{allowDangerousHtml: true}}
      >{content}</Markdown>
    </div>
  )
}

