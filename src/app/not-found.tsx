import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";

export default function NotFound() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<Navbar />
			<main className="flex h-full w-full flex-col items-center justify-center self-center">
				<div className="flex h-full w-full flex-col items-center justify-center gap-4">
					<h1 className="text-4xl font-bold">404 - Nem található</h1>
					<p className="text-center text-lg">
						Sajnáljuk, de az általad keresett oldal nem található.
					</p>
				</div>
			</main>
			<Footer />
		</div>
	);
}
