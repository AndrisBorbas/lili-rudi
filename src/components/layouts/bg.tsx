"use client";

import { motion, type Variants } from "motion/react";

import BottomLeft from "@/assets/bl.svg";
import BottomRight from "@/assets/br.svg";
import TopMid from "@/assets/mid.svg";
import TopLeft from "@/assets/tl.svg";
import TopRight from "@/assets/tr.svg";

import { useAnimationKey } from "./animation-provider";

const svgContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.3,
		},
	},
};

const createSvgVariants = (origin: string) =>
	({
		hidden: {
			opacity: 0,
			scale: 0.8,
			clipPath: `circle(0% at ${origin})`,
		},
		visible: {
			opacity: 1,
			scale: 1,
			clipPath: `circle(150% at ${origin})`,
			transition: {
				duration: 1.5,
				ease: [0.43, 0.13, 0.23, 0.96],
				clipPath: {
					duration: 2,
					ease: [0.65, 0, 0.35, 1],
				},
			},
		},
	}) as const satisfies Variants;

export function Background() {
	const { animationKey } = useAnimationKey();

	return (
		<div className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-xl">
			<motion.div
				key={animationKey}
				className="text-secondary relative size-full"
				initial="hidden"
				animate="visible"
				variants={svgContainerVariants}
			>
				<motion.div
					className="absolute top-2 left-2 w-32"
					variants={createSvgVariants("0% 0%")}
				>
					<TopLeft className="w-full drop-shadow-[0_0_8px_currentColor]" />
				</motion.div>
				<motion.div
					className="absolute top-2 right-2 left-2 mx-auto w-32"
					variants={createSvgVariants("50% 0%")}
				>
					<TopMid className="w-full drop-shadow-[0_0_8px_currentColor]" />
				</motion.div>
				<motion.div
					className="absolute top-2 right-2 w-32"
					variants={createSvgVariants("100% 0%")}
				>
					<TopRight className="w-full drop-shadow-[0_0_8px_currentColor]" />
				</motion.div>
				<motion.div
					className="absolute right-2 bottom-2 w-32"
					variants={createSvgVariants("100% 100%")}
				>
					<BottomRight className="w-full drop-shadow-[0_0_8px_currentColor]" />
				</motion.div>
				<motion.div
					className="absolute bottom-2 left-2 w-32"
					variants={createSvgVariants("0% 100%")}
				>
					<BottomLeft className="w-full drop-shadow-[0_0_8px_currentColor]" />
				</motion.div>
			</motion.div>
		</div>
	);
}
