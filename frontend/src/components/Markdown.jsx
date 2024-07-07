import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table'
import { gfmTable } from 'micromark-extension-gfm-table'
import remarkHeadingLines from 'remark-heading-lines'
import rehypeTextmarker from 'rehype-textmarker'
import rehypeBlock from 'rehype-block'
import 'katex/dist/katex.min.css'

function remarkGfmTable(options = {}) {
  const self = this
  const data = self.data()
  const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])
  const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = [])
  micromarkExtensions.push(gfmTable())
  fromMarkdownExtensions.push([gfmTableFromMarkdown()])
  toMarkdownExtensions.push({ extensions: [gfmTableToMarkdown(options)] })
}

export default function MarkdownViewer({ content }) {
  return (
    <div className="markdown mb-8">
      <Markdown
        remarkPlugins={[remarkGfmTable, [remarkHeadingLines, { position: 'after', linkText: '[ Edit ]', className: 'headline' }], remarkMath]}
        rehypePlugins={[
          rehypeBlock,
          rehypeKatex,
          rehypeSlug,
          [
            rehypeTextmarker,
            [
              { textPattern: /≈([^≈]+)≈/g, className: 'yellow-marker', tags: ['p', 'code'] },
              { textPattern: / (# .+)/g, className: 'grey-marker', tags: ['code'] },
              { textPattern: /`(.+?)`/g, className: 'white-marker', tags: ['mark'] },
              { textPattern: /^(# .+)/g, className: 'grey-marker', tags: ['code'] },
              { textPattern: /\b(TODO)\b/, className: 'red-marker' },
              { textPattern: /\[([^\]]+)\]/g, htmlTag: 'kbd', tags: ['p', 'li'] },
            ],
          ],
          rehypeRaw,
        ]}
        remarkRehypeOptions={{ allowDangerousHtml: true }}>
        {content}
      </Markdown>
    </div>
  )
}
