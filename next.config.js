/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import createMDX from "@next/mdx"

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	pageExtensions: ["mdx", "ts", "tsx"],
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		remotePatterns: [
			{
				hostname: "picsum.photos",
			}
		],
		unoptimized: true,
	},
	turbopack: {
		rules: {
			"*.svg": {
				loaders: [
					{
						loader: "@svgr/webpack",
						options: {
							icon: true,
						},
					},
				],
				as: "*.js",
			},
		},
	},
};


/** @type {import("@next/mdx").NextMDXOptions} */
const mdxConfig = {
	extension: /\.mdx?$/,
};

const withMDX = createMDX(mdxConfig);

export default withMDX(config);
