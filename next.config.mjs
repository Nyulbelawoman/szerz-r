/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A "pg" (Postgres) csomagot ne bundle-özze a Next, mert dinamikus require-öket használ.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
