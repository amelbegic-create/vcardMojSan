export interface CustomLink {
  label: string;
  url: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
}

export interface CardWithTemplate {
  id: string;
  slug: string;
  active: boolean;
  templateId: string | null;
  template: CardTemplate | null;
  name: string;
  jobTitle: string | null;
  company: string | null;
  phone: string | null;
  phone2: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  mapsUrl: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  gallery: string[];
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  whatsapp: string | null;
  // Prisma returns JsonValue which can be any JSON — we cast at usage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customLinks: any;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
