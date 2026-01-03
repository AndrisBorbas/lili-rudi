"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SignIn() {
	const [loading, setLoading] = useState(false);

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Belépés</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Válassz egy bejelentkezési módot
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div
						className={cn(
							"flex w-full items-center gap-2",
							"flex-col justify-between",
						)}
					>
						<Button
							variant="outline"
							className={cn("w-full gap-2")}
							disabled={loading}
							onClick={() => {
								setLoading(true);
								void signIn("google", { redirectTo: "/" });
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 256 262"
							>
								<path
									fill="#4285F4"
									d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
								/>
								<path
									fill="#34A853"
									d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
								/>
								<path
									fill="#FBBC05"
									d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
								/>
								<path
									fill="#EB4335"
									d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
								/>
							</svg>
							Belépés Google fiókkal
						</Button>
						<Button
							variant="outline"
							className={cn("w-full gap-2")}
							disabled={loading}
							onClick={() => {
								setLoading(true);
								void signIn("facebook", { redirectTo: "/" });
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
							>
								<path
									d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
									fill="#1877F2"
								/>
							</svg>
							Belépés Facebook fiókkal
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
