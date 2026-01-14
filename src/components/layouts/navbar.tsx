"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SignIn } from "@/components/auth/sign-in";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavbarProps = {
	isAuthenticated: boolean;
};

const NAV_ITEMS = [
	{ label: "Történetünk", href: "/#tortenetunk" },
	{ label: "Menetrend", href: "/#menetrend" },
	{ label: "Részletek", href: "/#reszletek" },
	{ label: "Helyszín", href: "/#helyszin" },
	{ label: "Visszzajelzés", href: "/#visszajelzes" },
	{ label: "Galéria", href: "/#galeria" },
];

export function Navbar({ isAuthenticated }: NavbarProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="glass-hq glass-shadow sticky top-0 z-20">
			<div className="top-0 container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo/Brand */}
				<Link
					href="/#home"
					scroll
					className="text-primary font-elegant text-xl"
					onClick={() => {
						setIsOpen(false);
					}}
				>
					Lili & Rudi Esküvője
				</Link>

				{/* Desktop Navigation - Right aligned */}
				<div className="hidden lg:flex lg:items-center lg:gap-4">
					{NAV_ITEMS.map((item) => (
						<Button asChild variant="link" key={item.href}>
							<Link
								href={item.href}
								className="text-primary hover:text-primary/80"
							>
								{item.label}
							</Link>
						</Button>
					))}
					{isAuthenticated ? (
						<Button asChild variant="link">
							<Link href="/logout">Kijelentkezés</Link>
						</Button>
					) : (
						<SignIn trigger={<Button variant="link">Bejelentkezés</Button>} />
					)}
				</div>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<div className="lg:hidden">
							<Button variant="ghost" size="icon">
								{isOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</Button>
						</div>
					</SheetTrigger>
					<SheetContent
						className="glass-hq glass-shadow fill-mode-both bg-white/50"
						side="top"
					>
						<SheetHeader>
							<SheetTitle>Navigáció</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col gap-2 px-3 pb-2">
							{isAuthenticated ? (
								<Button
									asChild
									variant="link"
									className="justify-start"
									onClick={() => {
										setIsOpen(false);
									}}
								>
									<Link href="/logout">Kijelentkezés</Link>
								</Button>
							) : (
								<SignIn
									trigger={
										<Button variant="link" className="justify-end">
											Bejelentkezés
										</Button>
									}
								/>
							)}
							{NAV_ITEMS.map((item) => (
								<Button
									asChild
									variant="link"
									className="justify-end"
									key={item.href}
									onClick={() => {
										setIsOpen(false);
									}}
								>
									<Link href={item.href}>{item.label}</Link>
								</Button>
							))}
						</div>
					</SheetContent>
				</Sheet>
				{/* Mobile Menu Toggle */}
			</div>

			{/* Mobile Menu Dropdown */}
			<div
				className={cn(
					"overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
					isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
				)}
			/>
		</nav>
	);
}
