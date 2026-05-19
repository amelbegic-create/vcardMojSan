import QRCode from "qrcode";

export async function generateQrPng(url: string): Promise<Buffer> {
  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: 400,
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });
  return buffer;
}
