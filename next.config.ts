
import path from "path"

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",


//       },
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       }
//     ],
//   },
// }

// module.exports = nextConfig






/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // ✅ ADD THIS
      },
    ],
  },
}

module.exports = nextConfig
