import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { ScriptMark } from "./ScriptMark";

/**
 * Full-width top bar on every inner page: breadcrumb hard left, the
 * handwritten mark hard right. Kept separate from the title so that pages
 * with a two-column body can still push the script to the page edge.
 */
export function PageTopBar({
  crumbs,
  script,
}: {
  crumbs: Crumb[];
  script: string;
}) {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-2 sm:flex-row sm:items-start sm:gap-8">
      <Breadcrumb items={crumbs} />
      <ScriptMark className="sm:pt-1 sm:text-right">{script}</ScriptMark>
    </div>
  );
}

/** The oversized page title plus its mint subtitle. */
export function PageTitle({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h1 className="display-title text-[clamp(2.75rem,9vw,7rem)] text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="display-sub mt-2 text-[clamp(1.25rem,3.2vw,2.4rem)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
