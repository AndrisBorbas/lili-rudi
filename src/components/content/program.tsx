import Image from "next/image";

import { Container } from "@/components/layouts/container";
import { programs } from "@/data/program";
import { cn } from "@/lib/utils";

type ProgramCardProps = {
	time: string | null;
	title: string;
	icon: string;
	flipped?: boolean;
};

function ProgramCard({ time, title, icon, flipped }: ProgramCardProps) {
	return (
		<>
			<div
				className={cn(
					"mb-4 flex flex-col sm:mb-8",
					flipped && "translate-y-1/2",
				)}
			>
				<Image
					src={`/icons1/${icon}`}
					width={256}
					height={256}
					alt={title}
					className={cn("mx-auto size-36 brightness-0 invert-100 sm:size-52")}
				/>
				<div className="-mt-3 text-center text-white sm:-mt-6">
					{time && <h4 className="font-sans text-2xl sm:text-3xl">{time}</h4>}
					<h3 className="font-sans text-xl sm:text-2xl">{title}</h3>
				</div>
			</div>
		</>
	);
}

export function ProgramLayout() {
	return (
		<Container variant="right" bg="secondary">
			<h2 id="menetrend" className="text-white">
				Menetrend
			</h2>
			<div className="relative ml-auto grid grid-cols-2 items-center">
				<div className="absolute top-0 left-[calc(50%-1px)] h-full w-[2px]">
					<svg
						className="h-full w-full"
						viewBox="0 0 2 100"
						preserveAspectRatio="none"
					>
						<line
							x1="1"
							y1="0"
							x2="1"
							y2="100"
							stroke="#fff"
							strokeWidth="2"
							strokeDasharray="2 3"
						/>
					</svg>
				</div>
				{programs.map((program, index) => (
					<ProgramCard
						key={program.title}
						time={program.time}
						title={program.title}
						icon={program.icon}
						flipped={index % 2 === 1}
					/>
				))}
			</div>
		</Container>
	);
}
