'use client'
import { useMemo, useState } from 'react'
import { ToolFrame } from '@/components/site-shell'
import { ActionButton, ErrorBanner, GenerateLabel, Panel } from '@/components/tool-ui'

export default function RegexBuilder() {
  const [prompt, setPrompt] = useState('Match a valid US phone number with optional country code and dashes like +1-555-0199 or 555-0199');
  const [regexString, setRegexString] = useState('/(?:\\+?1[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/gi');
  const [explanation, setExplanation] = useState('Matches standard US phone numbers with optional country code (+1), optional area code parentheses, and dashes, dots, or spaces separating numbers.');
  const [sample, setSample] = useState(`Contact Support:\n- Primary: +1-555-0199\n- Direct: 555-0199\n- Toll Free: 1-800-555-0199\n- Office: (555) 012-3456\n\nInvalid:\n- Bad char: 555-019s\n- Too short: 555-01`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRegexString(data.regexString);
      setExplanation(data.explanation);
      if (data.sampleText) {
        setSample(data.sampleText);
      }
    } catch (e) {
      setError(e.message || 'Could not generate a regex.');
    } finally {
      setLoading(false);
    }
  };

  const highlighted = useMemo(() => {
    if (!regexString || !sample) return sample;
    try {
      const flagsMatch = regexString.match(/\/([a-z]*)$/);
      const rawFlags = flagsMatch ? flagsMatch[1] : 'gi';
      const flags = rawFlags.includes('g') ? rawFlags : rawFlags + 'g';
      let pattern = regexString.replace(/^\/(.*)\/[a-z]*$/, '$1');
      if (!pattern) return sample;

      // Strip leading ^ and trailing $ so inline search matches inside sample text paragraphs
      pattern = pattern.replace(/^\^/, '').replace(/\$$/, '');

      const re = new RegExp(pattern, flags);
      const matches = [...sample.matchAll(re)];
      if (matches.length === 0) return sample;

      const parts = [];
      let lastIndex = 0;

      matches.forEach((m, i) => {
        const matchText = m[0];
        if (!matchText) return;
        const matchIndex = m.index;
        if (matchIndex > lastIndex) {
          parts.push(sample.slice(lastIndex, matchIndex));
        }
        parts.push(
          <mark key={`m-${i}`} className="rounded bg-emerald-500/30 px-1 py-0.5 font-bold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)] border border-emerald-400/40">
            {matchText}
          </mark>
        );
        lastIndex = matchIndex + matchText.length;
      });

      if (lastIndex < sample.length) {
        parts.push(sample.slice(lastIndex));
      }
      return parts;
    } catch (err) {
      return sample;
    }
  }, [regexString, sample]);

  return (
    <ToolFrame eyebrow="02 / plain-English regex" title="Make patterns readable." description="Start with intent, not punctuation. Generate a regular expression, understand every piece, and test it against real text instantly.">
      <ErrorBanner message={error} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <Panel title="Pattern brief" meta="describe the match">
          <div className="flex flex-col gap-4 p-5">
            <label htmlFor="regex-prompt" className="font-mono text-xs text-muted-foreground">What should this pattern match?</label>
            <textarea id="regex-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} className="min-h-32 resize-y rounded-lg border border-input bg-background/70 p-4 text-sm leading-6 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring" />
            <div className="flex justify-end border-t border-border/60 pt-4">
              <ActionButton onClick={generate} disabled={loading || !prompt.trim()}>
                <GenerateLabel />
              </ActionButton>
            </div>
          </div>
        </Panel>
        <div className="flex flex-col gap-5">
          <Panel title="Expression" meta="generated regex">
            <div className="bg-[#0c1113] p-5">
              <code className="block break-all font-mono text-lg leading-8 text-primary">{regexString || <span className="text-sm text-muted-foreground">Generate a pattern to inspect it here.</span>}</code>
              {explanation && <p className="mt-4 border-t border-border/60 pt-4 text-sm leading-6 text-muted-foreground">{explanation}</p>}
            </div>
          </Panel>
          <Panel title="Live playground" meta="matches highlighted">
            <div className="flex flex-col gap-4 p-5">
              <label htmlFor="regex-sample" className="font-mono text-xs text-muted-foreground">Test text</label>
              <textarea id="regex-sample" value={sample} onChange={e => setSample(e.target.value)} className="min-h-28 resize-y rounded-lg border border-input bg-background/70 p-4 font-mono text-sm leading-6 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring" />
              <div className="whitespace-pre-wrap rounded-lg border border-border bg-[#0c1113] p-4 font-mono text-sm leading-7 text-muted-foreground">
                {highlighted}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </ToolFrame>
  );
}
