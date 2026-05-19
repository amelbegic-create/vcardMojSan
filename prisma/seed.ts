import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import ws from "ws";

// Required for Neon serverless in Node.js (not Edge)
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@mojsan.ba";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const existing = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: { email: adminEmail, password: hashed },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("   ⚠️  Promijeni password nakon prvog logina!");
  } else {
    console.log(`ℹ️  Admin user već postoji: ${adminEmail}`);
  }

  const templates = [
    // MojSan.ba brand boje — primarne
    { name: "MojSan Magenta",  accentColor: "#900a7d", bgColor: "#f5e6f4", cardBg: "#ffffff" },
    { name: "MojSan Plava",    accentColor: "#1e9bd7", bgColor: "#e8f4fc", cardBg: "#ffffff" },
    { name: "MojSan Tamna",    accentColor: "#900a7d", bgColor: "#200a22", cardBg: "#3a1040" },
    // Dodatni popularni stilovi
    { name: "Ljubičasta",      accentColor: "#8b5cf6", bgColor: "#faf5ff", cardBg: "#ffffff" },
    { name: "Zelena",          accentColor: "#10b981", bgColor: "#f0fdf4", cardBg: "#ffffff" },
    { name: "Tamna klasa",     accentColor: "#e94560", bgColor: "#1a1a2e", cardBg: "#16213e" },
  ];

  for (const t of templates) {
    const exists = await prisma.template.findFirst({ where: { name: t.name } });
    if (!exists) {
      await prisma.template.create({ data: t });
      console.log(`✅ Template: ${t.name}`);
    } else {
      console.log(`ℹ️  Template postoji: ${t.name}`);
    }
  }

  const sampleSlug = "demo-card";
  const sampleExists = await prisma.card.findUnique({ where: { slug: sampleSlug } });
  if (!sampleExists) {
    const defaultTemplate = await prisma.template.findFirst({ where: { name: "MojSan Magenta" } });
    await prisma.card.create({
      data: {
        slug: sampleSlug,
        name: "John Doe",
        jobTitle: "Software Engineer",
        company: "MojSan Ltd.",
        phone: "+387 61 123 456",
        email: "john@mojsan.ba",
        website: "https://mojsan.ba",
        address: "Sarajevo, Bosna i Hercegovina",
        bio: "Softverski inženjer koji gradi digitalna iskustva.",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        templateId: defaultTemplate?.id ?? null,
        customLinks: [
          { label: "Portfolio", url: "https://portfolio.example.com" },
          { label: "Blog",      url: "https://blog.example.com" },
        ],
      },
    });
    console.log(`✅ Sample kartica kreirana: /card/${sampleSlug}`);
  } else {
    console.log(`ℹ️  Sample kartica već postoji: /card/${sampleSlug}`);
  }

  console.log("\n🎉 Seeding završen!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
