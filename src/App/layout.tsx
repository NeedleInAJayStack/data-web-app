import type { Metadata } from 'next'
import type { Viewport } from 'next'
import React from 'react'

import '../index.css'
 
export const viewport: Viewport = {
  themeColor: '#000000',
}
 
export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{width:"100%", height:"100%"}}>
      <head>
        <title>Utility Input</title>
      </head>
      <body style={{width:"100%", height:"100%"}}>
        <div id="root" style={{width:"100%", height:"100%"}}>{children}</div>
      </body>
    </html>
  )
}