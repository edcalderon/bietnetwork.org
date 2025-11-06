import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Red Biet - BietNetwork',
  description: 'Red descentralizada de unidades vivas que generan valor social, económico y ecológico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
