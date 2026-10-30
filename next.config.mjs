/** @type {import('next').NextConfig} */
// "export" builds plain HTML into /out for a static site.
// Remove it when the backend (API routes) is added.
const nextConfig = { output: "export", trailingSlash: true };
export default nextConfig;
