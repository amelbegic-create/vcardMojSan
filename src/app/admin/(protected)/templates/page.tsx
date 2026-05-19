import { prisma } from "@/lib/prisma";
import TemplateManager from "@/components/admin/TemplateManager";

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    include: { _count: { select: { cards: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[26px] font-black" style={{ color: "#1a1a1a" }}>Templates</h1>
        <p className="text-sm mt-1" style={{ color: "#666" }}>
          Manage color themes for your digital business cards
        </p>
      </div>
      <TemplateManager initialTemplates={templates} />
    </div>
  );
}
