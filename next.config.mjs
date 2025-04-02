const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        request: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false, // Fix aliasing
      };
    }
    return config;
  },
};

export default nextConfig;
