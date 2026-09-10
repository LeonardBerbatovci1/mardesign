/** The handwritten "we design, we finalise" that sits top-right on inner pages. */
export function ScriptMark({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={`script-mark text-[clamp(1.5rem,3.6vw,3.1rem)] ${className}`}
    >
      {children}
    </p>
  );
}
