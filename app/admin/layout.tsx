export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

/** Passthrough. The guarded UI + auth check live in (dashboard)/layout.tsx so
    the login page can sit outside it and avoid a redirect loop. */
export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
