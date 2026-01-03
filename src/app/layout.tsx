import "@/styles/globals.css";

import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";


export const metadata: Metadata = {
	title: "Lili & Rudi",
	description: "Lili és Rudi esküvői oldala",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const nunitoSans = Nunito_Sans({
	variable: "--font-sans",
	subsets: ["latin", "latin-ext"],
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="hu" className={`${nunitoSans.variable} antialiased`}>
			<body className="min-h-screen">
				<div className="pointer-events-none fixed inset-0 -z-2">
					<div className="relative size-full">
						<div className="absolute inset-0 -z-2 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_90%,--alpha(var(--color-stone-500)/5%)_40%,--alpha(var(--color-stone-200)/90%)_90%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,--alpha(var(--color-green-950)/5%)_40%,--alpha(var(--color-green-900)/40%)_100%)]" />
					</div>
				</div>
				{children}
			</body>
		</html>
	);
}
