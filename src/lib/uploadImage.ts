import { put } from "@vercel/blob";

export async function uploadImage(
  file: File,
  type: "avatar" | "cover" | "gallery"
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type,
  });

  return blob.url;
}
