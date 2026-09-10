export function PageHead({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {lede && <p className="admin-page-lede">{lede}</p>}
      </div>
      {children}
    </div>
  );
}
