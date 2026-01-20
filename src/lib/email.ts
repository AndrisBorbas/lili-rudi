import { Resend } from "resend";

import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendMagicLinkEmail(email: string, token: string) {
	const magicLink = `${env.APP_URL}/edit/${token}`;

	try {
		await resend.emails.send({
			from: "Lili & Rudi Esküvője <noreply@liliesrudi.hu>",
			to: email,
			subject: "A válaszod szerkesztése",
			html: `
<!doctype html>
<html lang="hu">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Válasz szerkesztése</title>
	</head>
	<body
		style="
			font-family:
				-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto,
				&quot;Helvetica Neue&quot;, Arial, sans-serif;
			line-height: 1.6;
			color: #312d27;
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
		"
	>
		<div
			style="
				background-color: #f3ebe3;
				border-radius: 8px;
				padding: 30px;
				margin: 20px 0;
			"
		>
			<h1 style="color: #b5915e; margin-top: 0">Köszönjük a válaszod!</h1>
			<p style="font-size: 16px; margin: 20px 0">
				Megkaptuk a válaszodat az esküvőnkkel kapcsolatban.
			</p>
			<p style="font-size: 16px; margin: 20px 0">
				Ha szeretnéd módosítani a válaszodat, kattints az alábbi linkre:
			</p>
			<div style="text-align: center; margin-top: 30px">
				<a
					href="${magicLink}"
					style="
						display: inline-block;
						background-color: hsl(35, 32%, 59%);
						color: white;
						padding: 14px 28px;
						text-decoration: none;
						border-radius: 6px;
						font-weight: 600;
						font-size: 16px;
					"
				>
					Válasz szerkesztése
				</a>
			</div>
			<div style="text-align: center; margin: 20px 0 30px 0">
				<a href="${magicLink}" style="color: #978872; font-size: 12px">
					${magicLink}
				</a>
			</div>
			<p style="font-size: 14px; color: #978872; margin: 20px 0">
				Ezt a linket bármikor használhatod a válaszod módosítására. Kérünk,
				őrizd meg biztonságos helyen!
			</p>
			<p style="font-size: 14px; color: #978872; margin-top: 30px">
				Ha nem te küldted ezt a kérést, nyugodtan figyelmen kívül hagyhatod ezt
				az emailt.
			</p>
		</div>
		<div
			style="
				text-align: center;
				margin-top: 30px;
				padding-top: 20px;
				border-top: 1px solid #f3ebe3;
			"
		>
			<p style="font-size: 12px; color: #ddcbb9">Lili & Rudi</p>
		</div>
	</body>
</html>
            `,
			text: `
Köszönjük a válaszod!

Megkaptuk a válaszodat az esküvőnkkel kapcsolatban.

Ha szeretnéd módosítani a válaszodat, használd az alábbi linket:
${magicLink}

Ezt a linket bármikor használhatod a válaszod módosítására. Kérünk, őrizd meg biztonságos helyen!

Ha nem te küldted ezt a kérést, nyugodtan figyelmen kívül hagyhatod ezt az emailt.

Lili & Rudi
            `,
		});
	} catch (error) {
		console.error("Error sending magic link email:", error);
		throw new Error("Failed to send email");
	}
}
