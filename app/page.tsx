import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { HomeNav } from "@/components/HomeNav";
import { LogoLockup } from "@/components/Logo";
import { Social } from "@/components/Social";
import { getHome, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// Static HTML, refreshed on CMS save (revalidatePath) and hourly as a fallback.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({ site, description: site.seo.description, path: "/" });
}

export default async function HomePage() {
  const [site, home] = await Promise.all([getSite(), getHome()]);
  const { hero } = home;

  return (
    <>
      <div className="mx-auto w-full max-w-[1700px] px-6 pt-8 sm:px-10 lg:px-16">
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
      </div>

      <main id="main">
        <section className="mx-auto grid w-full max-w-[1700px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-[1.12fr_1.1fr] lg:gap-8 lg:px-16 lg:pb-24 lg:pt-4">
          <div className="min-w-0">
            <p className="text-[clamp(0.95rem,1.6vw,1.4rem)] font-light uppercase tracking-[0.06em] text-accent">
              {hero.eyebrow}
            </p>

            <h1 className="display-title mt-3 max-w-full text-[clamp(1.7rem,4vw,3.15rem)] lg:max-w-[25ch] text-white">
              {hero.title}
            </h1>
            <p className="display-title mt-1 max-w-full text-[clamp(1.7rem,4vw,3.15rem)] lg:max-w-[25ch] text-accent">
              {hero.titleAccent}
            </p>

            <p className="mt-6 max-w-[46ch] text-[clamp(1rem,1.35vw,1.2rem)] font-light leading-relaxed text-white/90">
              {hero.body}
            </p>

            <Link
              href={hero.cta.href}
              className="mt-8 inline-block rounded-full bg-accent px-9 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-soft hover:text-ink"
            >
              {hero.cta.label}
            </Link>

            <Social links={site.social} className="mt-14 [&_svg]:size-7" />
          </div>

          {/* Product shot with the two award badges pinned to it. */}
          <div className="relative mx-auto w-fit max-w-full min-w-0">
            <Image
              src={hero.image.src}
              alt={hero.image.alt ?? ""}
              width={hero.image.width}
              height={hero.image.height}
              priority
              sizes="(max-width: 1024px) 90vw, 680px"
              className="mx-auto h-auto w-full max-w-[min(88vw,600px)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)] lg:max-h-[74dvh] lg:w-auto lg:max-w-none"
            />

            {hero.badges[0] && (
              <Image
                src={hero.badges[0].src}
                alt={hero.badges[0].alt ?? ""}
                width={hero.badges[0].width}
                height={hero.badges[0].height}
                sizes="(max-width: 640px) 26vw, 190px"
                className="absolute left-0 top-[34%] w-[24%] max-w-[185px] -translate-x-[8%] lg:-translate-x-[45%]"
              />
            )}

            {hero.badges[1] && (
              <Image
                src={hero.badges[1].src}
                alt={hero.badges[1].alt ?? ""}
                width={hero.badges[1].width}
                height={hero.badges[1].height}
                sizes="(max-width: 640px) 26vw, 190px"
                className="absolute bottom-[8%] right-0 w-[24%] max-w-[185px] translate-x-[8%] lg:translate-x-[20%]"
              />
            )}
          </div>
        </section>
      </main>

      <Footer site={site} />
    </>
  );
}
