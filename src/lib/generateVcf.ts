import type { CardModel } from "@/generated/prisma/models/Card";

export function generateVcf(card: CardModel): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  lines.push(`FN:${card.name}`);
  lines.push(`N:${card.name};;;;`);

  if (card.jobTitle) lines.push(`TITLE:${card.jobTitle}`);
  if (card.company) lines.push(`ORG:${card.company}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${card.phone}`);
  if (card.phone2) lines.push(`TEL;TYPE=WORK:${card.phone2}`);
  if (card.email) lines.push(`EMAIL:${card.email}`);
  if (card.website) lines.push(`URL:${card.website}`);
  if (card.address) lines.push(`ADR;TYPE=WORK:;;${card.address};;;;`);
  if (card.bio) lines.push(`NOTE:${card.bio}`);

  if (card.facebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${card.facebook}`);
  if (card.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${card.instagram}`);
  if (card.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${card.linkedin}`);

  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}
