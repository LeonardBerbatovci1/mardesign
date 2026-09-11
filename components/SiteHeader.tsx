import { LogoLockup } from "./Logo";
import { HomeNav } from "./HomeNav";
import type { Site } from "@/lib/types";

/**
 * The page header: brand lockup hard left, links and the "start a project"
 * pill hard right. Used on every page so the masthead does not change shape
 * as you move around the site.
 */
export function SiteHeader({ site }: { site: Site }) {
  return (
    <header className="mx-auto w-full max-w-[1700px] px-6 pt-8 sm:px-10 lg:px-16">
      <div className="flex items-start justify-between gap-6">
        <LogoLockup
          wordmark={site.wordmark}
          tagline={site.tagline}
          className="items-start !items-start text-left"
        />
        <div className="pt-1 sm:pt-4">
          <HomeNav
            links={[...site.primaryNav]}
            cta={site.cta}
            social={site.social}
          />
        </div>
      </div>
    </header>
  );
}
