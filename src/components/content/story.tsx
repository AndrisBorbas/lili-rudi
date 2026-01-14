import { Container } from "@/components/layouts/container";
import Story from "@/data/story.mdx";

export function StoryLayout() {
	return (
		<Container>
			<h2 id="tortenetunk">Történetünk</h2>
			<div className="prose prose-stone">
				<Story />
			</div>
		</Container>
	);
}
