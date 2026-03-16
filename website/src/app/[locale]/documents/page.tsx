import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

const documents = {
  verdicts: [
    { name: "Cassazione Definitiva 2015 (Assoluzione)", file: "2015CassazioneDefinitiva.pdf" },
    { name: "Sentenza Massei — Primo Grado", file: "SentenzaMassei-primo-grado.pdf" },
    { name: "Sentenza Appello Perugia (Hellmann-Zanetti)", file: "sentenza-appello-perugia-hellmann-zanetti.pdf" },
    { name: "Motivazione Cassazione 06/2013", file: "motivazioneCassazione062013.pdf" },
    { name: "Cassazione Definitiva Rudy Guede", file: "cassazione-definitiva-rudy-guede.pdf" },
    { name: "Assoluzione Calunnia Amanda 02/2016", file: "assoluzione-calunnia-amanda-02-2016.pdf" },
    { name: "Rigetto RID Sollecito", file: "rigetto-rid-2-16-RID-ORD-SOLLECITO.pdf" },
  ],
  appeals: [
    { name: "Ricorso Cassazione Ultima — Sollecito (9.6.2014)", file: "RICORSO--Cassazione-ultima-SOLLECITO-9.6.2014.pdf" },
    { name: "Ricorso Cassazione — Motivi Nuovi Finale", file: "ricorso-cassazione-ultima-SOLLECITO-motivi-nuovi-finale.pdf" },
    { name: "Appello Firenze Motivazioni 1", file: "appello-firenze-motivazioni-1.docx" },
    { name: "Appello Firenze Motivazioni 2", file: "appello-firenze-motivazioni-2.docx" },
    { name: "Appello Firenze Motivazioni 3", file: "appello-firenze-motivazioni-3.docx" },
    { name: "Appello Firenze Motivazioni 4", file: "appello-firenze-motivazioni-4.docx" },
    { name: "Requisitoria PM Mignini", file: "requisitoria-PM-Mignini.pdf" },
  ],
  expert: [
    { name: "Perizia Conti-Vecchiotti", file: "perizia-conti-vecchiotti.pdf" },
    { name: "Consulenza Orme — Vinci", file: "consulenza-orme-VINCI.pdf" },
    { name: "Consulenza Impronte Scarpa — Vinci", file: "consulenza-impronte-scarpa-Vinci.pdf" },
    { name: "Analisi Grafologica Raffaele", file: "analisi-grafologica-raffaele.pdf" },
    { name: "Lettera Corte d'Appello — Protocolli Internazionali", file: "LetteraCortedAppello-perugia-la-polizia-scientifica-protocolli -internazionali.pdf" },
    { name: "EN — Italian Police Protocols (Letter Appeal Court)", file: "EN-italian-police-protocols-LetterAppealCourt.pdf" },
  ],
  other: [
    { name: "Dichiarazioni Spontanee Raffaele (Tutte)", file: "DichiarazioniSpontaneeRaffaeleTutte.pdf" },
    { name: "Memoriale Amanda in Carcere", file: "memoriale-amanda-in-carcere.pdf" },
    { name: "Chat Rudy Guede — Giacomo Benedetti (Trascrizione)", file: "chat-Rudy-guede-giacomo-benedetti-trascrizione.pdf" },
    { name: "Guede Chat Preliminare", file: "guede-chat-preliminare-non-sapeva-di-essere-intercettato.pdf" },
    { name: "Interrogatorio Guede davanti PM", file: "interrogatorio-guede-davanti-pubblico-ministero.pdf" },
    { name: "Interrogatorio Garanzia GIP — Sollecito", file: "interrogatorio-garanzia-giudice-indagini-preliminari-raf-sollecito.pdf" },
    { name: "Convalida del Fermo (8.11.2007)", file: "2007.11.8-Convalida-del-fermo-Raffaele-Sollecito.docx" },
    { name: "EN — Marasca Bruno Motivations Report", file: "EN-Marasca-Bruno-Motivations-Report.pdf" },
    { name: "EN — Galati Costagliola Appeal (US Version)", file: "EN-2012GalatiCostagliolaAppealUSVersion.pdf" },
  ],
};

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("documents");

  const categories = ["verdicts", "appeals", "expert", "other"] as const;

  return (
    <Section className="pt-32">
      <SectionHeader
        title={t("title")}
        headline={t("headline")}
        subtitle={t("subtitle")}
      />

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t(`categories.${cat}`)}
            </h3>
            <div className="grid gap-2">
              {documents[cat].map((doc) => (
                <a
                  key={doc.file}
                  href={`/documents/${doc.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-md bg-surface border border-border/50 hover:border-accent/30 transition-all group"
                >
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      doc.file.endsWith(".pdf")
                        ? "bg-crimson/10 text-crimson"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {doc.file.endsWith(".pdf") ? "PDF" : "DOCX"}
                  </span>
                  <span className="text-sm group-hover:text-accent transition-colors">
                    {doc.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
