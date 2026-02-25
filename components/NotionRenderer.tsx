import { Block, RichText, getTableRows } from '@/lib/notion'

function renderRichText(richTexts: RichText[]): React.ReactNode[] {
  return richTexts.map((rt, i) => {
    const text = rt.plain_text
    if (!text) return null

    const ann = rt.annotations
    let node: React.ReactNode = text

    // Color
    if (ann.color && ann.color !== 'default') {
      const colorMap: Record<string, string> = {
        green: '#22c55e',
        red: '#ef4444',
        blue: '#3b82f6',
        yellow: '#eab308',
        orange: '#f97316',
        purple: '#8b5cf6',
        pink: '#ec4899',
        gray: '#6b7280',
      }
      const c = colorMap[ann.color] || colorMap[ann.color.replace('_background', '')]
      if (c) {
        if (ann.color.includes('background')) {
          node = <span key={i} style={{ backgroundColor: c + '20', padding: '0 2px', borderRadius: 2 }}>{node}</span>
        } else {
          node = <span key={i} style={{ color: c }}>{node}</span>
        }
      }
    }

    if (ann.bold) node = <strong key={`b${i}`}>{node}</strong>
    if (ann.italic) node = <em key={`i${i}`}>{node}</em>
    if (ann.strikethrough) node = <s key={`s${i}`}>{node}</s>
    if (ann.code) node = <code key={`c${i}`}>{node}</code>
    if (ann.underline) node = <u key={`u${i}`}>{node}</u>

    if (rt.href) {
      node = <a key={`a${i}`} href={rt.href} target="_blank" rel="noopener noreferrer">{node}</a>
    }

    return <span key={i}>{node}</span>
  })
}

function TableBlock({ block }: { block: Block & { _rows?: Block[] } }) {
  const rows = block._rows || []
  const hasHeader = block.table?.has_column_header

  return (
    <div className="table-wrap">
      <table>
        <tbody>
          {rows.map((row: any, ri: number) => {
            const cells = row.table_row?.cells || []
            const isHeader = ri === 0 && hasHeader
            const Tag = isHeader ? 'th' : 'td'
            return (
              <tr key={ri} className={isHeader ? 'header-row' : ''}>
                {cells.map((cell: RichText[], ci: number) => (
                  <Tag key={ci}>{renderRichText(cell)}</Tag>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CalloutBlock({ block }: { block: Block }) {
  const richText = block.callout?.rich_text || []
  const icon = block.callout?.icon?.emoji || '💡'
  const color = block.callout?.color || 'default'

  let cls = 'callout'
  if (color.includes('blue')) cls += ' callout-blue'
  else if (color.includes('yellow')) cls += ' callout-yellow'
  else if (color.includes('gray')) cls += ' callout-gray'
  else if (color.includes('green')) cls += ' callout-green'
  else cls += ' callout-blue'

  return (
    <div className={cls}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-text">{renderRichText(richText)}</div>
    </div>
  )
}

const emojiMap: Record<string, string> = {
  '프로젝트 개요': '🎯',
  '기술 구성': '⚙️',
  '홈페이지 구성': '🖥️',
  '참고 사이트': '🔍',
  '패키지 안내': '📦',
  '진행 프로세스': '📋',
  '협회에서': '📝',
  '문의': '💬',
}

function getEmoji(text: string): string {
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (text.includes(key)) return emoji + ' '
  }
  return ''
}

export default function NotionRenderer({ blocks }: { blocks: Block[] }) {
  const elements: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let listType: 'ul' | 'ol' | null = null

  function flushList() {
    if (listItems.length > 0 && listType) {
      const ListTag = listType === 'ul' ? 'ul' : 'ol'
      elements.push(<ListTag key={`list-${elements.length}`}>{listItems}</ListTag>)
      listItems = []
      listType = null
    }
  }

  for (const block of blocks) {
    const bt = block.type

    if (bt !== 'bulleted_list_item' && bt !== 'numbered_list_item') {
      flushList()
    }

    switch (bt) {
      case 'heading_1': {
        const rt = block.heading_1?.rich_text || []
        const plain = rt.map((t: RichText) => t.plain_text).join('')
        const emoji = getEmoji(plain)
        const id = `section-${block.id}`
        elements.push(
          <section key={block.id} id={id}>
            <h1>{emoji}{renderRichText(rt)}</h1>
          </section>
        )
        break
      }
      case 'heading_2': {
        const rt = block.heading_2?.rich_text || []
        elements.push(<h2 key={block.id}>{renderRichText(rt)}</h2>)
        break
      }
      case 'heading_3': {
        const rt = block.heading_3?.rich_text || []
        elements.push(<h3 key={block.id}>{renderRichText(rt)}</h3>)
        break
      }
      case 'paragraph': {
        const rt = block.paragraph?.rich_text || []
        const text = rt.map((t: RichText) => t.plain_text).join('')
        if (text.trim()) {
          elements.push(<p key={block.id}>{renderRichText(rt)}</p>)
        }
        break
      }
      case 'bulleted_list_item': {
        if (listType !== 'ul') { flushList(); listType = 'ul' }
        const rt = block.bulleted_list_item?.rich_text || []
        listItems.push(<li key={block.id}>{renderRichText(rt)}</li>)
        break
      }
      case 'numbered_list_item': {
        if (listType !== 'ol') { flushList(); listType = 'ol' }
        const rt = block.numbered_list_item?.rich_text || []
        listItems.push(<li key={block.id}>{renderRichText(rt)}</li>)
        break
      }
      case 'callout':
        elements.push(<CalloutBlock key={block.id} block={block} />)
        break
      case 'table':
        elements.push(<TableBlock key={block.id} block={block} />)
        break
      case 'divider':
        elements.push(<hr key={block.id} />)
        break
      case 'bookmark': {
        const url = block.bookmark?.url || ''
        elements.push(
          <div key={block.id} style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="sample-btn">
              🌐 샘플 사이트 보기
            </a>
          </div>
        )
        break
      }
      case 'quote': {
        const rt = block.quote?.rich_text || []
        elements.push(<blockquote key={block.id}>{renderRichText(rt)}</blockquote>)
        break
      }
    }
  }

  flushList()

  return <>{elements}</>
}
