import Image from "next/image";

import type { Milestone } from "@/lib/types";

/**
 * The 2014 → 2026 "Our story" track. Each milestone reserves a photo frame, as
 * the deck draws it: with a photo attached (dashboard, About → Timeline) the
 * image fills it, otherwise an empty outlined frame holds the slot so the row
 * keeps its rhythm and the gaps are ready for photos.
 */
export function Timeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {milestones.map((milestone) => (
        <li key={milestone.year} className="relative pt-8">
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 size-5 rounded-full border-2 border-accent"
          />
          <span
            aria-hidden="true"
            className="absolute left-6 right-0 top-[9px] hidden h-px bg-accent/40 lg:block"
          />

          <h3 className="display-title text-[clamp(1.5rem,2.4vw,2rem)] text-white">
            {milestone.year}
          </h3>
          <p className="mt-2 text-[clamp(1rem,1.4vw,1.2rem)] font-medium uppercase tracking-[0.04em] text-accent">
            {milestone.title}
          </p>
          <p className="mt-2 max-w-[34ch] text-sm font-light leading-relaxed text-white/85">
            {milestone.body}
          </p>

          {milestone.image ? (
            <Image
              src={milestone.image}
              alt={`${milestone.year} — ${milestone.title}`}
              width={600}
              height={420}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
              className="mt-5 aspect-[4/3] w-full rounded-lg object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="mt-5 aspect-[4/3] w-full rounded-lg border-2 border-dashed border-hairline/70 bg-panel/30"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
