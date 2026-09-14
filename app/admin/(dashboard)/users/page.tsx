import { PageHead } from "@/components/admin/PageHead";
import { getSessionEmail } from "@/lib/auth";
import { listPublicUsers } from "@/lib/users";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
  const [users, currentEmail] = await Promise.all([
    listPublicUsers(),
    getSessionEmail(),
  ]);

  return (
    <div>
      <PageHead
        title="Dashboard users"
        lede="Everyone who can sign in to this dashboard. Add a teammate here instead of sharing your own login."
      />
      <UsersManager
        initial={users}
        currentEmail={currentEmail}
        ownerEmail={process.env.ADMIN_EMAIL?.trim().toLowerCase() || null}
      />
    </div>
  );
}
