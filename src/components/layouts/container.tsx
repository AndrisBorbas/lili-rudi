import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ContainerProps = {} & HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof containerBgVariants> &
	VariantProps<typeof containerAlignVariants>;

const containerBgVariants = cva("", {
	variants: {
		bg: {
			foreground: "bg-foreground",
			background: "bg-background",
			primary: "bg-primary",
			secondary: "bg-secondary",
			accent: "bg-accent",
			transparent: "bg-transparent",
		},
	},
	defaultVariants: {
		bg: "transparent",
	},
});

const containerAlignVariants = cva("container p-4 mx-auto", {
	variants: {
		variant: {
			left: "text-left",
			right: "text-right",
			center: "text-center",
		},
	},
	defaultVariants: {
		variant: "left",
	},
});

export function Container({
	className,
	variant,
	bg,
	children,
	...props
}: ContainerProps) {
	return (
		<div className={cn(containerBgVariants({ bg, className: "w-full" }))}>
			<div
				{...props}
				className={cn(containerAlignVariants({ variant, className }))}
			>
				{children}
			</div>
		</div>
	);
}
