import { getHome } from "@/lib/content";
import { PageHead } from "@/components/admin/PageHead";
import { HomeForm } from "./HomeForm";

export default async function HomeAdminPage() {
  const home = await getHome();
  return (
    <div>
      <PageHead title="Home page" lede="The hero section visitors see first." />
      <HomeForm initial={home} />
    </div>
  );
}
