// set metadataBase so og images and canonical urls dont break on vercel
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://studentport-beta.vercel.app";
  return raw.replace(/\/+$/, "");
}
