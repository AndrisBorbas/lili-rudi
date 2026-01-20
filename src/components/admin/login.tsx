"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AdminLoginProps = {
	onLogin: (username: string, password: string) => void;
	error?: string;
};

export function AdminLogin({ onLogin, error }: AdminLoginProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onLogin(username, password);
	};

	return (
		<div className="flex items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground mt-2">
						Jelentkezz be a válaszok megtekintéséhez
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field>
						<FieldLabel htmlFor="username">Felhasználónév</FieldLabel>
						<Input
							id="username"
							type="text"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							placeholder="admin"
							autoComplete="username"
							required
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="password">Jelszó</FieldLabel>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							placeholder="••••••••"
							autoComplete="current-password"
							required
						/>
					</Field>

					{error && (
						<Field data-invalid>
							<FieldError errors={[error]} />
						</Field>
					)}

					<Button type="submit" className="w-full">
						Bejelentkezés
					</Button>
				</form>
			</Card>
		</div>
	);
}
