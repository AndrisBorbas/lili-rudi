import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as z from "zod";

import { sendMagicLinkEmail } from "@/lib/email";
import { storeResponse } from "@/lib/r2";
import { createMagicLinkToken } from "@/lib/tokens";
import type { ApiErrorResponse, SubmitResponseSuccess } from "@/types/api";

const attendeeSchema = z.object({
	name: z.string().min(1, "Kérlek, adj meg egy nevet!"),
	age: z
		.number({ message: "Kérlek, érvényes számot adj meg!" })
		.min(0, "Az életkor nem lehet negatív!")
		.max(130, "Kérlek, ésszerű életkort adj meg!"),
	allergy: z.string().optional(),
	hasAllergy: z.boolean().optional(),
});

const requestSchema = z.discriminatedUnion("attendance", [
	z.object({
		email: z.email("Kérlek, érvényes email címet adj meg!"),
		name: z.string().min(1, "Kérlek, add meg a neved!"),
		comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
		attendance: z.literal("yes"),
		attendees: z
			.array(attendeeSchema)
			.min(1, "Kérlek, adj meg legalább egy résztvevőt!"),
	}),
	z.object({
		email: z.email("Kérlek, érvényes email címet adj meg!"),
		name: z.string().min(1, "Kérlek, add meg a neved!"),
		comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
		attendance: z.literal("no"),
		attendees: z.array(attendeeSchema),
	}),
]);

export async function POST(
	request: NextRequest,
): Promise<NextResponse<SubmitResponseSuccess | ApiErrorResponse>> {
	try {
		const body: unknown = await request.json();

		// Validate the request body
		const validatedData = requestSchema.parse(body);

		// Create a magic link token
		const token = await createMagicLinkToken(validatedData.email);

		// Store the response in R2 with the token
		await storeResponse(validatedData.email, validatedData, token);

		// Send the magic link email
		await sendMagicLinkEmail(validatedData.email, token);

		return NextResponse.json({
			success: true,
			message:
				"Válaszod sikeresen elmentve! Küldtünk egy emailt a szerkesztési linkkel.",
		});
	} catch (error) {
		console.error("Error processing response:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: "Érvénytelen adatok",
					errors: error.issues,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: "Hiba történt a válasz feldolgozása során",
			},
			{ status: 500 },
		);
	}
}

export type ResponseData = z.infer<typeof requestSchema>;
