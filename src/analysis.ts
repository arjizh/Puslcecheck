import { Analysis, Ampel, PracticeInputs, ScoreItem } from "./types";

// ------------------------------------------------------------------
// Standardwerte: realistische Hausarztpraxis (Einzelpraxis)
// ------------------------------------------------------------------
export const DEFAULT_INPUTS: PracticeInputs = {
  praxisName: "Hausarztpraxis Muster",
  standort: "Musterstadt",
  waehrung: "EUR",

  kaufpreisGoodwill: 90000,
  kaufpreisInventar: 60000,

  jahresumsatz: 480000,
  privatanteilProzent: 18,

  personalkosten: 130000,
  raumkosten: 36000,
  materialkosten: 55000,
  sonstigeKosten: 45000,

  vergleichsArztlohn: 100000,
  prognoseFaktor: 2.0,

  eigenkapital: 50000,
  zinssatzProzent: 5,
  laufzeitJahre: 7,

  scheineProQuartal: 1100,
  wochenstunden: 42,
};

// Annuität (jährliche, gleichbleibende Rate) für ein Darlehen.
export function annuitaet(
  betrag: number,
  zinssatzProzent: number,
  laufzeitJahre: number
): number {
  if (betrag <= 0) return 0;
  const i = zinssatzProzent / 100;
  if (laufzeitJahre <= 0) return betrag;
  if (i === 0) return betrag / laufzeitJahre;
  const q = 1 + i;
  return (betrag * (Math.pow(q, laufzeitJahre) * i)) / (Math.pow(q, laufzeitJahre) - 1);
}

function ampelVon(wert: number, gut: number, mittel: number, hoeherBesser = true): Ampel {
  if (hoeherBesser) {
    if (wert >= gut) return "gruen";
    if (wert >= mittel) return "gelb";
    return "rot";
  } else {
    if (wert <= gut) return "gruen";
    if (wert <= mittel) return "gelb";
    return "rot";
  }
}

const ampelPunkte: Record<Ampel, number> = { gruen: 100, gelb: 55, rot: 15 };

// ------------------------------------------------------------------
// Kernberechnung
// ------------------------------------------------------------------
export function analysieren(input: PracticeInputs): Analysis {
  const kaufpreisGesamt = input.kaufpreisGoodwill + input.kaufpreisInventar;

  // Erfolgsrechnung
  const betriebsausgaben =
    input.personalkosten +
    input.raumkosten +
    input.materialkosten +
    input.sonstigeKosten;
  const praxisgewinn = input.jahresumsatz - betriebsausgaben;
  const umsatzrendite = input.jahresumsatz > 0 ? praxisgewinn / input.jahresumsatz : 0;
  const kostenquote = input.jahresumsatz > 0 ? betriebsausgaben / input.jahresumsatz : 0;

  // Bewertung – modifizierte Ertragswertmethode (in Anlehnung an Ärztekammer)
  const uebertragbarerGewinn = praxisgewinn - input.vergleichsArztlohn;
  const ideellerWert = Math.max(0, uebertragbarerGewinn) * input.prognoseFaktor;
  const ertragswert = ideellerWert + input.kaufpreisInventar;
  const preisDifferenz = kaufpreisGesamt - ertragswert;
  const goodwillFaktorReal =
    uebertragbarerGewinn > 0 ? input.kaufpreisGoodwill / uebertragbarerGewinn : Infinity;

  // Finanzierung
  const darlehen = Math.max(0, kaufpreisGesamt - input.eigenkapital);
  const annu = annuitaet(darlehen, input.zinssatzProzent, input.laufzeitJahre);
  const ersteJahresZinsen = darlehen * (input.zinssatzProzent / 100);

  // Ergebnis für den Übernehmer
  const verfuegbaresEinkommen = praxisgewinn - annu;
  // Nachhaltiger Cashflow zur Tilgung = Gewinn abzgl. Lebensunterhalt (Vergleichsarztlohn)
  const cashflowFuerKauf = Math.max(1, praxisgewinn - input.vergleichsArztlohn);
  const amortisationJahre = kaufpreisGesamt / cashflowFuerKauf;
  const kapitaldienstdeckung = annu > 0 ? cashflowFuerKauf / annu : Infinity;

  // ---------------- Bewertungs-Ampel ----------------
  const scores: ScoreItem[] = [];

  const aUmsatzrendite = ampelVon(umsatzrendite, 0.35, 0.25);
  scores.push({
    label: "Umsatzrendite",
    wert: (umsatzrendite * 100).toFixed(1) + " %",
    ampel: aUmsatzrendite,
    hinweis:
      aUmsatzrendite === "gruen"
        ? "Solide Profitabilität für eine Hausarztpraxis."
        : aUmsatzrendite === "gelb"
        ? "Durchschnittlich – Kostenstruktur prüfen."
        : "Niedrige Marge – Ertragskraft hinterfragen.",
  });

  const aPreis = ampelVon(preisDifferenz, 0, ertragswert * 0.2, false);
  scores.push({
    label: "Kaufpreis vs. Ertragswert",
    wert: (preisDifferenz >= 0 ? "+" : "") + Math.round(preisDifferenz).toLocaleString("de-DE"),
    ampel: aPreis,
    hinweis:
      aPreis === "gruen"
        ? "Kaufpreis liegt unter/auf dem fairen Ertragswert."
        : aPreis === "gelb"
        ? "Leicht über Ertragswert – Verhandlungsspielraum nutzen."
        : "Deutlich über dem fairen Wert – Überzahlung droht.",
  });

  const aDeckung = ampelVon(kapitaldienstdeckung, 1.5, 1.1);
  scores.push({
    label: "Kapitaldienstdeckung",
    wert: isFinite(kapitaldienstdeckung) ? kapitaldienstdeckung.toFixed(2) + "×" : "—",
    ampel: aDeckung,
    hinweis:
      aDeckung === "gruen"
        ? "Cashflow deckt die Finanzierung komfortabel."
        : aDeckung === "gelb"
        ? "Knappe Deckung – wenig Puffer bei Umsatzrückgang."
        : "Cashflow deckt den Kapitaldienst kaum.",
  });

  const aAmort = ampelVon(amortisationJahre, 5, 8, false);
  scores.push({
    label: "Amortisationsdauer",
    wert: isFinite(amortisationJahre) ? amortisationJahre.toFixed(1) + " Jahre" : "—",
    ampel: aAmort,
    hinweis:
      aAmort === "gruen"
        ? "Investition amortisiert sich zügig."
        : aAmort === "gelb"
        ? "Mittlere Rückzahldauer."
        : "Lange Amortisation – Risiko erhöht.",
  });

  const aGoodwill = ampelVon(goodwillFaktorReal, 2.0, 2.8, false);
  scores.push({
    label: "Goodwill-Faktor",
    wert: isFinite(goodwillFaktorReal) ? goodwillFaktorReal.toFixed(2) : "—",
    ampel: aGoodwill,
    hinweis:
      aGoodwill === "gruen"
        ? "Gezahlter Goodwill im üblichen Rahmen."
        : aGoodwill === "gelb"
        ? "Goodwill am oberen Rand des Üblichen."
        : "Sehr hoher Goodwill je übertragbarem Gewinn.",
  });

  const gesamtScore = Math.round(
    scores.reduce((s, item) => s + ampelPunkte[item.ampel], 0) / scores.length
  );

  const empfehlung: Analysis["empfehlung"] =
    gesamtScore >= 75 ? "kaufen" : gesamtScore >= 50 ? "verhandeln" : "vorsicht";

  return {
    kaufpreisGesamt,
    betriebsausgaben,
    praxisgewinn,
    umsatzrendite,
    kostenquote,
    uebertragbarerGewinn,
    ideellerWert,
    ertragswert,
    preisDifferenz,
    goodwillFaktorReal,
    darlehen,
    annuitaet: annu,
    ersteJahresZinsen,
    kapitaldienstdeckung,
    verfuegbaresEinkommen,
    amortisationJahre,
    scores,
    gesamtScore,
    empfehlung,
  };
}
