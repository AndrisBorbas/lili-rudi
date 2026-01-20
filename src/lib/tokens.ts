import { randomBytes } from "crypto";

import { getEmailFromToken, storeToken } from "./r2";

/**
 * Generate a secure random token for magic links
 */
export function generateToken(): string {
	return randomBytes(32).toString("hex");
}

/**
 * Create a magic link token and store it with the associated email
 */
export async function createMagicLinkToken(email: string): Promise<string> {
	const token = generateToken();
	await storeToken(token, email);
	return token;
}

/**
 * Validate a magic link token and return the associated email
 */
export async function validateToken(token: string): Promise<string | null> {
	return await getEmailFromToken(token);
}
