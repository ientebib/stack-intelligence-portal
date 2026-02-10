import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/InvestmentThesis.html",
        destination: "/deck-react",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
