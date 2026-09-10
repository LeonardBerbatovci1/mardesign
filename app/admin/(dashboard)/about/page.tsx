import { getAbout } from "@/lib/content";
import { PageHead } from "@/components/admin/PageHead";
import { AboutForm } from "./AboutForm";

export default async function AboutAdminPage() {
  const about = await getAbout();
  return (
    <div>
      <PageHead title="About page" lede="Company story and the timeline." />
      <AboutForm initial={about} />
    </div>
  );
}
