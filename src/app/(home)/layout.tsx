import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";

export default function HomeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<Navbar />
			<main className="flex h-full w-full flex-col items-center justify-center self-center">
				{children}
			</main>
			<Footer />
		</>
	);
}
