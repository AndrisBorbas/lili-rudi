import { validateToken } from "@swetrix/captcha-validator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as z from "zod";

import { env } from "@/env";
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

const baseRequestSchema = z.object({
	email: z.email("Kérlek, érvényes email címet adj meg!"),
	name: z.string().min(1, "Kérlek, add meg a neved!"),
	comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
	captchaToken: z.string().min(1, "Kérlek, erősítsd meg, hogy nem vagy robot."),
});

const requestSchema = z.discriminatedUnion("attendance", [
	baseRequestSchema.extend({
		attendance: z.literal("yes"),
		attendees: z
			.array(attendeeSchema)
			.min(1, "Kérlek, adj meg legalább egy résztvevőt!"),
	}),
	baseRequestSchema.extend({
		attendance: z.literal("no"),
		attendees: z.array(attendeeSchema),
	}),
]);

async function validateCaptchaToken(token: string) {
	try {
		const [status, errorMessage] = await validateToken(
			token,
			String(env.SWETRIX_CAPTCHA_SECRET_KEY),
		);

		if (!status) {
			return {
				ok: false,
				message: errorMessage,
			};
		}

		return { ok: true } as const;
	} catch (error) {
		console.error("CAPTCHA validation error:", error);
		return {
			ok: false,
			message: "CAPTCHA ellenőrzési hiba történt",
		};
	}
}

export async function POST(
	request: NextRequest,
): Promise<NextResponse<SubmitResponseSuccess | ApiErrorResponse>> {
	try {
		const body: unknown = await request.json();

		// Validate the request body
		const validatedData = requestSchema.parse(body);

		const captchaResult = await validateCaptchaToken(
			validatedData.captchaToken,
		);
		if (!captchaResult.ok) {
			return NextResponse.json(
				{
					success: false,
					message: "A CAPTCHA ellenőrzése nem sikerült",
					errors: captchaResult.message,
				},
				{ status: 400 },
			);
		}

		const { captchaToken: _captchaToken, ...dataToStore } = validatedData;

		// Create a magic link token
		const token = await createMagicLinkToken(validatedData.email);

		// Store the response in R2 with the token
		await storeResponse(validatedData.email, dataToStore, token);

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
