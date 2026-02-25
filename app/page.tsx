import { getPageTitle, getBlocks, getTableRows } from '@/lib/notion'
import NotionRenderer from '@/components/NotionRenderer'

export const revalidate = 60

export default async function Page() {
  const [title, blocks] = await Promise.all([
    getPageTitle(),
    getBlocks(),
  ])

  // Fetch table rows for table blocks
  const enrichedBlocks = await Promise.all(
    blocks.map(async (block) => {
      if (block.type === 'table') {
        const rows = await getTableRows(block.id)
        return { ...block, _rows: rows }
      }
      return block
    })
  )

  return (
    <div className="page">
      <div className="page-icon">📋</div>
      <h1 className="page-title">{title}</h1>
      <div className="page-meta">WOOKVAN &middot; 2026년 2월</div>
      <NotionRenderer blocks={enrichedBlocks} />
    </div>
  )
}
