"use client";

import { DetailsLayout } from "@/components/content/details";
import { FormLayout } from "@/components/content/form";
import { Gallery } from "@/components/content/gallery";
import { Hero } from "@/components/content/hero";
import { MapLayout } from "@/components/content/map";
import { ProgramLayout } from "@/components/content/program";
import { StoryLayout } from "@/components/content/story";

export default function HomePage() {
	return (
		<>
			<Hero />
			<StoryLayout />
			<ProgramLayout />
			<DetailsLayout />
			<MapLayout />
			<FormLayout />
			<Gallery />
		</>
	);
}
