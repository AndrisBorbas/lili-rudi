"use client";

import { useSession } from "next-auth/react";

import { useAnimationKey } from "@/components/layouts/animation-provider";

export default function HomePage() {
	const session = useSession();
	const { animationKey } = useAnimationKey();

	console.log("Session:", session);
	return (
		<div className="font-fancy flex h-screen w-full flex-col items-center justify-center p-4">
			<h1
				key={animationKey}
				className="text-primary mt-8 text-center text-6xl font-extrabold tracking-tight sm:text-7xl"
			>
				<span className="animate-fade-in-right animation-duration-[2s] relative mr-18 inline-block opacity-0 [animation-delay:1000ms] sm:mr-22">
					Lili
				</span>
				<br />
				<span className="animate-fade-in-zoom animation-duration-[2s] relative inline-block -translate-y-2 opacity-0 [animation-delay:1500ms]">
					+
				</span>
				<br />
				<span className="animate-fade-in-left animation-duration-[2s] relative ml-18 inline-block opacity-0 [animation-delay:1200ms] sm:ml-22">
					Rudi
				</span>
				<br />
				<span className="text-secondary/50 relative mt-8 inline-block max-w-xl border-0 text-5xl transform-3d sm:text-6xl">
					<span className="animate-fade-in-zoom opacity-0 [animation-delay:2500ms]">
						2026.
					</span>
					<span className="animate-fade-in-zoom opacity-0 [animation-delay:2700ms]">
						08.
					</span>
					<span className="animate-fade-in-zoom opacity-0 [animation-delay:3000ms]">
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
