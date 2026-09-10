import type { JsonLd as JsonLdData } from "@/lib/seo";

/**
 * Renders one or more schema.org graphs as a <script type="application/ld+json">.
 * Server-only; the JSON is serialised at render time.
 */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own typed data, not user free-text HTML.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
