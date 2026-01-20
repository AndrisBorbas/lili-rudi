import { NextResponse } from "next/server";

import { env } from "@/env";
import { getResponse, getTokenForEmail } from "@/lib/r2";
import { createMagicLinkToken } from "@/lib/tokens";

export async function POST(request: Request) {
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

	try {
		const body = (await request.json()) as { email: string };
		const { email } = body;

		// Check if response exists
		const response = await getResponse(email);
		if (!response) {
			return NextResponse.json(
				{ success: false, message: "Response not found" },
				{ status: 404 },
			);
		}

		// Get existing token or create new one if not found
		let token = await getTokenForEmail(email);
		token ??= await createMagicLinkToken(email);

		return NextResponse.json({
			success: true,
			message: "Magic link retrieved successfully",
			data: { token },
		});
	} catch (error) {
		console.error("Error getting magic link:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to get magic link" },
			{ status: 500 },
		);
	}
}
