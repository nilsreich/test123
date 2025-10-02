'use client'

import StaticFunctionPlot from '@/components/StaticFunctionPlot'
import AudioPlayer from '@/components/AudioPlayer'
import Quiz from '@/components/Quiz'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // Stellt sicher, dass KaTeX-CSS importiert wird

// HINWEIS: Bevor du diese Komponente verwendest, stelle sicher, dass du die notwendigen Pakete installiert hast:
// npm install @mdx-js/mdx remark-math remark-gfm rehype-katex katex
// oder
// yarn add @mdx-js/mdx remark-math remark-gfm rehype-katex katex

const initialMarkdown = `# Willkommen beim MDX Editor

## Features
- **Fett** und *kursiv*
- Listen und Aufgabenlisten
- Code-Blöcke mit Syntax-Highlighting
- Mathematische Formeln mit KaTeX

### Beispiel für Mathematik
Inline-Formel: $E = mc^2$

Block-Formel:
$$\\int_a^b f(x) \\, dx = F(b) - F(a)$$

### Aufgabenliste
- [x] Design aus HTML übernehmen
- [x] MDX-Funktionalität implementieren
- [ ] Weltherrschaft an sich reißen

### Code-Block
\`\`\`javascript
function greet(name) {
  // Eine einfache Begrüßung
  console.log(\`Hallo, \${name}!\`);
}

greet('Mika');
\`\`\`
`
const components = {
    StaticFunctionPlot,
    AudioPlayer,
    Quiz,
}

export default function MarkdownEditorPage() {
    const [markdown, setMarkdown] = useState(initialMarkdown)
    const [debouncedMarkdown, setDebouncedMarkdown] = useState(initialMarkdown)
    const [content, setContent] = useState<React.ReactElement | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isCompiling, setIsCompiling] = useState(false)
    const [activeTab, setActiveTab] = useState('write') // 'write' oder 'preview'
    
    // Refs für Scroll-Synchronisation
    const editorRef = useRef<HTMLTextAreaElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const isEditorScrollingRef = useRef(false)
    const isPreviewScrollingRef = useRef(false)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    // Memoize components object to prevent unnecessary re-renders
    const memoizedComponents = useMemo(() => components, [])

    // Debounce markdown changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedMarkdown(markdown)
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [markdown])

    useEffect(() => {
        let isCurrent = true
        
        const compileAndRender = async () => {
            setIsCompiling(true)
            setError(null)
            
            try {
                const { default: MDXContent } = await evaluate(debouncedMarkdown, {
                    ...runtime,
                    remarkPlugins: [remarkMath, remarkGfm],
                    rehypePlugins: [rehypeKatex],
                    development: false,
                } as any)

                if (isCurrent) {
                    setContent(<MDXContent components={memoizedComponents} />)
                }
            } catch (err) {
                if (isCurrent) {
                    const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Kompilierungsfehler ist aufgetreten.'
                    // Bereinige die Fehlermeldung für eine bessere Lesbarkeit
                    setError(errorMessage.split('\n')[0].replace(/\[\d+:\d+-\d+:\d+\]\s?/, ''));
                }
            } finally {
                if (isCurrent) {
                    setIsCompiling(false)
                }
            }
        }

        compileAndRender()

        return () => {
            isCurrent = false
        }
    }, [debouncedMarkdown, memoizedComponents])

    // Scroll-Synchronisation
    const syncScroll = useCallback((source: 'editor' | 'preview') => {
        if (!editorRef.current || !previewRef.current) return

        if (source === 'editor' && !isPreviewScrollingRef.current) {
            isEditorScrollingRef.current = true
            const editor = editorRef.current
            const preview = previewRef.current
            
            const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
            preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
            scrollTimeoutRef.current = setTimeout(() => {
                isEditorScrollingRef.current = false
            }, 100)
        } else if (source === 'preview' && !isEditorScrollingRef.current) {
            isPreviewScrollingRef.current = true
            const editor = editorRef.current
            const preview = previewRef.current
            
            const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
            editor.scrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight)

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
            scrollTimeoutRef.current = setTimeout(() => {
                isPreviewScrollingRef.current = false
            }, 100)
        }
    }, [])

    const handleTabClick = useCallback((tab: 'write' | 'preview') => {
        setActiveTab(tab)
    }, [])

    type TabName = 'write' | 'preview'

    interface TabButtonClassesParams {
        tabName: TabName
    }

    const getTabButtonClasses = (tabName: TabName): string => {
        const isActive = activeTab === tabName
        if (isActive) {
            return 'flex-1 rounded-xl border-b-4 border-violet-700 bg-violet-500 py-2 text-center font-extrabold text-white'
        }
        return 'flex-1 rounded-xl border-b-2 border-slate-300 bg-slate-200 py-2 text-center font-extrabold text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400'
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <header className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">MDX Editor</h1>
                    <p className="text-sm font-bold text-sky-500 dark:text-sky-400">Dein kreativer Arbeitsbereich</p>
                </div>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-110 dark:bg-slate-800">
                    <img src="https://placehold.co/48x48/6366f1/ffffff?text=M" alt="Profil von Mika" className="rounded-full" />
                </button>
            </header>

            <main className="mx-auto max-w-7xl p-4 sm:p-6">
                <div className="mb-4 flex gap-2 md:hidden">
                    <button onClick={() => handleTabClick('write')} className={getTabButtonClasses('write')}>
                        Schreiben
                    </button>
                    <button onClick={() => handleTabClick('preview')} className={getTabButtonClasses('preview')}>
                        Vorschau
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Linke Spalte: Markdown Eingabe */}
                    <section className={`h-[60vh] min-h-[400px] flex-col overflow-hidden rounded-3xl border-2 border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 md:h-[70vh] ${activeTab === 'write' ? 'flex' : 'hidden'} md:flex`}>
                        <header className="flex flex-shrink-0 items-center gap-3 border-b-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            <div className="flex-shrink-0 text-violet-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-black tracking-wide text-slate-700 dark:text-slate-300">Markdown Eingabe</h2>
                            {markdown !== debouncedMarkdown && (
                                <span className="ml-auto text-sm text-amber-500 dark:text-amber-400">Wartet...</span>
                            )}
                            {isCompiling && (
                                <span className="ml-auto text-sm text-violet-500 dark:text-violet-400">Kompiliert...</span>
                            )}
                        </header>
                        <div className="flex-grow p-4">
                            <textarea
                                ref={editorRef}
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                onScroll={() => syncScroll('editor')}
                                className="h-full w-full resize-none border-none bg-transparent text-base text-slate-700 outline-none dark:text-slate-300"
                                style={{fontFamily: 'monospace'}}
                                placeholder="Schreib hier deinen Text..."
                                spellCheck="false"
                            />
                        </div>
                    </section>

                    {/* Rechte Spalte: Gerenderter Output (Vorschau) */}
                    <section className={`h-[60vh] min-h-[400px] flex-col overflow-hidden rounded-3xl border-2 border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 md:h-[70vh] ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex`}>
                        <header className="flex flex-shrink-0 items-center gap-3 border-b-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            <div className="flex-shrink-0 text-sky-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.946V16.5a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.673c0-1.453 1-2.707 2.429-2.946A48.62 48.62 0 0 1 7.5 6.466c.47-.067.875-.327 1.11-.71l.822-1.317a2.25 2.25 0 0 1 2.332-1.39ZM14.25 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-black tracking-wide text-slate-700 dark:text-slate-300">Vorschau</h2>
                        </header>
                        <div 
                            ref={previewRef}
                            className="prose prose-slate max-w-none flex-grow overflow-y-auto p-6 dark:prose-invert"
                            onScroll={() => syncScroll('preview')}
                        >
                            {error ? (
                                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                    <h3 className="font-bold text-red-800 dark:text-red-400">Kompilierungsfehler:</h3>
                                    <pre className="mt-2 whitespace-pre-wrap text-sm text-red-600 dark:text-red-300" style={{fontFamily: 'monospace'}}>
                                        {error}
                                    </pre>
                                </div>
                            ) : content}
                        </div>
                    </section>
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="w-full max-w-sm rounded-2xl border-b-4 border-lime-700 bg-lime-500 py-3 text-center font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:border-b-2 active:bg-lime-600 dark:border-lime-800">
                        Speichern
                    </button>
                </div>
            </main>
        </div>
    )
}
