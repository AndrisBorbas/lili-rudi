import { NextResponse } from "next/server";

import { env } from "@/env";
import { deleteResponse } from "@/lib/r2";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ email: string }> },
) {
	// Check Basic Auth
	const authHeader = request.headers.get("authorization");
	if (!authHeader?.startsWith("Basic ")) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{
				status: 401,
				headers: {
					"WWW-Authenticate": 'Basic realm="Admin Area"',
				},
			},
		);
	}

	const base64Credentials = authHeader.substring(6);
	const credentials = Buffer.from(base64Credentials, "base64").toString(
		"utf-8",
	);
	const [username, password] = credentials.split(":");

	if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
		return NextResponse.json(
			{ success: false, message: "Invalid credentials" },
			{
				status: 401,
				headers: {
					"WWW-Authenticate": 'Basic realm="Admin Area"',
				},
			},
		);
	}

	// Delete the response
	try {
		const { email } = await params;
		await deleteResponse(email);

		return NextResponse.json({
			success: true,
			message: "Response deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting response:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete response" },
			{ status: 500 },
		);
	}
}
