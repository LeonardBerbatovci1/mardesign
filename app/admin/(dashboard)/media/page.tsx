import { listUploads } from "@/lib/uploads";
import { PageHead } from "@/components/admin/PageHead";
import { MediaLibrary } from "./MediaLibrary";

export default async function MediaPage() {
  const files = await listUploads();
  return (
    <div>
      <PageHead
        title="Media library"
        lede="Every image you have uploaded. Upload from here, or straight from any image field while editing a page."
      />
      <MediaLibrary initial={files} />
    </div>
  );
}
