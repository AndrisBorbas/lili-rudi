import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Footer() {
	return (
		<footer className="glass glass-shadow mt-8 w-full py-4">
			<div className="text-muted-foreground container mx-auto text-center text-sm">
				<Button variant="link" size="sm" asChild>
					<Link href="https://andrisborbas.com" target="_blank">
						&copy; {new Date().getFullYear()} andrisborbas
					</Link>
				</Button>
			</div>
		</footer>
	);
}
