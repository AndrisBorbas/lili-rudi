/* eslint-disable react/no-children-prop */

import { useForm, useStore } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { SubmitResponseSuccess } from "@/types/api";

const attendeeSchema = z.object({
	name: z.string().min(1, "Kérlek, adj meg egy nevet!"),
	age: z
		.number({ message: "Kérlek, érvényes számot adj meg!" })
		.min(0, "Az életkor nem lehet negatív!")
		.max(130, "Kérlek, ésszerű életkort adj meg!"),

	allergy: z.string().optional(),
	hasAllergy: z.boolean().optional(),
});

const formSchema = z.discriminatedUnion("attendance", [
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

export function ResponseForm({
	initialData,
	editToken: _editToken,
}: {
	initialData?: {
		email: string;
		name: string;
		attendance: "yes" | "no";
		attendees: {
			name: string;
			age: number | "";
			allergy?: string;
			hasAllergy?: boolean;
		}[];
		comment: string;
	};
	editToken?: string;
} = {}) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		defaultValues: {
			email: initialData?.email ?? "",
			name: initialData?.name ?? "",
			attendance: initialData?.attendance ?? ("" as "yes" | "no"),
			attendees:
				initialData?.attendees ??
				([] as {
					name: string;
					age: number | "";
					allergy?: string;
					hasAllergy?: boolean;
				}[]),
			comment: initialData?.comment ?? "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				const response = await fetch("/api/response", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(value),
				});

				const data = (await response.json()) as SubmitResponseSuccess;

				if (response.ok) {
					toast.success(data.message);
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				console.error("Error submitting form:", error);
				toast.error("Hiba történt a válasz küldése során.");
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	const attendance = useStore(form.store, (state) => state.values.attendance);
	const hasAddedInitialAttendee = useRef(false);

	useEffect(() => {
		if (attendance === "yes" && !hasAddedInitialAttendee.current) {
			const currentName = form.getFieldValue("name");
			const currentAttendees = form.getFieldValue("attendees");

			if (currentName && currentAttendees.length === 0) {
				form.setFieldValue("attendees", [
					{
						name: currentName,
						age: "" as const,
						allergy: "",
						hasAllergy: false,
					},
				]);
				hasAddedInitialAttendee.current = true;
			}
		} else if (attendance === "no") {
			hasAddedInitialAttendee.current = false;
		}
	}, [attendance, form]);

	const showAttendees = attendance === "yes";

	return (
		<div className="w-full">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					void form.handleSubmit();
				}}
			>
				<FieldGroup className="gap-4">
					<FieldSet>
						<FieldGroup className="gap-4">
							<form.Field
								name="email"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												aria-invalid={isInvalid}
												placeholder="pelda@email.hu"
											/>
											<FieldDescription>
												Erre az email címre küldünk egy linket, amivel
												módosíthatod a válaszod.
											</FieldDescription>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="name"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Név</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												aria-invalid={isInvalid}
												placeholder="Béta Béla"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="attendance"
								validators={{
									onSubmit: ({ value }) => {
										// @ts-expect-error: value can be null
										// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
										if (!value || value === "") {
											return {
												message: "Kérlek, válaszd ki, hogy tudsz-e jönni!",
											};
										}
										return undefined;
									},
								}}
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<>
											<RadioGroup
												name={field.name}
												value={field.state.value}
												onValueChange={(value) => {
													field.handleChange(value as "yes" | "no");
												}}
											>
												<Field
													orientation="horizontal"
													data-invalid={isInvalid}
												>
													<RadioGroupItem
														value="yes"
														id="attendance-yes"
														aria-invalid={isInvalid}
													/>
													<FieldLabel
														htmlFor="attendance-yes"
														className="font-normal"
													>
														Örömmel részt veszek az esküvőn
													</FieldLabel>
												</Field>
												<Field
													orientation="horizontal"
													data-invalid={isInvalid}
												>
													<RadioGroupItem
														value="no"
														id="attendance-no"
														aria-invalid={isInvalid}
													/>
													<FieldLabel
														htmlFor="attendance-no"
														className="font-normal"
													>
														Sajnos nem tudok részt venni
													</FieldLabel>
												</Field>
											</RadioGroup>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</>
									);
								}}
							/>
						</FieldGroup>
					</FieldSet>
					{showAttendees && (
						<>
							<FieldSeparator />
							<FieldGroup>
								<FieldSet className={"@container"}>
									<FieldLegend>Résztvevők</FieldLegend>
									<FieldDescription>
										Írd be kik jönnek veled együtt az eseményre.
									</FieldDescription>
									<form.Field
										name="attendees"
										mode="array"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<div
													className="grid w-full grid-cols-1 justify-center justify-items-center gap-4 @sm:grid-cols-[repeat(auto-fill,360px)]"
													style={{ gridAutoRows: "max-content" }}
												>
													{field.state.value.map((_, index) => (
														<Card key={`${index}`} className="w-full p-4">
															<div className="space-y-4">
																<div className="flex items-start justify-between gap-4">
																	<div className="flex-1 space-y-4">
																		<form.Field
																			name={`attendees[${index}].name`}
																			children={(subField) => {
																				const subInvalid =
																					subField.state.meta.isTouched &&
																					!subField.state.meta.isValid;
																				return (
																					<Field data-invalid={subInvalid}>
																						<FieldLabel htmlFor={subField.name}>
																							Név
																						</FieldLabel>
																						<Input
																							id={subField.name}
																							name={subField.name}
																							value={subField.state.value}
																							onBlur={subField.handleBlur}
																							onChange={(e) => {
																								subField.handleChange(
																									e.target.value,
																								);
																							}}
																							aria-invalid={subInvalid}
																							placeholder="Név"
																						/>
																						{subInvalid && (
																							<FieldError
																								errors={
																									subField.state.meta.errors
																								}
																							/>
																						)}
																					</Field>
																				);
																			}}
																		/>
																		<form.Field
																			name={`attendees[${index}].age`}
																			children={(subField) => {
																				const subInvalid =
																					subField.state.meta.isTouched &&
																					!subField.state.meta.isValid;
																				return (
																					<Field data-invalid={subInvalid}>
																						<FieldLabel htmlFor={subField.name}>
																							Életkor
																						</FieldLabel>
																						<Input
																							id={subField.name}
																							name={subField.name}
																							type="number"
																							value={subField.state.value}
																							onBlur={subField.handleBlur}
																							onChange={(e) => {
																								subField.handleChange(
																									e.target.value === ""
																										? ""
																										: Number(e.target.value),
																								);
																							}}
																							aria-invalid={subInvalid}
																							placeholder="Életkor"
																							min="0"
																							max="130"
																						/>
																						{subInvalid && (
																							<FieldError
																								errors={
																									subField.state.meta.errors
																								}
																							/>
																						)}
																					</Field>
																				);
																			}}
																		/>
																	</div>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		disabled={field.state.value.length <= 1}
																		onClick={() => {
																			const current = field.state.value;
																			field.handleChange(
																				current.filter((_, i) => i !== index),
																			);
																		}}
																		className="text-destructive hover:text-destructive disabled:text-muted-foreground shrink-0"
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</div>
																<form.Field
																	name={`attendees[${index}].hasAllergy`}
																	children={(subField) => (
																		<>
																			<Field orientation="horizontal">
																				<Checkbox
																					id={subField.name}
																					name={subField.name}
																					checked={
																						subField.state.value ?? false
																					}
																					onCheckedChange={(checked) => {
																						subField.handleChange(
																							checked as boolean,
																						);
																						if (!checked) {
																							form.setFieldValue(
																								`attendees[${index}].allergy`,
																								"",
																							);
																						}
																					}}
																				/>
																				<FieldLabel
																					htmlFor={subField.name}
																					className="font-normal"
																				>
																					Van ételallergiája
																				</FieldLabel>
																			</Field>
																			{subField.state.value && (
																				<form.Field
																					name={`attendees[${index}].allergy`}
																					children={(allergyField) => {
																						const allergyInvalid =
																							allergyField.state.meta
																								.isTouched &&
																							!allergyField.state.meta.isValid;
																						return (
																							<Field
																								data-invalid={allergyInvalid}
																							>
																								<FieldLabel
																									htmlFor={allergyField.name}
																								>
																									Allergia
																								</FieldLabel>
																								<Input
																									id={allergyField.name}
																									name={allergyField.name}
																									value={
																										allergyField.state.value ??
																										""
																									}
																									onBlur={
																										allergyField.handleBlur
																									}
																									onChange={(e) => {
																										allergyField.handleChange(
																											e.target.value,
																										);
																									}}
																									aria-invalid={allergyInvalid}
																									placeholder="pl. mogyoró, laktóz"
																								/>
																								{allergyInvalid && (
																									<FieldError
																										errors={
																											allergyField.state.meta
																												.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			)}
																		</>
																	)}
																/>
															</div>
														</Card>
													))}
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
													<Card className="relative h-full w-full rounded-xl">
														<Button
															type="button"
															variant="ghost"
															onClick={() => {
																field.handleChange([
																	...field.state.value,
																	{
																		name: "",
																		age: "" as const,
																		allergy: "",
																		hasAllergy: false,
																	},
																]);
															}}
															className="border-muted-foreground/50 size-full rounded-xl border-2 border-dashed p-4"
														>
															<div className="w-full space-y-4 text-left">
																<div className="flex items-start justify-between gap-4">
																	<div className="flex-1 space-y-4">
																		<div className="flex-1 space-y-2">
																			<div>Név</div>
																			<Input
																				disabled
																				placeholder="Név"
																				className="w-full"
																			/>
																		</div>
																		<div className="flex-1 space-y-2">
																			<div>Életkor</div>
																			<Input
																				disabled
																				placeholder="Életkor"
																				className="w-full"
																			/>
																		</div>
																	</div>
																	<div className="inline-flex size-10 items-center justify-center">
																		<Trash2 className="text-destructive h-4 w-4" />
																	</div>
																</div>
																<span className="flex items-center gap-2">
																	<div className="border-primary size-3 rounded border" />
																	<span>Van ételallergiája</span>
																</span>
															</div>
															<Card className="glass absolute inset-1 flex items-center justify-center bg-transparent backdrop-blur-[2px]">
																<Plus className="mr-2 h-4 w-4" />
																Résztvevő hozzáadása
															</Card>
														</Button>
													</Card>
												</div>
											);
										}}
									/>
								</FieldSet>
							</FieldGroup>
						</>
					)}
					<FieldSet>
						<form.Field
							name="comment"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Megjegyzés</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => {
												field.handleChange(e.target.value);
											}}
											aria-invalid={isInvalid}
											placeholder="Írd ide a megjegyzésed..."
											autoComplete="off"
											maxLength={3600}
											className="resize-vertical"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldSet>
					<Field orientation="horizontal">
						<Button type="submit" disabled={isSubmitting} className="ml-auto">
							{isSubmitting ? "Küldés..." : "Beküldés"}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
