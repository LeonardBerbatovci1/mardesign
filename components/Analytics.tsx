import Script from "next/script";

/**
 * Loads Google Analytics 4 only when NEXT_PUBLIC_GA_ID is set, so development
 * and preview builds stay clean. Uses next/script afterInteractive so it never
 * blocks rendering or hurts Core Web Vitals.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
