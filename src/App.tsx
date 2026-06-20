import { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  Calculator,
  TrendingUp,
  Wallet,
  Scale,
  ClipboardCheck,
  Building2,
  Users,
  Banknote,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Printer,
  Info,
} from "lucide-react";
import { Analysis, Ampel, Currency, PracticeInputs } from "./types";
import { analysieren, DEFAULT_INPUTS } from "./analysis";

// ------------------------------------------------------------------
// Formatierung
// ------------------------------------------------------------------
const SYMBOL: Record<Currency, string> = { EUR: "€", CHF: "CHF" };

function geld(n: number, w: Currency): string {
  const v = Math.round(n).toLocaleString("de-DE");
  return w === "EUR" ? `${v} €` : `CHF ${v}`;
}

// ------------------------------------------------------------------
// LocalStorage
// ------------------------------------------------------------------
const STORAGE_KEY = "praxiskauf-analyse-v1";

function ladeInputs(): PracticeInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_INPUTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_INPUTS;
}

// ------------------------------------------------------------------
// Due-Diligence-Checkliste
// ------------------------------------------------------------------
const DUE_DILIGENCE: { kategorie: string; punkte: string[] }[] = [
  {
    kategorie: "Wirtschaftlich",
    punkte: [
      "BWA & Jahresabschlüsse der letzten 3 Jahre geprüft",
      "Umsatz nach Quartalen & Saisonalität analysiert",
      "Privat-/IGeL-Anteil und Honorarbescheide eingesehen",
      "Offene Forderungen & Verbindlichkeiten geklärt",
    ],
  },
  {
    kategorie: "Recht & Zulassung",
    punkte: [
      "Kassenzulassung / Versorgungsauftrag übertragbar",
      "Nachbesetzungsverfahren (Zulassungsausschuss) eingeplant",
      "Kaufvertrag durch Fachanwalt geprüft",
      "Wettbewerbs-/Konkurrenzklausel des Abgebers vereinbart",
    ],
  },
  {
    kategorie: "Personal",
    punkte: [
      "Arbeitsverträge & Gehälter des MFA-Teams gesichtet",
      "Übernahme der Mitarbeiter (§613a) geklärt",
      "Urlaubs-/Überstunden-Rückstellungen berücksichtigt",
    ],
  },
  {
    kategorie: "Räume & Technik",
    punkte: [
      "Mietvertrag / Laufzeit / Indexierung geprüft",
      "Zustand & Alter der Medizingeräte bewertet",
      "Praxis-IT, KIM/TI-Anbindung & Datenschutz geprüft",
      "Anstehende Investitionen / Sanierungen erfasst",
    ],
  },
];

// ------------------------------------------------------------------
// Kleine UI-Bausteine
// ------------------------------------------------------------------
const AMPEL_FARBE: Record<Ampel, string> = {
  gruen: "bg-emerald-500",
  gelb: "bg-amber-400",
  rot: "bg-rose-500",
};
const AMPEL_TEXT: Record<Ampel, string> = {
  gruen: "text-emerald-700",
  gelb: "text-amber-700",
  rot: "text-rose-700",
};

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1000,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-sm font-medium text-slate-600 mb-1">
        {label}
        {hint && (
          <span title={hint} className="text-slate-400 cursor-help">
            <Info size={13} />
          </span>
        )}
      </span>
      <div className="relative">
        <input
          type="number"
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-800 font-medium"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 mb-1 block">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-800 font-medium"
      />
    </label>
  );
}

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}
    >
      {title && (
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-5">
          <span className="text-teal-600">{icon}</span>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function KPI({
  label,
  value,
  sub,
  accent = "text-slate-900",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

// ------------------------------------------------------------------
// App
// ------------------------------------------------------------------
export default function App() {
  const [input, setInput] = useState<PracticeInputs>(ladeInputs);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  }, [input]);

  const a: Analysis = useMemo(() => analysieren(input), [input]);
  const w = input.waehrung;

  const set = <K extends keyof PracticeInputs>(key: K, val: PracticeInputs[K]) =>
    setInput((prev) => ({ ...prev, [key]: val }));

  const reset = () => {
    setInput(DEFAULT_INPUTS);
    setChecked({});
  };

  // Kostenaufschlüsselung (für Balken)
  const kostenPosten = [
    { label: "Personal", wert: input.personalkosten, farbe: "bg-teal-500" },
    { label: "Material/Labor", wert: input.materialkosten, farbe: "bg-sky-500" },
    { label: "Sonstiges", wert: input.sonstigeKosten, farbe: "bg-indigo-500" },
    { label: "Raum/Miete", wert: input.raumkosten, farbe: "bg-violet-500" },
    { label: "Gewinn", wert: Math.max(0, a.praxisgewinn), farbe: "bg-emerald-500" },
  ];
  const kostenSumme = kostenPosten.reduce((s, p) => s + p.wert, 0) || 1;

  const ddTotal = DUE_DILIGENCE.reduce((s, k) => s + k.punkte.length, 0);
  const ddDone = Object.values(checked).filter(Boolean).length;
  const ddPct = Math.round((ddDone / ddTotal) * 100);

  const empfehlungInfo = {
    kaufen: {
      farbe: "bg-emerald-500",
      text: "Kaufempfehlung",
      beschreibung: "Kennzahlen sprechen für eine Übernahme.",
      icon: <CheckCircle2 size={22} />,
    },
    verhandeln: {
      farbe: "bg-amber-500",
      text: "Nachverhandeln",
      beschreibung: "Solide Basis – am Preis oder den Konditionen arbeiten.",
      icon: <Scale size={22} />,
    },
    vorsicht: {
      farbe: "bg-rose-500",
      text: "Vorsicht",
      beschreibung: "Mehrere Kennzahlen kritisch – genau prüfen.",
      icon: <AlertTriangle size={22} />,
    },
  }[a.empfehlung];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:static">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 text-white p-2 rounded-xl">
              <Stethoscope size={22} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">
                Praxiskauf-Analyse
              </h1>
              <p className="text-xs text-slate-500">
                Wirtschaftlichkeit & Bewertung einer Hausarztpraxis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={input.waehrung}
              onChange={(e) => set("waehrung", e.target.value as Currency)}
              className="text-sm border border-slate-200 rounded-lg px-2 py-2 bg-white font-medium print:hidden"
              aria-label="Währung"
            >
              <option value="EUR">€ EUR</option>
              <option value="CHF">CHF</option>
            </select>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 print:hidden"
            >
              <Printer size={16} /> Drucken
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 print:hidden"
            >
              <RefreshCw size={16} /> Zurücksetzen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ---------------- Eingaben ---------------- */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Stammdaten" icon={<Building2 size={20} />}>
            <div className="space-y-4">
              <TextField
                label="Praxisname"
                value={input.praxisName}
                onChange={(v) => set("praxisName", v)}
              />
              <TextField
                label="Standort"
                value={input.standort}
                onChange={(v) => set("standort", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Goodwill (ideell)"
                  value={input.kaufpreisGoodwill}
                  onChange={(v) => set("kaufpreisGoodwill", v)}
                  suffix={SYMBOL[w]}
                  hint="Ideeller Wert: Patientenstamm, Standort, Ruf"
                />
                <NumberField
                  label="Inventar (materiell)"
                  value={input.kaufpreisInventar}
                  onChange={(v) => set("kaufpreisInventar", v)}
                  suffix={SYMBOL[w]}
                  hint="Substanzwert: Geräte & Einrichtung"
                />
              </div>
              <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm flex justify-between">
                <span className="text-slate-500">Kaufpreis gesamt</span>
                <span className="font-bold text-slate-900">
                  {geld(a.kaufpreisGesamt, w)}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Umsatz & Kosten (pro Jahr)" icon={<Wallet size={20} />}>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Jahresumsatz"
                value={input.jahresumsatz}
                onChange={(v) => set("jahresumsatz", v)}
                suffix={SYMBOL[w]}
              />
              <NumberField
                label="Privat-/IGeL-Anteil"
                value={input.privatanteilProzent}
                onChange={(v) => set("privatanteilProzent", v)}
                suffix="%"
                step={1}
              />
              <NumberField
                label="Personalkosten"
                value={input.personalkosten}
                onChange={(v) => set("personalkosten", v)}
                suffix={SYMBOL[w]}
              />
              <NumberField
                label="Raum/Miete"
                value={input.raumkosten}
                onChange={(v) => set("raumkosten", v)}
                suffix={SYMBOL[w]}
              />
              <NumberField
                label="Material/Labor"
                value={input.materialkosten}
                onChange={(v) => set("materialkosten", v)}
                suffix={SYMBOL[w]}
              />
              <NumberField
                label="Sonstige Kosten"
                value={input.sonstigeKosten}
                onChange={(v) => set("sonstigeKosten", v)}
                suffix={SYMBOL[w]}
              />
            </div>
          </Card>

          <Card title="Bewertung & Finanzierung" icon={<Banknote size={20} />}>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Kalk. Arztlohn"
                value={input.vergleichsArztlohn}
                onChange={(v) => set("vergleichsArztlohn", v)}
                suffix={SYMBOL[w]}
                hint="Vergleichslohn eines angestellten Arztes – Basis der Ertragswertmethode"
              />
              <NumberField
                label="Prognose-Faktor"
                value={input.prognoseFaktor}
                onChange={(v) => set("prognoseFaktor", v)}
                step={0.1}
                hint="Multiplikator für übertragbaren Gewinn (üblich 2,0–2,5)"
              />
              <NumberField
                label="Eigenkapital"
                value={input.eigenkapital}
                onChange={(v) => set("eigenkapital", v)}
                suffix={SYMBOL[w]}
              />
              <NumberField
                label="Zinssatz"
                value={input.zinssatzProzent}
                onChange={(v) => set("zinssatzProzent", v)}
                suffix="%"
                step={0.1}
              />
              <NumberField
                label="Laufzeit"
                value={input.laufzeitJahre}
                onChange={(v) => set("laufzeitJahre", v)}
                suffix="Jahre"
                step={1}
              />
            </div>
          </Card>

          <Card title="Praxisbetrieb" icon={<Users size={20} />}>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Scheine / Quartal"
                value={input.scheineProQuartal}
                onChange={(v) => set("scheineProQuartal", v)}
                suffix="Fälle"
                step={50}
              />
              <NumberField
                label="Wochenstunden"
                value={input.wochenstunden}
                onChange={(v) => set("wochenstunden", v)}
                suffix="Std."
                step={1}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Umsatz je Fall:{" "}
              <strong>
                {geld(
                  input.scheineProQuartal > 0
                    ? input.jahresumsatz / (input.scheineProQuartal * 4)
                    : 0,
                  w
                )}
              </strong>
            </p>
          </Card>
        </div>

        {/* ---------------- Ergebnisse ---------------- */}
        <div className="lg:col-span-3 space-y-6">
          {/* Empfehlung */}
          <div
            className={`${empfehlungInfo.farbe} text-white rounded-2xl shadow-md p-6 flex items-center gap-5`}
          >
            <div className="bg-white/20 rounded-2xl p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-extrabold leading-none">
                  {a.gesamtScore}
                </div>
                <div className="text-[10px] uppercase tracking-wider opacity-90">
                  Score
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xl font-bold">
                {empfehlungInfo.icon} {empfehlungInfo.text}
              </div>
              <p className="text-white/90 text-sm mt-1">
                {empfehlungInfo.beschreibung} – {input.praxisName}, {input.standort}.
              </p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <KPI
              label="Praxisgewinn / Jahr"
              value={geld(a.praxisgewinn, w)}
              sub={`Umsatzrendite ${(a.umsatzrendite * 100).toFixed(1)} %`}
              accent={a.praxisgewinn > 0 ? "text-emerald-600" : "text-rose-600"}
            />
            <KPI
              label="Fairer Ertragswert"
              value={geld(a.ertragswert, w)}
              sub={`Kaufpreis ${geld(a.kaufpreisGesamt, w)}`}
            />
            <KPI
              label="Preis-Differenz"
              value={(a.preisDifferenz >= 0 ? "+" : "") + geld(a.preisDifferenz, w)}
              sub={a.preisDifferenz > 0 ? "über fairem Wert" : "unter fairem Wert"}
              accent={a.preisDifferenz > 0 ? "text-rose-600" : "text-emerald-600"}
            />
            <KPI
              label="Darlehen"
              value={geld(a.darlehen, w)}
              sub={`Annuität ${geld(a.annuitaet, w)}/Jahr`}
            />
            <KPI
              label="Verfügb. Einkommen"
              value={geld(a.verfuegbaresEinkommen, w)}
              sub="Gewinn − Kapitaldienst"
              accent={
                a.verfuegbaresEinkommen > input.vergleichsArztlohn
                  ? "text-emerald-600"
                  : "text-amber-600"
              }
            />
            <KPI
              label="Amortisation"
              value={
                isFinite(a.amortisationJahre)
                  ? a.amortisationJahre.toFixed(1) + " J."
                  : "—"
              }
              sub={`Deckung ${
                isFinite(a.kapitaldienstdeckung)
                  ? a.kapitaldienstdeckung.toFixed(2) + "×"
                  : "—"
              }`}
            />
          </div>

          {/* Kostenstruktur */}
          <Card title="Verwendung des Umsatzes" icon={<PieChart size={20} />}>
            <div className="flex h-5 rounded-full overflow-hidden mb-4">
              {kostenPosten.map((p) => (
                <div
                  key={p.label}
                  className={p.farbe}
                  style={{ width: `${(p.wert / kostenSumme) * 100}%` }}
                  title={`${p.label}: ${geld(p.wert, w)}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm">
              {kostenPosten.map((p) => (
                <div key={p.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-sm ${p.farbe}`} />
                  <span className="text-slate-600 flex-1">{p.label}</span>
                  <span className="font-semibold text-slate-800">
                    {((p.wert / kostenSumme) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bewertungs-Ampel */}
          <Card title="Bewertungs-Check" icon={<TrendingUp size={20} />}>
            <div className="space-y-3">
              {a.scores.map((s) => (
                <div
                  key={s.label}
                  className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <span
                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${AMPEL_FARBE[s.ampel]}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{s.label}</span>
                      <span className={`font-bold ${AMPEL_TEXT[s.ampel]}`}>
                        {s.wert}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{s.hinweis}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bewertungsdetails */}
          <Card title="Bewertung (Ertragswertmethode)" icon={<Calculator size={20} />}>
            <div className="space-y-2 text-sm">
              <Zeile label="Praxisgewinn (vor Finanzierung)" wert={geld(a.praxisgewinn, w)} />
              <Zeile
                label="− kalkulatorischer Arztlohn"
                wert={geld(input.vergleichsArztlohn, w)}
              />
              <Zeile
                label="= übertragbarer Gewinn"
                wert={geld(a.uebertragbarerGewinn, w)}
                bold
              />
              <Zeile
                label={`× Prognose-Faktor (${input.prognoseFaktor})`}
                wert={geld(a.ideellerWert, w)}
              />
              <Zeile label="+ Substanzwert (Inventar)" wert={geld(input.kaufpreisInventar, w)} />
              <div className="border-t border-slate-200 my-1" />
              <Zeile label="= Fairer Ertragswert" wert={geld(a.ertragswert, w)} bold highlight />
            </div>
          </Card>

          {/* Due Diligence */}
          <Card title="Due-Diligence-Checkliste" icon={<ClipboardCheck size={20} />}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                <div
                  className="bg-teal-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${ddPct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {ddDone}/{ddTotal} · {ddPct}%
              </span>
            </div>
            <div className="space-y-5">
              {DUE_DILIGENCE.map((kat) => (
                <div key={kat.kategorie}>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                    {kat.kategorie}
                  </h3>
                  <div className="space-y-2">
                    {kat.punkte.map((p) => {
                      const key = `${kat.kategorie}::${p}`;
                      return (
                        <label
                          key={key}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={!!checked[key]}
                            onChange={(e) =>
                              setChecked((c) => ({ ...c, [key]: e.target.checked }))
                            }
                            className="mt-0.5 w-4 h-4 accent-teal-600"
                          />
                          <span
                            className={`text-sm ${
                              checked[key]
                                ? "line-through text-slate-400"
                                : "text-slate-700"
                            }`}
                          >
                            {p}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-xs text-slate-400 leading-relaxed">
            Hinweis: Diese Analyse dient der Orientierung und ersetzt keine
            steuer-, rechts- oder wirtschaftsberatende Prüfung. Die Bewertung
            folgt vereinfacht der modifizierten Ertragswertmethode in Anlehnung
            an die Hinweise der Bundesärztekammer.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-8 print:hidden">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-400">
          Praxiskauf-Analyse · Eingaben werden nur lokal in Ihrem Browser
          gespeichert.
        </div>
      </footer>
    </div>
  );
}

function Zeile({
  label,
  wert,
  bold,
  highlight,
}: {
  label: string;
  wert: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center ${
        highlight ? "bg-teal-50 -mx-2 px-2 py-1.5 rounded-lg" : ""
      }`}
    >
      <span className={`${bold ? "font-semibold text-slate-800" : "text-slate-600"}`}>
        {label}
      </span>
      <span
        className={`${
          bold ? "font-bold" : "font-medium"
        } ${highlight ? "text-teal-700" : "text-slate-800"}`}
      >
        {wert}
      </span>
    </div>
  );
}
