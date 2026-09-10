import { getWork } from "@/lib/content";
import { PageHead } from "@/components/admin/PageHead";
import { WorkForm } from "./WorkForm";

export default async function WorkAdminPage() {
  const work = await getWork();
  return (
    <div>
      <PageHead
        title="Work & projects"
        lede="The categories on the Work page and every project inside them. Reorder with the arrows; each category becomes its own page."
      />
      <WorkForm initial={work} />
    </div>
  );
}
