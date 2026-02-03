export default function LegalLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <div className="container max-w-4xl p-4">{children}</div>;
}
