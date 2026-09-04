import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Page not found — Raffaele Sollecito",
  robots: { index: false, follow: true },
};

/** Root 404 (served by CloudFront custom_error_response for 403/404). Trilingual (EN/IT/DE), self-contained. */
export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex items-center justify-center px-6">
        <main className="max-w-lg text-center">
          <p className="font-mono text-accent text-sm tracking-widest uppercase">404</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found · Pagina non trovata · Seite nicht gefunden</h1>
          <p className="mt-4 text-muted">
            The page you requested does not exist or has moved.
            <br />
            La pagina richiesta non esiste o è stata spostata.
            <br />
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/en/" className="px-5 py-2.5 rounded-md bg-accent text-white font-medium">English home</Link>
            <Link href="/it/" className="px-5 py-2.5 rounded-md border border-border font-medium">Home in italiano</Link>
            <Link href="/de/" className="px-5 py-2.5 rounded-md border border-border font-medium">Startseite auf Deutsch</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
