import Image from "next/image";

import type { Person } from "@/lib/types";

/** One of the two "who to call" cards on the Contact page. */
export function ContactCard({ person }: { person: Person }) {
  return (
    <article className="panel overflow-hidden rounded-[1.5rem]">
      <Image
        src={person.image}
        alt={person.name}
        width={person.width}
        height={person.height}
        sizes="(max-width: 1024px) 92vw, 520px"
        className="aspect-[4/3] w-full object-cover"
      />

      <div className="p-6">
        <span aria-hidden="true" className="block h-px w-16 bg-accent" />
        <h3 className="mt-4 font-display text-lg font-extrabold uppercase tracking-[0.02em] text-white">
          {person.name}
        </h3>
        <p className="mt-1.5 max-w-[34ch] text-sm font-light leading-relaxed text-white/85">
          {person.role}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`tel:${person.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-3 rounded-full border border-accent-soft/60 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent hover:bg-accent hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1z" />
            </svg>
            {person.phone}
          </a>

          <p className="flex items-start gap-2 text-sm leading-tight text-white/85">
            <span
              aria-hidden="true"
              className="mt-1.5 size-2 shrink-0 rounded-full bg-[#39d353]"
            />
            {person.availability}
          </p>
        </div>
      </div>
    </article>
  );
}
