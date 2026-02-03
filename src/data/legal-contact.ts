/**
 * Centralized contact and company information for legal documents
 * Update this file to change contact info across all legal pages
 */

export const legalContact = {
	// Primary contact
	name: "Borbás Andris",
	email: "me@andrisborbas.com",
	// phone: "+36 1 XXX XXXX", // Optional

	// Address information
	address: {
		street: "Babits Mihály utca 11.",
		postalCode: "4032",
		city: "Debrecen",
		country: "Hungary",
		fullAddress: "Babits Mihály utca 11., 4032 Debrecen, Hungary",
	},

	// Individual responsible persons
	responsible: {
		person1: "Borbás Andris",
		person2: "Kovács Lili",
	},

	// DPO (Data Protection Officer) - if applicable
	dpo: {
		// email: "dpo@example.com",
		available: false, // Set to true if you have a DPO
	},

	// Service providers and links
	providers: {
		cloudflare: {
			name: "Cloudflare, Inc.",
			website: "https://www.cloudflare.com",
			privacyPolicy: "https://www.cloudflare.com/privacy/",
		},
		vercel: {
			name: "Vercel Inc.",
			website: "https://vercel.com",
			privacyPolicy: "https://vercel.com/legal/privacy-policy",
		},
		swetrix: {
			name: "Swetrix",
			website: "https://swetrix.com",
			privacyPolicy: "https://swetrix.com/privacy",
		},
		resend: {
			name: "Resend",
			website: "https://resend.com",
			privacyPolicy: "https://resend.com/privacy",
		},
	},

	// Last updated date
	lastUpdated: "2026-02-03",
} as const;

export type LegalContact = typeof legalContact;
