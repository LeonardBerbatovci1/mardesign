import { getTheme } from "@/lib/content";
import { PageHead } from "@/components/admin/PageHead";
import { ThemeForm } from "./ThemeForm";

export default async function ThemePage() {
  const theme = await getTheme();
  return (
    <div>
      <PageHead
        title="Colours"
        lede="These seven colours drive the whole site. A change here updates every page at once."
      />
      <ThemeForm initial={theme} />
    </div>
  );
}
