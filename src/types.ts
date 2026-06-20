// ------------------------------------------------------------------
// Datenmodell für die Praxiskauf-Analyse (Hausarztpraxis)
// ------------------------------------------------------------------

export type Currency = "EUR" | "CHF";

export interface PracticeInputs {
  // Stammdaten
  praxisName: string;
  standort: string;
  waehrung: Currency;

  // Kaufpreis
  kaufpreisGoodwill: number; // ideeller Wert (Patientenstamm, Standort, Ruf)
  kaufpreisInventar: number; // materieller Wert (Geräte, Einrichtung, Substanz)

  // Wirtschaftliche Eckdaten (pro Jahr)
  jahresumsatz: number; // Honorarumsatz gesamt
  privatanteilProzent: number; // Anteil Privat/IGeL am Umsatz

  // Betriebskosten (pro Jahr)
  personalkosten: number; // MFA / Personal
  raumkosten: number; // Miete inkl. Nebenkosten
  materialkosten: number; // Sprechstundenbedarf, Labor, Sachkosten
  sonstigeKosten: number; // Versicherung, IT, Abschreibung, Beratung

  // Übernehmer / kalkulatorische Werte
  vergleichsArztlohn: number; // kalkulatorischer Unternehmerlohn (für Bewertung)
  prognoseFaktor: number; // Multiplikator übertragbarer Gewinn (Ärztekammer-Methode)

  // Finanzierung
  eigenkapital: number;
  zinssatzProzent: number;
  laufzeitJahre: number;

  // Praxisbetrieb / Kennzahlen
  scheineProQuartal: number; // Patientenfälle pro Quartal
  wochenstunden: number;
}

export interface Analysis {
  // Kaufpreis
  kaufpreisGesamt: number;

  // Erfolgsrechnung
  betriebsausgaben: number;
  praxisgewinn: number; // vor Finanzierung & Steuern
  umsatzrendite: number; // Gewinn / Umsatz (0..1)
  kostenquote: number; // Ausgaben / Umsatz (0..1)

  // Bewertung (modifizierte Ertragswertmethode)
  uebertragbarerGewinn: number; // Gewinn − kalk. Arztlohn
  ideellerWert: number; // übertragbarer Gewinn × Faktor
  ertragswert: number; // ideeller Wert + Inventar (fairer Praxiswert)
  preisDifferenz: number; // Kaufpreis − Ertragswert (>0 = zu teuer)
  goodwillFaktorReal: number; // gezahlter Goodwill / übertragbarer Gewinn

  // Finanzierung
  darlehen: number;
  annuitaet: number; // jährlicher Kapitaldienst (Zins + Tilgung)
  ersteJahresZinsen: number;
  kapitaldienstdeckung: number; // Cashflow / Annuität

  // Ergebnis für den Übernehmer
  verfuegbaresEinkommen: number; // Gewinn − Annuität
  amortisationJahre: number; // Kaufpreis / nachhaltiger Cashflow

  // Bewertungs-Ampel
  scores: ScoreItem[];
  gesamtScore: number; // 0..100
  empfehlung: "kaufen" | "verhandeln" | "vorsicht";
}

export type Ampel = "gruen" | "gelb" | "rot";

export interface ScoreItem {
  label: string;
  wert: string; // formatierter Anzeigewert
  ampel: Ampel;
  hinweis: string;
}
