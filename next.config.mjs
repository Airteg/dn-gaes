/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// const nextConfig = {
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Content-Security-Policy-Report-Only",
//             value: `
//               default-src 'self';
//               script-src 'self' 'unsafe-inline' 'unsafe-eval';
//               style-src 'self' 'unsafe-inline';
//               img-src * blob: data:;
//               connect-src *;
//               font-src 'self';
//               report-uri /csp-report;
//             `
//               .replace(/\s{2,}/g, " ")
//               .trim(),
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
