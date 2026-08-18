'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Braces, Database, Hexagon, Menu, Regex, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/data-architect', label: 'Data Architect', short: 'DATA', icon: Braces },
  { href: '/regex-builder', label: 'Regex Builder', short: 'REGEX', icon: Regex },
  { href: '/sql-architect', label: 'SQL Architect', short: 'SQL', icon: Database },
]

export function SiteShell({ children }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-transform group-hover:rotate-6">
              <Hexagon className="size-5" strokeWidth={2.5} />
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight">DevToolkit<span className="text-primary">/</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return <Link key={href} href={href} className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${active ? 'border-primary/25 bg-primary/10 text-foreground' : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground'}`}><Icon className={`size-3.5 ${active ? 'text-primary' : ''}`} />{label}</Link>
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:flex"><Activity className="size-3 text-primary" /> ready</span>
            <button className="rounded-lg border border-transparent p-2 text-muted-foreground transition hover:border-border hover:bg-secondary md:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
          </div>
        </div>
        {open && <nav className="flex flex-col gap-1 border-t border-border/70 px-5 py-3 md:hidden" aria-label="Mobile navigation">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><Icon className="size-4" />{label}</Link>)}</nav>}
      </header>
      {children}
      <footer className="border-t border-border/70 py-8"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="font-mono">DevToolkit <span className="text-primary">/</span> 2026</span><span className="font-mono text-[11px]">Small tools. Serious leverage.</span></div></footer>
    </div>
  )
}

export function ToolFrame({ eyebrow, title, description, children }) {
  return <SiteShell><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14"><div className="reveal mb-10 max-w-3xl"><div className="mb-4 flex items-center gap-3"><span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{eyebrow}</span><span className="h-px w-12 bg-primary/30" /></div><h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">{description}</p></div>{children}</main></SiteShell>
}

export const toolLinks = links
