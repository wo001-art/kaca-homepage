import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KACA 홈페이지 제작 제안서',
  description: '한국아트크래프트협회 홈페이지 구축 제안서 - WOOKVAN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
