"use client";

import { useSession } from "next-auth/react";

import { useAnimationKey } from "@/components/layouts/animation-provider";

export default function HomePage() {
	const session = useSession();
	const { animationKey } = useAnimationKey();

	console.log("Session:", session);
	return (
		<div className="font-fancy text-shadow-glow flex h-screen w-full flex-col items-center justify-center p-4">
			<h1
				key={animationKey}
				className="text-primary text-center text-6xl font-extrabold tracking-tight sm:text-7xl"
			>
				<span className="animate-fade-in-right animation-duration-[2s] relative mr-18 inline-block opacity-0 [animation-delay:1000ms] sm:mr-22">
					Lili
				</span>
				<br />
				<span className="animate-fade-in-zoom animation-duration-[2s] relative inline-block opacity-0 [animation-delay:1500ms]">
					&
				</span>
				<br />
				<span className="animate-fade-in-left animation-duration-[2s] relative ml-18 inline-block opacity-0 [animation-delay:1200ms] sm:ml-22">
					Rudi
				</span>
				<span className="text-secondary/50 relative -z-10 inline-block h-8 w-full max-w-xl border-0 text-5xl transform-3d sm:text-6xl">
					<span className="animate-fade-in-zoom absolute -top-4 -left-20 -z-10 rotate-12 opacity-0 [animation-delay:2500ms]">
						2026.
					</span>
					<span className="animate-fade-in-zoom absolute top-12 left-18 -z-10 -rotate-12 opacity-0 [animation-delay:2700ms]">
						08.
					</span>
					<span className="animate-fade-in-zoom absolute top-2 -right-20 -z-10 -rotate-12 opacity-0 [animation-delay:3000ms]">
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
