import "@/styles/globals.css";

import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "Lili & Rudi",
	description: "Lili és Rudi esküvői oldala",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const nunitoSans = Nunito_Sans({ variable: "--font-sans" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="hu" className={`${nunitoSans.variable} antialiased`}>
			<SessionProvider>
				<body>{children}</body>
			</SessionProvider>
		</html>
	);
}
