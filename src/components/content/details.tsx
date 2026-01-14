import { Container } from "@/components/layouts/container";
import Details from "@/data/details.mdx";

export function DetailsLayout() {
	return (
		<Container>
			<h2 id="reszletek">Részletek</h2>
			<div className="prose prose-stone">
				<Details />
			</div>
		</Container>
	);
}
