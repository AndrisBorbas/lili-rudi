"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
	const session = useSession();
	console.log("Session:", session);
	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
					Lili & Rudi
				</h1>
				{JSON.stringify(session)}
			</div>
		</main>
	);
}
