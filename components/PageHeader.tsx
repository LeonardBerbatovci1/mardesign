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
 * When `script` is passed the handwritten mark shares the title's row and
 * sits on its baseline, so "we design, we finalise" lines up with the bottom
 * of "OUR WORK" rather than floating above it.
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
    <div className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h1 className="display-title text-[clamp(2.75rem,9vw,7rem)] text-white">
          {title}
        </h1>
        {script && <ScriptMark className="shrink-0">{script}</ScriptMark>}
      </div>
      {subtitle && (
        <p className="display-sub mt-2 text-[clamp(1.25rem,3.2vw,2.4rem)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
