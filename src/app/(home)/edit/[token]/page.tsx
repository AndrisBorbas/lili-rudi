"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ResponseForm } from "@/components/form/form";
import type { FormData, GetResponseSuccess } from "@/types/api";

export default function EditPage() {
	const params = useParams();
	const token = params.token as string;
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<FormData | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch(`/api/response/${token}`);
				const result = (await response.json()) as GetResponseSuccess;

				if (response.ok) {
					setData(result.data);
				} else {
					setError(result.message ?? "Hiba történt az adatok betöltése során");
				}
			} catch (err) {
				console.error("Error fetching response:", err);
				setError("Hiba történt az adatok betöltése során");
			} finally {
				setLoading(false);
			}
		}

		void fetchData();
	}, [token]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p>Válasz betöltése...</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="mb-4 text-2xl font-bold">Hiba</h1>
					<p className="text-muted-foreground">
						{error ?? "Nem található válasz"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full p-4">
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-3xl font-bold">Válasz szerkesztése</h1>
				<p className="text-muted-foreground">
					Módosítsd a válaszod és küldd be újra.
				</p>
			</div>
			<div className="container mx-auto w-full">
				<ResponseForm initialData={data} editToken={token} />
			</div>
		</div>
	);
}
