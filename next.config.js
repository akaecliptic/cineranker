/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "twemoji.maxcdn.com",
				port: "",
				pathname: "/v/latest/**",
			},
			{
				protocol: "https",
				hostname: "cdn.jsdelivr.net",
				port: "",
				pathname: "/gh/jdecked/**",
			},
			{
				protocol: "https",
				hostname: "www.themoviedb.org",
				port: "",
				pathname: "/t/p/**",
			},
		],
	},
};

module.exports = nextConfig;
