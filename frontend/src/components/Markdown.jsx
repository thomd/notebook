import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table'
import { gfmTable } from 'micromark-extension-gfm-table'
import remarkHeadingLines from 'remark-heading-lines'
import remarkWikiLink from 'remark-wiki-link'
import remarkDeflist from 'remark-deflist'
import rehypeTextmarker from 'rehype-textmarker'
import rehypeBlock from 'rehype-block'
import rehypeRaw from 'rehype-raw'
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

export default function MarkdownViewer({ content, className, preview }) {
  return (
    <div className={`markdown ${className}`}>
      <Markdown
        remarkPlugins={
          preview
            ? [remarkGfmTable, [remarkHeadingLines, { position: 'after', linkText: '', className: 'headline h{depth}' }], remarkDeflist, remarkMath]
            : [
                remarkGfmTable,
                [remarkHeadingLines, { position: 'after', linkText: '[ Edit ]', className: 'headline h{depth}' }],
                [remarkWikiLink, { path: '/pages/', slugger: true }],
                remarkDeflist,
                remarkMath,
              ]
        }
        rehypePlugins={[
          [rehypeBlock, { blockSymbol: ':::', classSymbol: ':', prefixClassWithBlockSymbol: true, wrapperTag: 'div' }],
          rehypeKatex,
          rehypeSlug,
          [
            rehypeTextmarker,
            [
              { textPattern: /^(# .+|#)$/gm, className: 'grey-comment', tags: ['code'] },
              { textPattern: /( # .+| \/\/ .+)/g, className: 'grey-comment', tags: ['code'] },
              { textPattern: /`(.+?)`/g, className: 'white-marker', tags: ['code.language-ascii'] },
              { textPattern: /≈(.+?)≈/g, className: 'yellow-marker', tags: ['p', 'code', 'li', 'td'] },
              { textPattern: /\b(TODO)\b/, className: 'red-marker' },
              { textPattern: /\[(.+?)\]/g, htmlTag: 'kbd', tags: ['p', 'li', 'td'], ignore: ['code'] },
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
