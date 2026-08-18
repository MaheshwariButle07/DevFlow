import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata = { title: 'DevToolkit — Useful code, faster', description: 'AI-powered tools for modern developers: generate data, build regex, and architect SQL.', generator: 'DevToolkit' }
export const viewport = { colorScheme: 'dark', themeColor: '#0b0d0f', userScalable: false }
export default function RootLayout({ children }) { return <html lang="en" className="dark bg-background"><body className={`${geist.variable} ${geistMono.variable} antialiased`}>{children}</body></html> }
