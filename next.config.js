/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.svg$/i,
			use: [
				{
					loader: "@svgr/webpack",
					options: {
						svgProps: {
							fill: "none",
							stroke: "currentColor",
							strokeWidth: 2,
						},
						replaceAttrValues: {
							fill: "stroke",
						},
					},
				},
			],
		});
		return config;
	},
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js",
			},
		},
	},
};

export default config;
