import { createClient } from "@/lib/supabase/server";
import Link from 'next/link'

// --- Komponenten für die Icons (zur besseren Lesbarkeit ausgelagert) ---

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A9.707 9.707 0 0 0 6 21a9.735 9.735 0 0 0 3.25-.555.75.75 0 0 0 .5-.707V5.24a.75.75 0 0 0-1-.707Z" />
    <path d="M12.75 4.533A9.707 9.707 0 0 0 18 3a9.735 9.735 0 0 0 3.25.555.75.75 0 0 0 .5.707v14.25a.75.75 0 0 0-1 .707A9.707 9.707 0 0 0 18 21a9.735 9.735 0 0 0-3.25-.555.75.75 0 0 0-.5-.707V5.24a.75.75 0 0 0 1-.707Z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
  </svg>
);

const CircleCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-6 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const HomeworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.451.218 2.476 1.483 2.476 2.917v6.03a3 3 0 0 1-3 3h-1.25a.75.75 0 0 1 0-1.5h1.25a1.5 1.5 0 0 0 1.5-1.5v-6.03c0-.818-.521-1.54-1.257-1.764a48.543 48.543 0 0 0-2.436-.338A3 3 0 0 1 13.5 6.25H12a3 3 0 0 1-3-3V5.25Zm-4 0a3 3 0 0 1 3-3h.75a.75.75 0 0 1 0 1.5H7.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h7.5a1.5 1.5 0 0 0 1.5-1.5v-3.75a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3V5.25Z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6v-1.5A.75.75 0 0 1 6.75 2.25Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
  </svg>
);


// --- Hauptkomponente für die Seite ---
export default async function LernDashboardPage() {
  const supabase = await createClient();

  // Das 'await' kommt vor die gesamte Abfrage
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('id', { ascending: true });

  // Optional, aber empfohlen: explizite Fehlerbehandlung
  if (error) {
    console.error('Fehler beim Laden der Lektionen:', error);
    // Hier könntest du eine spezielle Fehlermeldung an den Nutzer zurückgeben
    return <p>Ein Fehler ist aufgetreten.</p>;
  }

  // Dein Fallback ist weiterhin korrekt und wichtig
  if (!lessons) {
    return <p>Lektionen konnten nicht geladen werden.</p>;
  }


  return (
    // Die äußeren Tags wie <html> und <body> werden von Next.js im layout.tsx gerendert.
    // Wir beginnen direkt mit unserem sepcifischen Inhalt.
    <>
      {/* Header / Navigation */}
      <header className="mx-auto flex max-w-5xl items-center justify-between p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Mathematik</h1>
          <p className="text-sm font-bold text-sky-500 dark:text-sky-400">Dein aktueller Kurs</p>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-110 dark:bg-slate-800">
          <div className="relative h-8 w-8 rounded-full">M</div>
        </button>
      </header>

      {/* Main Content Grid */}
      <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 md:grid-cols-3">

        {/* Linke Spalte: Lektionen */}
        <section className="md:col-span-2">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <header className="flex items-center gap-3 border-b-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex-shrink-0 text-violet-500">
                <BookIcon />
              </div>
              <h2 className="text-lg font-black tracking-wide text-slate-700 dark:text-slate-300">Lektionen</h2>
            </header>
            {/* 2. Über die geladenen Lektionen iterieren */}
            <div className="divide-y-2 divide-slate-200 dark:divide-slate-700">
            {lessons.slice().reverse().map((lesson, index) => (
                lesson.status === 'completed' ? (
                  // Abgeschlossene Lektion
                  <article key={lesson.id} className="group flex cursor-pointer items-center gap-4 bg-lime-50/50 p-4 transition-colors duration-300 hover:bg-lime-100/70 dark:bg-lime-900/20 dark:hover:bg-lime-900/40">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-lime-400 text-white dark:bg-lime-500">
                      <CheckIcon />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-400 dark:text-slate-500">{lesson.title}</p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">Abgeschlossen</p>
                    </div>
                  </article>
                ) : (
                  // Aktive Lektion
                  <Link href={`/lesson/${lesson.id}`} key={lesson.id}>
                    <article className="group flex cursor-pointer items-center gap-4 p-4 transition-colors duration-300 hover:bg-violet-50 dark:hover:bg-slate-700/50">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl font-extrabold text-violet-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-violet-900/50 dark:text-violet-400">
                        {lesson.id}</div>
                      <div className='flex-grow'>
                        <p className="font-extrabold text-slate-800 dark:text-slate-100">{lesson.title}</p>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Jetzt starten!</p>
                      </div>
                      <div className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                        <ChevronRightIcon /></div>
                    </article>
                  </Link>
                )
              ))}
            </div>

            <div className="p-4">
              <button className="w-full rounded-2xl border-b-4 border-sky-700 bg-sky-500 py-3 text-center font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:border-b-2 active:bg-sky-600 dark:border-sky-800">
                Alle Lektionen
              </button>
            </div>
          </div>
        </section>

        {/* Rechte Spalte: Hausaufgaben & Termine */}
        <aside className="flex flex-col gap-6">

          {/* Hausaufgaben Card */}
          <div className="rounded-3xl border-2 border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <header
              id="homework-toggle"
              className="flex cursor-pointer items-center justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-sky-500">
                  <HomeworkIcon />
                </div>
                <h2 className="text-lg font-black tracking-wide text-slate-700 dark:text-slate-300">Hausaufgaben</h2>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor"
                className="size-4 text-slate-500 transition-transform duration-300 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </header>
            <div
              id="homework-content"
              className="grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[1fr]"
            >
              <div className="overflow-hidden">
                <div className="border-t-2 border-slate-200 p-4 font-bold dark:border-slate-700">
                  <p>Buch Seite 30, Nummer 1 und 2</p>
                </div>
              </div>
            </div>
          </div>

          {/* Termine Card */}
          <div className="rounded-3xl border-2 border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <header className="flex items-center gap-3 p-4">
              <div className="flex-shrink-0 text-amber-500">
                <CalendarIcon />
              </div>
              <h2 className="text-lg font-black tracking-wide text-slate-700 dark:text-slate-300">Termine</h2>
            </header>
            <div className="border-t-2 border-slate-200 p-4 font-bold dark:border-slate-700">
              <p>03.10 - Klassenarbeit</p>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}