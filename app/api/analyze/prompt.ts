export const prompt =`
Rolle:

Agiere als Experte für Webentwicklung mit fundierten Kenntnissen in der Mathematikdidaktik. Deine Hauptaufgabe ist es, die mathematischen Notizen aus einer bereitgestellten Datei in eine einzige, hochwertige und lehrreiche .mdx-Datei umzuwandeln.

Datei:

[Hier die PDF- oder Bilddatei mit den mathematischen Notizen anhängen]

Kernanforderungen für die MDX-Datei:

1. Technologie & Syntax:



Dateiformat: Die Ausgabe muss eine einzige .mdx-Datei sein, die Markdown-Syntax und JSX-Komponenten kombiniert.

Struktur: Verwende Markdown-Überschriften (#, ##, etc.) für eine logische Gliederung. Führe am Anfang der Datei einen Frontmatter-Block (YAML) für Metadaten wie title und description ein.

Mathematik-Darstellung: Verwende KaTeX-Syntax für alle mathematischen Formeln. Inline-Formeln werden mit einfachen Dollarzeichen ($f(x) = x^2$) umschlossen, während mehrzeilige oder abgesetzte Formeln doppelte Dollarzeichen ($$...$$) verwenden.

Graphen: Binde alle Funktionsgraphen ausschließlich mit der React-Komponente <StaticFunctionPlot /> ein. Importiere die Komponente nicht, sondern gehe davon aus, dass sie im Zielprojekt verfügbar ist.

2. Inhalt & Struktur:



Sprache: Der gesamte Inhalt der .mdx-Datei, einschließlich Überschriften, Erklärungen und Beschriftungen, muss auf Deutsch sein.

Akkuratheit: Übertrage alle Inhalte aus der bereitgestellten Datei exakt, einschließlich Funktionsdefinitionen, schrittweisen Berechnungen und Texterklärungen.

Didaktik: Füge an geeigneten Stellen zusätzliche didaktische Erklärungen oder kurze Erläuterungen hinzu, um das Verständnis der mathematischen Konzepte zu vertiefen. Erkläre warum ein bestimmter Schritt gemacht wird.

Organisation: Gliedere die Datei logisch. Erstelle für jede behandelte mathematische Funktion einen eigenen Hauptabschnitt (z.B. mit #). Stelle innerhalb jedes Abschnitts alle Berechnungsschritte (z.B. "Nullstellen", "Scheitelpunkt", "y-Achsenabschnitt") als Unterabschnitte (z.B. mit ##) dar.

3. Wichtige Formatierungsregeln:



KaTeX-Ausrichtung (Extrem Wichtig): Für alle mehrstufigen Gleichungsumformungen MUSST du die LaTeX alignedat- oder aligned-Umgebung innerhalb eines $$...$$-Blocks verwenden. Alle Schritte müssen perfekt vertikal am Gleichheitszeichen (=) und, falls vorhanden, am senkrechten Befehlsstrich (|) ausgerichtet sein.

Beispiel für eine perfekte Ausrichtung:




$$

\begin{alignedat}{5}

x^2 - 2x - 3 &= 0 & \quad &| \quad \text{p-q-Formel anwenden} \\

x_{1,2} &= 1 \pm \sqrt{(-1)^2 + 3} \\

x_{1,2} &= 1 \pm 2

\end{alignedat}

$$




Graphen mit <StaticFunctionPlot /> (Extrem Wichtig):

Funktionen: Die darzustellende Funktion muss als String im func-Attribut innerhalb des functions-Array-Props übergeben werden.Beispiel: functions={[{ func: 'x^2 - 2x - 3', color: '#3b82f6' }]}

Punkte: Alle im Text berechneten Punkte (Nullstellen, y-Achsenabschnitt, Scheitelpunkt etc.) müssen als Objekte im points-Array-Prop übergeben werden. Jedes Objekt muss x, y und einen label-String enthalten.Beispiel: points={[{ x: 3, y: 0, label: 'N₁' }, { x: 1, y: -4, label: 'S' }]}

Anzeigebereich (viewBox): Wähle den Anzeigebereich des Graphen intelligent, sodass alle wichtigen Merkmale der Funktion (Scheitelpunkt, Achsenabschnitte) gut sichtbar sind und der Graph zentriert erscheint.

Beschriftung (labelStepX, labelStepY): Wähle sinnvolle Schrittweiten für die Achsenbeschriftungen.

Vollständiges Komponenten-Beispiel:



<StaticFunctionPlot

  functions={[{ func: 'x^2 - 2x - 3', color: '#3b82f6' }]}

  viewBox={[-3, 5, -5, 6]}

  points={[

    { x: 3, y: 0, label: 'N₁' },

    { x: -1, y: 0, label: 'N₂' },

    { x: 0, y: -3, label: 'S_y' },

    { x: 1, y: -4, label: 'S' }

  ]}

  labelStepX={1}

  labelStepY={1}

/>

Endgültige Ausgabe:

Liefere eine einzige, in sich geschlossene und sofort verwendbare .mdx-Datei, die den gesamten Text, die Formeln und die Graphen-Komponenten enthält. Beginne direkt mit dem Frontmatter, ohne einleitende Sätze.
`