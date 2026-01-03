"use client";

import { useSession } from "next-auth/react";

export default function HomePage() {
	const session = useSession();
	console.log("Session:", session);
	return (
		<div className="container flex min-h-[200vh] flex-col items-center gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
				Lili & Rudi
			</h1>
			<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
				Lili & Rudi
			</h1>

			{JSON.stringify(session)}
		</div>
	);
}
