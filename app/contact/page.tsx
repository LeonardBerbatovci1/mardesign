import type { Metadata } from "next";

import { ContactCard } from "@/components/ContactCard";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { PageTitle, PageTopBar } from "@/components/PageHeader";
import { getContact, getSite } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSite(), getContact()]);
  return pageMetadata({
    site,
    title: contact.title,
    description: `${contact.body} ${site.name} is in ${site.business.addressLocality}, ${site.contact.location.slice(-1)[0]}. Call ${site.business.phone} or email ${site.contact.email}.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [site, contact] = await Promise.all([getSite(), getContact()]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(site, [
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Nav primary={site.primaryNav} secondary={site.secondaryNav} />

      <main
        id="main"
        className="mx-auto w-full max-w-[1500px] px-6 pt-8 sm:px-10 lg:px-16"
      >
        <PageTopBar
          crumbs={[{ label: "Home", href: "/" }, { label: "Our team" }]}
          script={site.script}
        />

        <div className="mt-3 grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <PageTitle title={contact.title} />

            <p className="display-sub mt-2 max-w-[16ch] text-[clamp(1.5rem,3.4vw,2.6rem)] leading-tight">
              {contact.subtitle}
            </p>

            <p className="mt-6 max-w-[46ch] text-[clamp(1rem,1.3vw,1.15rem)] font-light leading-relaxed text-white/90">
              {contact.body}
            </p>

            <dl className="mt-12 space-y-9">
              <InfoRow
                label="Location"
                icon={
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                }
              >
                {site.contact.location.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </InfoRow>

              <InfoRow
                label="Email"
                icon={
                  <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8.2L4.3 7.3v10.2h15.4V7.3zM19.4 6H4.6l7.4 5.7z" />
                }
              >
                <a
                  href={`mailto:${site.contact.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {site.contact.email}
                </a>
              </InfoRow>

              <InfoRow
                label="Working hours"
                icon={
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.9-13h-1.8v6l4.7 2.9.9-1.5-3.8-2.3z" />
                }
              >
                {site.contact.workingHours}
              </InfoRow>
            </dl>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16">
            {contact.people.map((person) => (
              <ContactCard key={person.slug} person={person} />
            ))}
          </div>
        </div>
      </main>

      <Footer site={site} />
    </>
  );
}

function InfoRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-5">
      <span
        aria-hidden="true"
        className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-accent text-accent"
      >
        <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
          {icon}
        </svg>
      </span>
      <div>
        <dt className="display-title text-[clamp(1.25rem,2.2vw,1.8rem)] text-accent">
          {label}
        </dt>
        <dd className="mt-1 text-[clamp(0.95rem,1.25vw,1.1rem)] font-light text-white/90">
          {children}
        </dd>
      </div>
    </div>
  );
}
