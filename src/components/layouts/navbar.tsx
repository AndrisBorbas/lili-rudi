"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SignIn } from "@/components/auth/sign-in";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
	isAuthenticated: boolean;
};

export function Navbar({ isAuthenticated }: NavbarProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="glass-hq glass-shadow sticky top-0 z-20">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo/Brand */}
				<Link href="/" className="text-primary text-xl font-bold">
					Lili & Rudi Esküvője
				</Link>

				{/* Desktop Navigation - Right aligned */}
				<div className="hidden md:flex md:items-center md:gap-4">
					{isAuthenticated ? (
						<Button asChild variant="link">
							<Link href="/logout">Kijelentkezés</Link>
						</Button>
					) : (
						<SignIn trigger={<Button variant="link">Bejelentkezés</Button>} />
					)}
				</div>

				{/* Mobile Menu Toggle */}
				<div className="md:hidden">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Toggle menu"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
					>
						{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</Button>
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			<div
				className={cn(
					"overflow-hidden transition-all duration-300 ease-in-out md:hidden",
					isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div className="flex flex-col gap-2 px-3 py-2">
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
						<SignIn trigger={<Button variant="link">Bejelentkezés</Button>} />
					)}
				</div>
			</div>
		</nav>
	);
}
