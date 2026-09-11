import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { ScriptMark } from "./ScriptMark";

/**
 * Full-width top bar on every inner page: breadcrumb hard left, the
 * handwritten mark hard right. Kept separate from the title so that pages
 * with a two-column body can still push the script to the page edge.
 *
 * Pages that bottom-align the script with their title (see `PageTitle`)
 * omit `script` here so the mark is not rendered twice.
 */
export function PageTopBar({
  crumbs,
  script,
}: {
  crumbs: Crumb[];
  script?: string;
}) {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-2 sm:flex-row sm:items-start sm:gap-8">
      <Breadcrumb items={crumbs} />
      {script && <ScriptMark className="sm:pt-1 sm:text-right">{script}</ScriptMark>}
    </div>
  );
}

/**
 * The oversized page title plus its mint subtitle.
 *
 * When `script` is passed, the handwritten mark sits on the baseline of the
 * whole title block — level with "solutions that stand out." rather than with
 * the big title above it, which is how the deck draws it.
 */
export function PageTitle({
  title,
  subtitle,
  script,
  className = "",
}: {
  title: string;
  subtitle?: string;
  script?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-2 ${className}`}
    >
      <div className="min-w-0">
        <h1 className="display-title text-[clamp(2.75rem,9vw,7rem)] text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="display-sub mt-2 text-[clamp(1.25rem,3.2vw,2.4rem)]">
            {subtitle}
          </p>
        )}
      </div>
      {script && <ScriptMark className="shrink-0 pb-1">{script}</ScriptMark>}
    </div>
  );
}
