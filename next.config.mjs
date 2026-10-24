/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Helps avoid double-mount issues with rich text editors like Tiptap
  output: "standalone",
};

export default nextConfig;
