import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Footer() {
	return (
		<footer className="glass glass-shadow w-full py-4">
			<div className="text-muted-foreground container mx-auto flex flex-col gap-4 text-sm md:flex-row md:justify-between">
				{/* Left side - Legal Links */}
				<div className="flex flex-col flex-wrap gap-4 md:flex-row">
					<Button variant="link" size="sm" className="justify-start" asChild>
						<Link href="/adatvedelmi-nyilatkozat">Adatvédelmi Nyilatkozat</Link>
					</Button>
					<Button variant="link" size="sm" className="justify-start" asChild>
						<Link href="/sutik-politikaja">Sütik Politikája</Link>
					</Button>
					<Button variant="link" size="sm" className="justify-start" asChild>
						<Link href="/gdpr-adatvedelmi-nyilatkozat">GDPR Nyilatkozat</Link>
					</Button>
				</div>

				{/* Right side - Copyright */}
				<div className="flex flex-col flex-wrap">
					<Button variant="link" size="sm" className="justify-end" asChild>
						<Link href="https://andrisborbas.com" target="_blank">
							&copy; {new Date().getFullYear()} andrisborbas
						</Link>
					</Button>
				</div>
			</div>
		</footer>
	);
}
