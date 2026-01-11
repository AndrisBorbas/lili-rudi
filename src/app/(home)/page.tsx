"use client";

import { useSession } from "next-auth/react";

import { useAnimationKey } from "@/components/layouts/animation-provider";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	const session = useSession();
	const { animationKey } = useAnimationKey();

	console.log("Session:", session);
	return (
		<div
			className="flex h-screen w-full flex-col items-center justify-center p-4"
			key={animationKey}
		>
			<h1 className="font-fancy text-primary mt-8 text-center text-6xl font-normal tracking-normal sm:text-7xl">
				<span className="animate-fade-in-right animation-duration-[2s] relative mr-18 inline-block opacity-0 [animation-delay:100ms] sm:mr-22">
					Lili
				</span>
				<br />
				<span className="animate-fade-in-zoom animation-duration-[2s] relative inline-block opacity-0 [animation-delay:500ms]">
					&
				</span>
				<br />
				<span className="animate-fade-in-left animation-duration-[2s] relative ml-18 inline-block opacity-0 [animation-delay:200ms] sm:ml-22">
					Rudi
				</span>
			</h1>

			<Button
				variant="link"
				size="lg"
				className="mt-4 text-xl transform-3d sm:text-2xl"
				asChild
			>
				<a
					href="https://maps.app.goo.gl/RxsZpVxoWAKa3C3RA"
					className="animate-fade-in-up animation-duration-[2s] opacity-0 [animation-delay:1000ms]"
					target="_blank"
					rel="noreferrer"
				>
					Degenfeld-Schomburg kastély
				</a>
			</Button>

			<span className="text-secondary/70 relative mt-2 inline-block max-w-xl border-0 text-xl transform-3d sm:text-2xl">
				<span className="animate-fade-in-zoom opacity-0 [animation-delay:1500ms]">
					2026.
				</span>
				<span className="animate-fade-in-zoom opacity-0 [animation-delay:1700ms]">
					08.
				</span>
				<span className="animate-fade-in-zoom opacity-0 [animation-delay:2000ms]">
					14.
				</span>
			</span>

			{/* <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
				Lili & Rudi
			</h1>

			{JSON.stringify(session)} */}
		</div>
	);
}
