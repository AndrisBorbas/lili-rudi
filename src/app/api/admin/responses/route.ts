import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/env";
import { listAllResponses } from "@/lib/r2";
import type { FormData } from "@/types/api";

type ResponseWithMetadata = {
	email: string;
	data: FormData;
	updatedAt: string;
};

export async function GET(request: NextRequest) {
	// Check Basic Auth
	const authHeader = request.headers.get("authorization");

	if (!authHeader?.startsWith("Basic ")) {
		return NextResponse.json(
			{ success: false, message: "Authentication required" },
			{
				status: 401,
				headers: {
					"WWW-Authenticate": 'Basic realm="Admin Dashboard"',
				},
			},
		);
	}

	// Decode and verify credentials
	const base64Credentials = authHeader.split(" ")[1];
	const credentials = Buffer.from(base64Credentials ?? "", "base64").toString(
		"utf-8",
	);
	const [username, password] = credentials.split(":");

	if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
		return NextResponse.json(
			{ success: false, message: "Invalid credentials" },
			{
				status: 401,
				headers: {
					"WWW-Authenticate": 'Basic realm="Admin Dashboard"',
				},
			},
		);
	}

	// Fetch all responses
	try {
		const responses = await listAllResponses();

		return NextResponse.json({
			success: true,
			data: responses as ResponseWithMetadata[],
			count: responses.length,
		});
	} catch (error) {
		console.error("Error fetching responses:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch responses" },
			{ status: 500 },
		);
	}
}
