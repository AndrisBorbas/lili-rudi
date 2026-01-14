import "@/styles/globals.css";

import { type Metadata } from "next";
import {
	Alice,
	Herr_Von_Muellerhoff,
	Indie_Flower,
	Ropa_Sans,
} from "next/font/google";
import { Toaster } from "sonner";

import { AnimationProvider } from "@/components/layouts/animation-provider";

export const metadata: Metadata = {
	title: "Lili + Rudi",
	description: "Lili és Rudi esküvői oldala",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const sans = Ropa_Sans({
	weight: "400",
	variable: "--font-sans",
	subsets: ["latin", "latin-ext"],
});

const fancy = Herr_Von_Muellerhoff({
	weight: "400",
	variable: "--font-fancy",
	subsets: ["latin", "latin-ext"],
});

const elegant = Indie_Flower({
	weight: "400",
	variable: "--font-elegant",
	subsets: ["latin", "latin-ext"],
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="hu"
			data-scroll-behavior="smooth"
			className={`${sans.variable} ${fancy.variable} ${elegant.variable} antialiased`}
		>
			<body className="min-h-screen">
				<AnimationProvider>{children}</AnimationProvider>
				<Toaster />
			</body>
		</html>
	);
}
