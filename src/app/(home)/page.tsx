"use client";

import { useSession } from "next-auth/react";

export default function HomePage() {
	const session = useSession();
	console.log("Session:", session);
	return (
		<div className="font-fancy text-shadow-glow flex h-screen w-full flex-col items-center justify-center p-4">
			<h1 className="animate-fade-in-up relative text-6xl font-extrabold tracking-tight text-white opacity-0 sm:text-[5rem]">
				Lili & Rudi
				<span className="text-background/90 -z-10 w-full border-0 text-7xl transform-3d">
					<span className="animate-fade-in-zoom absolute -top-18 -left-16 -z-10 -rotate-12 opacity-0 delay-500">
						2026.
					</span>
					<span className="animate-fade-in-zoom absolute top-22 left-0 -z-10 rotate-12 opacity-0 delay-700">
						08.
					</span>
					<span className="animate-fade-in-zoom absolute top-24 -right-4 -z-10 -rotate-12 opacity-0 delay-1000">
						14.
					</span>
				</span>
			</h1>

			{/* <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
				Lili & Rudi
			</h1>

			{JSON.stringify(session)} */}
		</div>
	);
}
