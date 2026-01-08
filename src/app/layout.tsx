import "@/styles/globals.css";

import { type Metadata } from "next";
import { BenchNine, Dancing_Script } from "next/font/google";

import { AnimationProvider } from "@/components/layouts/animation-provider";
import { Background } from "@/components/layouts/bg";

export const metadata: Metadata = {
	title: "Lili & Rudi",
	description: "Lili és Rudi esküvői oldala",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const benchNine = BenchNine({
	weight: "400",
	variable: "--font-sans",
	subsets: ["latin", "latin-ext"],
});

const dancingScript = Dancing_Script({
	weight: "400",
	variable: "--font-fancy",
	subsets: ["latin", "latin-ext"],
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="hu"
			className={`${benchNine.variable} ${dancingScript.variable} antialiased`}
		>
			<body className="min-h-screen">
				<AnimationProvider>
					<div className="pointer-events-none fixed inset-0 -z-2">
						<div className="relative size-full">
							<div className="absolute inset-0 -z-2 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_90%,--alpha(var(--color-yellow-500)/5%)_40%,--alpha(var(--color-yellow-200)/30%)_90%)]" />
						</div>
					</div>
					<Background />
					{children}
				</AnimationProvider>
			</body>
		</html>
	);
}
