/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
	) => {
		config.resolve.fallback = {
			fs: false,
			path: false,
			crypto: false,
		};

		return config;
	},
};

export default nextConfig;
