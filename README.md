# Praxiskauf-Analyse – Hausarztpraxis

Ein interaktives Tool zur **wirtschaftlichen Analyse beim Kauf einer Hausarztpraxis**.
Du gibst die Eckdaten der Zielpraxis ein und erhältst sofort eine fundierte
Einschätzung zu Bewertung, Wirtschaftlichkeit, Finanzierung und Risiko.

## Funktionen

- **Bewertung** der Praxis nach der modifizierten Ertragswertmethode
  (in Anlehnung an die Hinweise der Bundesärztekammer): übertragbarer Gewinn ×
  Prognose-Faktor + Substanzwert.
- **Wirtschaftlichkeit**: Praxisgewinn, Umsatzrendite, Kostenstruktur und
  Umsatz je Fall.
- **Finanzierung**: Darlehensbedarf, Annuität (Kapitaldienst),
  Kapitaldienstdeckung und verfügbares Einkommen nach Tilgung.
- **Bewertungs-Ampel** mit Gesamt-Score und Kauf-/Verhandlungs-/Vorsicht-Empfehlung.
- **Preisvergleich**: gezahlter Kaufpreis gegen fairen Ertragswert.
- **Due-Diligence-Checkliste** (wirtschaftlich, rechtlich, Personal, Räume/Technik)
  mit Fortschrittsanzeige.
- Währung **€ / CHF** umschaltbar, druckbarer Bericht, Eingaben werden lokal
  im Browser gespeichert (kein Backend, keine Datenübertragung).

## Tech-Stack

React 19 · TypeScript · Vite · Tailwind CSS · lucide-react

## Entwicklung

```bash
pnpm install
pnpm dev       # Entwicklungsserver
pnpm build     # Produktions-Build
pnpm preview   # Build lokal ansehen
```

## Struktur

| Datei              | Inhalt                                              |
| ------------------ | --------------------------------------------------- |
| `src/types.ts`     | Datenmodell (Eingaben & Analyse-Ergebnis)           |
| `src/analysis.ts`  | Berechnungslogik, Standardwerte, Bewertungs-Ampel   |
| `src/App.tsx`      | Benutzeroberfläche                                  |

## Hinweis

Das Tool dient der Orientierung und ersetzt keine steuer-, rechts- oder
wirtschaftsberatende Prüfung.
