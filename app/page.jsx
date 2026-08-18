import Link from 'next/link'
import { ArrowUpRight, Braces, Database, Regex, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

const tools = [
  { href: '/data-architect', icon: Braces, kicker: '01 / STRUCTURE', title: 'Mock Data Architect', description: 'Turn a plain-English brief into realistic, schema-aware JSON for your next prototype.', accent: 'text-primary', tag: 'JSON' },
  { href: '/regex-builder', icon: Regex, kicker: '02 / PATTERNS', title: 'Plain-English Regex', description: 'Describe the pattern you need. Get a tested expression with a live matching playground.', accent: 'text-amber-300', tag: 'REGEX' },
  { href: '/sql-architect', icon: Database, kicker: '03 / QUERIES', title: 'SQL Query Architect', description: 'Move from schema and intent to a clean query and a readable execution plan.', accent: 'text-sky-300', tag: 'SQL' },
]

export default function Page() {
  return <SiteShell><main>
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="tool-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="reveal max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"><span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_currentColor]" /> Built for the flow state</div>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] sm:text-7xl lg:text-8xl">Ideas in.<br /><span className="text-muted-foreground">Useful code out.</span></h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">A small, sharp toolkit for the moments between thinking and shipping. Generate data, shape patterns, and architect queries without leaving your flow.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/data-architect" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_22px_rgba(103,232,208,0.14)] transition hover:brightness-110">Open the toolkit <ArrowUpRight className="size-4" /></Link><span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-4 py-2.5 font-mono text-xs text-muted-foreground"><Zap className="size-3.5 text-primary" /> No setup required</span></div>
        </div>
        <div className="reveal reveal-delay-1 mt-20 grid max-w-xl grid-cols-3 gap-6 border-t border-border/70 pt-5 font-mono text-xs text-muted-foreground"><span><strong className="block text-lg font-medium text-foreground">03</strong> focused tools</span><span><strong className="block text-lg font-medium text-foreground">0ms</strong> context switching</span><span><strong className="block text-lg font-medium text-foreground">∞</strong> possibilities</span></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">The toolkit</p><h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Choose your starting point.</h2></div><p className="max-w-sm text-sm leading-6 text-muted-foreground">Focused utilities for the awkward gap between an idea and a working implementation.</p></div><div className="grid gap-4 lg:grid-cols-3">{tools.map(({ href, icon: Icon, kicker, title, description, accent, tag }, index) => <Link key={href} href={href} className={`reveal reveal-delay-${index + 1} group surface-glow flex min-h-72 flex-col justify-between rounded-xl border border-border bg-card/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card`}><div><div className="mb-10 flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-lg border border-border bg-secondary/70 ${accent}`}><Icon className="size-5" /></span><span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">{tag}</span></div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{kicker}</p><h3 className="mt-3 text-xl font-medium tracking-tight group-hover:text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></div><div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground"><span className="font-mono">Open workspace</span><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div></Link>)}</div></section>
    <section className="border-t border-border/70 bg-card/30"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-3"><ShieldCheck className="size-4 text-primary" /><span className="text-muted-foreground">Fast, private, and designed to stay out of your way.</span></div><div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground"><Sparkles className="size-3.5 text-primary" /> Made for makers</div></div></section>
  </main></SiteShell>
}
