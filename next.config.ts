import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[{
      protocol:"https",
      hostname:"*",
    }]
  },
  // experimental:{
  //   // ppr:'incremental'
  //   cacheComponents: true
  // },
  devIndicators:{
   position:'bottom-right'
  }
};

export default nextConfig;
