import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getResponse } from "@/lib/r2";
import { validateToken } from "@/lib/tokens";
import type {
	ApiErrorResponse,
	FormData,
	GetResponseSuccess,
} from "@/types/api";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ token: string }> },
): Promise<NextResponse<GetResponseSuccess | ApiErrorResponse>> {
	try {
		const { token } = await params;

		// Validate the token and get the associated email
		const email = await validateToken(token);

		if (!email) {
			return NextResponse.json(
				{
					success: false,
					message: "Érvénytelen vagy lejárt link",
				},
				{ status: 404 },
			);
		}

		// Retrieve the response data
		const responseData = await getResponse(email);

		if (!responseData) {
			return NextResponse.json(
				{
					success: false,
					message: "Nem található válasz ehhez az email címhez",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: responseData.data as FormData,
		});
	} catch (error) {
		console.error("Error retrieving response:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Hiba történt a válasz lekérése során",
			},
			{ status: 500 },
		);
	}
}
