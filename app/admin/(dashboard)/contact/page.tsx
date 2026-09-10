import { getContact } from "@/lib/content";
import { PageHead } from "@/components/admin/PageHead";
import { ContactForm } from "./ContactForm";

export default async function ContactAdminPage() {
  const contact = await getContact();
  return (
    <div>
      <PageHead
        title="Contact page"
        lede="Intro text and the people visitors can call. The address, email and hours live under “Header, footer & links”."
      />
      <ContactForm initial={contact} />
    </div>
  );
}
