"use client";

import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layouts/container";

const WEDDING_DATE_ISO = "2026-08-14T17:00:00+02:00";

type CountdownState = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isComplete: boolean;
};

function getCountdownState(targetDate: Date): CountdownState {
	const now = Date.now();
	const targetTime = targetDate.getTime();
	const remainingMs = Math.max(targetTime - now, 0);

	const totalSeconds = Math.floor(remainingMs / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		days,
		hours,
		minutes,
		seconds,
		isComplete: remainingMs === 0,
	};
}

function formatTwoDigits(value: number) {
	return value.toString().padStart(2, "0");
}

function DigitSlot({ digit }: { digit: string }) {
	return (
		<span
			className="inline-flex w-[1.5ch] justify-center"
			suppressHydrationWarning
		>
			{digit}
		</span>
	);
}

function DigitGroup({
	value,
	minDigits = 2,
}: {
	value: string;
	minDigits?: number;
}) {
	const digits = value.padStart(minDigits, "0").split("");
	const occurrences = new Map<string, number>();

	return (
		<span className="inline-flex justify-center">
			{digits.map((digit) => {
				const occurrence = (occurrences.get(digit) ?? 0) + 1;
				occurrences.set(digit, occurrence);

				return <DigitSlot key={`${digit}-${occurrence}`} digit={digit} />;
			})}
		</span>
	);
}

export function Countdown() {
	const weddingDate = useMemo(() => new Date(WEDDING_DATE_ISO), []);
	const [countdown, setCountdown] = useState<CountdownState>(() =>
		getCountdownState(weddingDate),
	);
	const formattedHours = formatTwoDigits(countdown.hours);
	const formattedMinutes = formatTwoDigits(countdown.minutes);
	const formattedSeconds = formatTwoDigits(countdown.seconds);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setCountdown(getCountdownState(weddingDate));
		}, 1000);

		return () => {
			window.clearInterval(interval);
		};
	}, [weddingDate]);

	return (
		<Container variant="center" className="" bg="secondary">
			<div className="mx-auto w-full max-w-3xl sm:p-8">
				<h3 className="text-2xl text-white">Visszaszámlálás</h3>

				{countdown.isComplete ? (
					<p className="text-foreground mt-4 text-lg">Eljött a nagy nap!</p>
				) : (
					<>
						<p className="text-foreground/70 mt-2 font-sans text-base tracking-widest">
							Már csak
						</p>
						<div className="mt-5 space-y-3" aria-live="polite">
							<div className="text-center">
								<p className="font-elegant text-5xl leading-none text-white sm:text-6xl">
									<span className="inline-flex min-w-[3.1em] justify-center">
										<DigitGroup
											value={countdown.days.toString()}
											minDigits={1}
										/>
									</span>
								</p>
								<p className="text-foreground/70 mt-2 text-base tracking-widest">
									nap
								</p>
							</div>
							<div className="text-center">
								<p className="font-elegant inline-flex items-center justify-center text-4xl leading-none text-white sm:text-5xl">
									<DigitGroup value={formattedHours} />
									<span className="inline-flex w-[0.45em] justify-center">
										:
									</span>
									<DigitGroup value={formattedMinutes} />
									<span className="inline-flex w-[0.45em] justify-center">
										:
									</span>
									<DigitGroup value={formattedSeconds} />
								</p>
								<p className="text-foreground/70 mt-2 text-base tracking-widest">
									óra van hátra.
								</p>
							</div>
						</div>
					</>
				)}
			</div>
		</Container>
	);
}
