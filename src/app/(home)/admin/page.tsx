"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Copy, LogOut, Mail, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminLogin } from "@/components/admin/login";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ApiSuccessResponse, Attendee, FormData } from "@/types/api";

type ResponseWithMetadata = {
	email: string;
	data: FormData;
	updatedAt: string;
};

type ColumnsProps = {
	onDelete: (email: string) => void;
	onResendEmail: (email: string) => void;
	onCopyLink: (email: string) => void;
};

const createColumns = ({
	onDelete,
	onResendEmail,
	onCopyLink,
}: ColumnsProps): ColumnDef<ResponseWithMetadata>[] => [
	{
		accessorKey: "data.name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === "asc");
					}}
					className="-ml-4"
				>
					Név
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.original.data.name}</div>,
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === "asc");
					}}
					className="-ml-4"
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "data.attendance",
		header: "Részvétel",
		cell: ({ row }) => (
			<span
				className={
					row.original.data.attendance === "yes"
						? "text-green-600"
						: "text-red-600"
				}
			>
				{row.original.data.attendance === "yes" ? "✓ Jön" : "✗ Nem jön"}
			</span>
		),
	},
	{
		accessorKey: "attendees",
		header: "Vendégek száma",
		cell: ({ row }) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const attendees = row.original.data.attendees || [];
			return <div>{attendees.length}</div>;
		},
	},
	{
		id: "attendeeNames",
		header: "Vendégek nevei",
		cell: ({ row }) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const attendees = row.original.data.attendees || [];
			return (
				<div className="max-w-xs">
					{attendees.map((a: Attendee, i: number) => (
						<div key={i} className="text-sm">
							{a.name} ({a.age || "?"})
						</div>
					))}
				</div>
			);
		},
	},
	{
		id: "allergies",
		header: "Allergiák",
		cell: ({ row }) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const attendees = row.original.data.attendees || [];
			const withAllergies = attendees.filter((a: Attendee) => a.hasAllergy);
			if (withAllergies.length === 0)
				return <div className="text-muted-foreground">-</div>;
			return (
				<div className="max-w-xs">
					{withAllergies.map((a: Attendee, i: number) => (
						<div key={i} className="text-sm">
							{a.name}: {a.allergy}
						</div>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "data.comment",
		header: "Megjegyzés",
		cell: ({ row }) => {
			const comment = row.original.data.comment;
			if (!comment) return <div className="text-muted-foreground">-</div>;
			return (
				<div className="max-w-xs truncate" title={comment}>
					{comment}
				</div>
			);
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === "asc");
					}}
					className="-ml-4"
				>
					Frissítve
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-sm">
				{new Date(row.original.updatedAt).toLocaleDateString("hu-HU", {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}
			</div>
		),
	},
	{
		id: "actions",
		header: "Műveletek",
		cell: ({ row }) => (
			<div className="flex gap-1">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						onResendEmail(row.original.email);
					}}
					className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
					title="Magic link újraküldése"
				>
					<Mail className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						onCopyLink(row.original.email);
					}}
					className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
					title="Magic link másolása"
				>
					<Copy className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						onDelete(row.original.email);
					}}
					className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
					title="Válasz törlése"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		),
	},
];

export default function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authError, setAuthError] = useState<string>();
	const [credentials, setCredentials] = useState<{
		username: string;
		password: string;
	} | null>(null);
	const [responses, setResponses] = useState<ResponseWithMetadata[]>([]);
	const [loading, setLoading] = useState(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const handleLogin = async (username: string, password: string) => {
		setAuthError(undefined);
		setLoading(true);

		try {
			const auth = Buffer.from(`${username}:${password}`).toString("base64");
			const response = await fetch("/api/admin/responses", {
				headers: {
					Authorization: `Basic ${auth}`,
				},
			});

			if (response.ok) {
				const data = (await response.json()) as ApiSuccessResponse<
					ResponseWithMetadata[]
				>;
				setResponses(data.data);
				setIsAuthenticated(true);
				setCredentials({ username, password });
			} else {
				setAuthError("Hibás felhasználónév vagy jelszó");
			}
		} catch (error) {
			console.error("Login error:", error);
			setAuthError("Hiba történt a bejelentkezés során");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		setCredentials(null);
		setResponses([]);
	};

	const handleDelete = async (email: string) => {
		if (
			!confirm(
				`Biztosan törölni szeretnéd ${email} válaszát? Ez a művelet nem vonható vissza.`,
			)
		) {
			return;
		}

		if (!credentials) return;

		try {
			const auth = Buffer.from(
				`${credentials.username}:${credentials.password}`,
			).toString("base64");
			const response = await fetch(
				`/api/admin/responses/${encodeURIComponent(email)}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Basic ${auth}`,
					},
				},
			);

			if (response.ok) {
				// Remove from local state
				setResponses((prev) => prev.filter((r) => r.email !== email));
			} else {
				toast.error("Hiba történt a törlés során");
			}
		} catch (error) {
			console.error("Delete error:", error);
			toast.error("Hiba történt a törlés során");
		}
	};

	const handleResendEmail = async (email: string) => {
		if (!credentials) return;

		if (!confirm(`Újraküldöd a magic linket erre az email címre: ${email}?`)) {
			return;
		}

		try {
			const auth = Buffer.from(
				`${credentials.username}:${credentials.password}`,
			).toString("base64");
			const response = await fetch("/api/admin/resend-magic-link", {
				method: "POST",
				headers: {
					Authorization: `Basic ${auth}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				toast.success(`Magic link elküldve ${email} címre`);
			} else {
				toast.error("Hiba történt az email küldése során");
			}
		} catch (error) {
			console.error("Resend email error:", error);
			toast.error("Hiba történt az email küldése során");
		}
	};

	const handleCopyLink = async (email: string) => {
		if (!credentials) return;

		try {
			const auth = Buffer.from(
				`${credentials.username}:${credentials.password}`,
			).toString("base64");
			const response = await fetch("/api/admin/get-magic-link", {
				method: "POST",
				headers: {
					Authorization: `Basic ${auth}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				const data = (await response.json()) as ApiSuccessResponse<{
					token: string;
				}>;
				const magicLink = `${window.location.origin}/edit/${data.data.token}`;
				await navigator.clipboard.writeText(magicLink);
				toast.success("Magic link a vágólapra másolva!");
			} else {
				toast.error("Hiba történt a link generálása során");
			}
		} catch (error) {
			console.error("Copy link error:", error);
			toast.error("Hiba történt a link generálása során");
		}
	};

	const columns = createColumns({
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		onDelete: handleDelete,
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		onResendEmail: handleResendEmail,
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		onCopyLink: handleCopyLink,
	});

	useEffect(() => {
		if (isAuthenticated && credentials) {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			const interval = setInterval(async () => {
				try {
					const auth = Buffer.from(
						`${credentials.username}:${credentials.password}`,
					).toString("base64");
					const response = await fetch("/api/admin/responses", {
						headers: {
							Authorization: `Basic ${auth}`,
						},
					});

					if (response.ok) {
						const data = (await response.json()) as ApiSuccessResponse<
							ResponseWithMetadata[]
						>;
						setResponses(data.data);
					}
				} catch (error) {
					console.error("Auto-refresh error:", error);
				}
			}, 30000); // Refresh every 30 seconds

			return () => {
				clearInterval(interval);
			};
		}
	}, [isAuthenticated, credentials]);

	const table = useReactTable({
		data: responses,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
	});

	if (!isAuthenticated) {
		return <AdminLogin onLogin={handleLogin} error={authError} />;
	}

	const totalAttending = responses.filter(
		(r) => r.data.attendance === "yes",
	).length;
	const totalNotAttending = responses.filter(
		(r) => r.data.attendance === "no",
	).length;
	const totalGuests = responses.reduce(
		(sum, r) => sum + (r.data.attendees.length || 0),
		0,
	);
	const totalKids = responses.reduce((sum, r) => {
		const kidsCount = r.data.attendees.filter((a) => Number(a.age) < 14).length;
		return sum + (kidsCount || 0);
	}, 0);

	return (
		<div className="container mx-auto p-4">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Esküvői Válaszok</h1>
					<p className="text-muted-foreground mt-1">
						{responses.length} válasz összesen
					</p>
				</div>
				<Button variant="outline" onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					Kijelentkezés
				</Button>
			</div>

			<div className="mb-6 grid gap-4 md:grid-cols-4">
				<Card className="p-4">
					<div className="text-muted-foreground text-sm">Jönnek</div>
					<div className="text-2xl font-bold text-green-600">
						{totalAttending}
					</div>
				</Card>
				<Card className="p-4">
					<div className="text-muted-foreground text-sm">Nem jönnek</div>
					<div className="text-2xl font-bold text-red-600">
						{totalNotAttending}
					</div>
				</Card>
				<Card className="p-4">
					<div className="text-muted-foreground text-sm">Összes vendég</div>
					<div className="text-2xl font-bold">{totalGuests}</div>
				</Card>
				<Card className="p-4">
					<div className="text-muted-foreground text-sm">
						Összes gyerek (&lt;14)
					</div>
					<div className="text-2xl font-bold text-yellow-600">{totalKids}</div>
				</Card>
			</div>

			<Card className="p-4">
				<div className="mb-4">
					<Input
						placeholder="Keresés név, email vagy megjegyzés alapján..."
						value={globalFilter}
						onChange={(e) => {
							setGlobalFilter(e.target.value);
						}}
						className="max-w-md"
					/>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="text-muted-foreground h-24 text-center"
									>
										Még nincs válasz.
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<div className="text-muted-foreground mt-4 text-sm">
					{table.getFilteredRowModel().rows.length} találat{" "}
					{globalFilter && `"${globalFilter}" keresésre`}
				</div>
			</Card>
		</div>
	);
}
