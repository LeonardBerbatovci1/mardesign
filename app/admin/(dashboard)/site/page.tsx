import { getSite } from "@/lib/content";
import { PageHead } from "@/components/admin/PageHead";
import { SiteForm } from "./SiteForm";

export default async function SiteAdminPage() {
  const site = await getSite();
  return (
    <div>
      <PageHead
        title="Header, footer & links"
        lede="Menu labels, the call-to-action button, social links and the contact details shown in the footer."
      />
      <SiteForm initial={site} />
    </div>
  );
}
