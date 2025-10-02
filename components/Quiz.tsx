'use client'; // Diese Komponenten sind interaktiv und laufen im Browser

import React, { useRef, useEffect, useState } from 'react'; 


// 3. Quiz Komponente
const quizData = {
    question: "Was ist der Scheitelpunkt der Funktion $f(x) = 2x^2 + 2x - 12$?",
    options: [
        { text: "$S(0.5 | -12.5)$", isCorrect: false },
        { text: "$S(-0.5 | -12.5)$", isCorrect: true },
        { text: "$S(-1 | -12)$", isCorrect: false },
        { text: "$S(2 | 0)$", isCorrect: false }
    ]
};

const Quiz = () => {
    const [selection, setSelection] = useState<{ index: number; isCorrect: boolean } | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswer = (isCorrect: boolean, index: number) => {
        setSelection({ index, isCorrect });
        setShowFeedback(true);
    };
    
    const scrollToFooter = () => {
        document.getElementById('lesson-footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="space-y-6">
            <header className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Wissens-Check</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: quizData.question.replace(/\$/g, '') }}/>
            </header>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quizData.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(option.isCorrect, index)}
                        disabled={showFeedback}
                        className={`quiz-option rounded-xl border-b-4 p-4 text-left font-extrabold transition-all hover:-translate-y-0.5 active:translate-y-0 active:border-b-2
                            ${showFeedback ? "cursor-not-allowed" : ""}
                            ${selection?.index === index ? (selection.isCorrect ? 'bg-emerald-500 border-emerald-700 text-white' : 'bg-red-500 border-red-700 text-white') : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'}
                            ${showFeedback && option.isCorrect && 'bg-emerald-500 border-emerald-700 text-white'}
                        `}
                        dangerouslySetInnerHTML={{ __html: option.text.replace(/\$/g, '') }}
                    />
                ))}
            </div>
            
            {showFeedback && (
                <div className={`mt-6 rounded-2xl border-t-4 p-6 text-center
                    ${selection?.isCorrect ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700' : 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700'}`}
                >
                    <p className={`text-2xl font-black ${selection?.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {selection?.isCorrect ? "Richtig! Super gemacht." : "Leider falsch. Versuch es bei der nächsten Aufgabe nochmal!"}
                    </p>
                    <button onClick={scrollToFooter} className="mt-4 rounded-2xl border-b-4 border-slate-700 bg-slate-500 px-8 py-3 text-center font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:border-b-2 active:bg-slate-600">
                        Weiter
                    </button>
                </div>
            )}
        </section>
    );
};

export default Quiz