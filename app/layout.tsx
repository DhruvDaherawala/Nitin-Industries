import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dev by Dhruv',
  description: 'Created by Dhruv Daherawala',
  generator: 'd2 webs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
