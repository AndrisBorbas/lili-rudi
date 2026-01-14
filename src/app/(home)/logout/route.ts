import { revalidatePath } from "next/cache";

import { signOut } from "@/server/auth";

export async function GET() {
	await signOut({ redirect: false });
	revalidatePath("/", "layout");
	return Response.redirect(
		new URL("/", process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
	);
}
