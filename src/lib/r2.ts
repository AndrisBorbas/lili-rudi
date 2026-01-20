import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { createHash } from "crypto";

import { env } from "@/env";

// Initialize R2 client
const r2Client = new S3Client({
	region: "auto",
	endpoint: `https://${env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

/**
 * Hash an email address to create a consistent key for R2 storage
 */
export function hashEmail(email: string): string {
	return createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

/**
 * Store a form response in R2
 */
export async function storeResponse(
	email: string,
	data: unknown,
	token?: string,
) {
	const key = `responses/${hashEmail(email)}.json`;

	await r2Client.send(
		new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
			Body: JSON.stringify({
				email,
				data,
				token,
				updatedAt: new Date().toISOString(),
			}),
			ContentType: "application/json",
		}),
	);
}

/**
 * Retrieve a form response from R2
 */
export async function getResponse(email: string) {
	const key = `responses/${hashEmail(email)}.json`;

	try {
		const response = await r2Client.send(
			new GetObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: key,
			}),
		);

		const body = await response.Body?.transformToString();
		if (!body) return null;

		return JSON.parse(body) as {
			email: string;
			data: unknown;
			updatedAt: string;
		};
	} catch (error) {
		// If the object doesn't exist, return null
		if ((error as { name?: string }).name === "NoSuchKey") {
			return null;
		}
		throw error;
	}
}

/**
 * Store a token mapping (token -> email) in R2
 */
export async function storeToken(token: string, email: string) {
	const key = `tokens/${token}.json`;

	await r2Client.send(
		new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
			Body: JSON.stringify({
				email,
				createdAt: new Date().toISOString(),
			}),
			ContentType: "application/json",
		}),
	);
}

/**
 * Retrieve an email address from a token
 */
export async function getEmailFromToken(token: string): Promise<string | null> {
	const key = `tokens/${token}.json`;

	try {
		const response = await r2Client.send(
			new GetObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: key,
			}),
		);

		const body = await response.Body?.transformToString();
		if (!body) return null;

		const data = JSON.parse(body) as { email: string };
		return data.email;
	} catch (error) {
		// If the token doesn't exist, return null
		if ((error as { name?: string }).name === "NoSuchKey") {
			return null;
		}
		throw error;
	}
}

/**
 * List all form responses from R2
 */
export async function listAllResponses() {
	try {
		const response = await r2Client.send(
			new ListObjectsV2Command({
				Bucket: env.R2_BUCKET_NAME,
				Prefix: "responses/",
			}),
		);

		if (!response.Contents || response.Contents.length === 0) {
			return [];
		}

		// Fetch all response objects
		const responses = await Promise.all(
			response.Contents.map(async (item) => {
				if (!item.Key) return null;

				try {
					const obj = await r2Client.send(
						new GetObjectCommand({
							Bucket: env.R2_BUCKET_NAME,
							Key: item.Key,
						}),
					);

					const body = await obj.Body?.transformToString();
					if (!body) return null;

					return JSON.parse(body) as {
						email: string;
						data: unknown;
						updatedAt: string;
					};
				} catch {
					return null;
				}
			}),
		);

		// Filter out null values and return
		return responses.filter((r) => r !== null);
	} catch (error) {
		console.error("Error listing responses:", error);
		return [];
	}
}

/**
 * Get the existing token for an email address from the stored response
 */
export async function getTokenForEmail(email: string): Promise<string | null> {
	const response = await getResponse(email);
	if (!response) return null;

	const data = response as { token?: string };
	return data.token ?? null;
}

/**
 * Delete a form response from R2
 */
export async function deleteResponse(email: string) {
	const key = `responses/${hashEmail(email)}.json`;

	await r2Client.send(
		new DeleteObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
		}),
	);
}
