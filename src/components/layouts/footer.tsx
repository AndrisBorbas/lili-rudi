export function Footer() {
	return (
		<footer className="glass glass-shadow absolute bottom-0 mt-8 w-full py-4">
			<div className="text-muted-foreground container mx-auto text-center text-sm">
				&copy; {new Date().getFullYear()} andrisborbas
			</div>
		</footer>
	);
}
