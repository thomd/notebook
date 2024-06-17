import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'

export default function MarkdownViewer({ content }) {
  return (
    <div className="markdown">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]}
        remarkRehypeOptions={{allowDangerousHtml: true}}
      >{content}</Markdown>
    </div>
  )
}

