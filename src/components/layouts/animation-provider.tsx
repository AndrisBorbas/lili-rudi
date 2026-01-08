"use client";

import { createContext, type ReactNode, use, useEffect, useState } from "react";

import { env } from "@/env";

const AnimationContext = createContext<{
	animationKey: number;
	triggerAnimation: () => void;
}>({
	animationKey: 0,
	triggerAnimation: () => {
		/* empty */
	},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useAnimationKey() {
	return use(AnimationContext);
}

export function AnimationProvider({ children }: { children: ReactNode }) {
	const [animationKey, setAnimationKey] = useState(0);

	const triggerAnimation = () => {
		setAnimationKey((prev) => prev + 1);
	};

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (env.NEXT_PUBLIC_NODE_ENV !== "development") return;
			if (e.key === "r" || e.key === "R") {
				triggerAnimation();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<AnimationContext value={{ animationKey, triggerAnimation }}>
			{children}
		</AnimationContext>
	);
}
