const NOTION_TOKEN = process.env.NOTION_TOKEN!
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID!

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
}

export interface RichText {
  type: string
  plain_text: string
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  text?: { content: string; link: { url: string } | null }
  href: string | null
}

export interface Block {
  id: string
  type: string
  [key: string]: any
}

export async function getPageTitle(): Promise<string> {
  const res = await fetch(`https://api.notion.com/v1/pages/${NOTION_PAGE_ID}`, {
    headers,
    next: { revalidate: 60 },
  })
  const data = await res.json()
  const titleParts = data?.properties?.title?.title || []
  return titleParts.map((t: any) => t.plain_text).join('') || 'KACA 홈페이지 구축 제안서'
}

export async function getBlocks(blockId?: string): Promise<Block[]> {
  const id = blockId || NOTION_PAGE_ID
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${id}/children?page_size=100`,
    { headers, next: { revalidate: 60 } }
  )
  const data = await res.json()
  return data.results || []
}

export async function getTableRows(tableBlockId: string): Promise<Block[]> {
  return getBlocks(tableBlockId)
}
