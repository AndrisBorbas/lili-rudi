import { SessionProvider } from "next-auth/react";

import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { auth } from "@/server/auth";

export default async function HomeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	return (
		<>
			<SessionProvider>
				{/* <Navbar isAuthenticated={!!session} /> */}
				<main className="container flex h-full flex-col items-center justify-center self-center">
					{children}
				</main>
				{/* <Footer /> */}
			</SessionProvider>
		</>
	);
}
