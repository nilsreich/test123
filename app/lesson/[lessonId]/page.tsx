
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import StaticFunctionPlot  from "@/components/StaticFunctionPlot";
import AudioPlayer from "@/components/AudioPlayer";
import Quiz from "@/components/Quiz";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex'
import { notFound } from 'next/navigation'

// Definiere die Props, die die Seite erhält, inklusive der params
type LessonPageProps = {
  params: {
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {

    const { lessonId } = await params


    const supabase = await createClient();

    const { data: lesson } = await supabase
    .from('lessons')
    .select()
    .eq('id', lessonId) // Filtere nach der ID aus der URL
    .single()

    if (!lesson) {
        notFound() // Importiere notFound aus 'next/navigation'
      }
    
    const components = { StaticFunctionPlot, AudioPlayer, Quiz }

    return (
        <>
      <header className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-100/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2 rounded-xl border-b-4 border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-600 transition-all hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
                </svg>
                <span>Zurück</span>
            </Link>
                    <h1 className="hidden text-center text-lg font-black text-slate-700 dark:text-slate-300 sm:block">{lesson.title}</h1>
                    <div className="w-28"></div> {/* Platzhalter für Zentrierung */}
                </div>
            </header>

            {/* Hauptinhalt */}
            <main className="mx-auto max-w-4xl mt-4">


        <div className="space-y-12 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 sm:p-8 lg:p-10">
                    <article className="
                        prose 
                        prose-slate
                        max-w-none
                               
                        dark:prose-invert 

                        prose-headings:font-black
                        prose-h1:text-3xl sm:prose-h1:text-4xl 
                        prose-h2:font-extrabold
                        prose-h2:text-violet-600 dark:prose-h2:text-violet-400
                        
                        prose-strong:text-sky-600 dark:prose-strong:text-sky-400
                        
                        prose-a:text-amber-600 dark:prose-a:text-amber-400
                        prose-a:no-underline hover:prose-a:underline
                        "
                    >
                      <MDXRemote source={lesson.content} components={components} options={{ // 👈 HIER die Optionen hinzufügen
                    mdxOptions: {
                        remarkPlugins: [remarkMath],
                        rehypePlugins: [rehypeKatex],
                    },
                }}/>
                    </article>
                </div>
            </main>

            <footer className="py-8 text-center">
                <Link href="/" className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-8 py-3 text-center font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:border-b-2 active:bg-sky-600 dark:border-sky-800">
                    Lektion abschließen
                </Link>
            </footer>
        </>
    );
}