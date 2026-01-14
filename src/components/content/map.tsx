import Head from "next/head";

import { Container } from "@/components/layouts/container";

export function MapLayout() {
	return (
		<Container bg="secondary" variant="right">
			<h2 id="helyszin">Helyszín</h2>
			<div className="ml-auto flex h-full w-full content-end grayscale-66 sepia-33 lg:w-1/2">
				<Head>
					<link
						rel="preload"
						as="document"
						href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189282.68534317112!2d21.366683134390833!3d47.60762689800636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47476ef253405471%3A0x4cf1121c585b0017!2sDegenfeld-Schomburg%20Castle!5e1!3m2!1sen!2shu!4v1768342796283!5m2!1sen!2shu"
					/>
				</Head>
				<iframe
					title="Google Maps térkép"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189282.68534317112!2d21.366683134390833!3d47.60762689800636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47476ef253405471%3A0x4cf1121c585b0017!2sDegenfeld-Schomburg%20Castle!5e1!3m2!1sen!2shu!4v1768342796283!5m2!1sen!2shu"
					style={{ border: 0 }}
					className="h-80 w-full"
					width="100%"
					height="100%"
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				/>
			</div>
		</Container>
	);
}
