import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/types";

/**
 * The strip of project cards under each category. Each card links to that
 * project's own page. When a category has no projects yet the deck still shows
 * empty frames, so we keep them — they're the slots the dashboard fills.
 */
export function ProjectGallery({
  categorySlug,
  title,
  projects,
  placeholders = 6,
}: {
  categorySlug: string;
  title: string;
  projects: Project[];
  placeholders?: number;
}) {
  const empties = Math.max(0, placeholders - projects.length);

  return (
    <section className="mt-16 lg:mt-20">
      <div className="flex items-center gap-6">
        <h2 className="display-title shrink-0 text-[clamp(1.1rem,1.9vw,1.6rem)] text-white">
          {title}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-accent/45" />
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${categorySlug}/${project.slug}`}
              className="group block"
            >
              <figure className="relative overflow-hidden rounded-2xl border border-hairline/70 bg-panel/50">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={project.width}
                  height={project.height}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/95 to-transparent p-3 pt-8 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {project.title}
                </figcaption>
              </figure>
            </Link>
          </li>
        ))}

        {Array.from({ length: empties }).map((_, i) => (
          <li key={`empty-${i}`} aria-hidden="true">
            <div className="aspect-[3/4] w-full rounded-2xl border border-accent/35" />
          </li>
        ))}
      </ul>
    </section>
  );
}
