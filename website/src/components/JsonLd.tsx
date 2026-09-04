/**
 * Renders a JSON-LD script tag. Server component; safe for static export.
 * The `<` escape prevents premature </script> termination if any string contains it.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
