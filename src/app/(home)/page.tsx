"use client";

import { useSession } from "next-auth/react";

import { DetailsLayout } from "@/components/content/details";
import { FormLayout } from "@/components/content/form";
import { Gallery } from "@/components/content/gallery";
import { Hero } from "@/components/content/hero";
import { MapLayout } from "@/components/content/map";
import { ProgramLayout } from "@/components/content/program";
import { StoryLayout } from "@/components/content/story";

export default function HomePage() {
	const session = useSession();

	console.log("Session:", session);
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
