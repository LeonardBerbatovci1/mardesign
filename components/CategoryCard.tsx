import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/lib/types";

/** One of the five cards on /work, each opening a category page. */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/work/${category.slug}`}
      className="panel group flex flex-col rounded-[1.75rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:bg-panel"
    >
      <h2 className="display-title text-[clamp(1.4rem,2vw,1.9rem)] text-white">
        {category.title}
      </h2>
      <p className="mt-3 text-sm font-light leading-relaxed text-white/85">
        {category.cardDescription}
      </p>

      <div className="relative my-8 grid flex-1 place-items-center">
        <Image
          src={category.illustration.src}
          alt=""
          width={category.illustration.width}
          height={category.illustration.height}
          sizes="(max-width: 768px) 60vw, 260px"
          className="max-h-[240px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>

      <div className="mt-auto flex items-center justify-between gap-4">
        <span className="text-[0.8rem] font-medium uppercase tracking-[0.1em] text-white">
          View projects
        </span>
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:translate-x-1"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h13M12 5.5 18.5 12 12 18.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
