import { ResponseForm } from "@/components/form/form";
import { Container } from "@/components/layouts/container";

export function FormLayout() {
	return (
		<Container>
			<h2 id="visszajelzes">Visszajelzés</h2>
			<ResponseForm />
		</Container>
	);
}
