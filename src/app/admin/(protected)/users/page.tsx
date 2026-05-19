import { prisma } from "@/lib/prisma";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[26px] font-black" style={{ color: "#1a1a1a" }}>Users</h1>
        <p className="text-sm mt-1" style={{ color: "#666" }}>
          Manage admin users who have access to this panel
        </p>
      </div>
      <UserManager initialUsers={users} />
    </div>
  );
}
