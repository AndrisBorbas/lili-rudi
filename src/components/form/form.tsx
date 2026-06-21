/* eslint-disable react/no-children-prop */

import { useForm, useStore } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import Script from "next/script";
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
import { TRACKING_ID } from "@/lib/track";
import type {
	Attendee,
	AttendeeAgeCategory,
	SubmitResponseSuccess,
} from "@/types/api";

const attendeeAgeSchema = z.union([
	z.literal("under_3"),
	z.literal("under_14"),
	z.literal(""),
]);

function normalizeAttendeeAge(age: Attendee["age"]): AttendeeAgeCategory | "" {
	if (age === "under_3" || age === "under_14") {
		return age;
	}

	if (typeof age === "number") {
		if (age < 3) {
			return "under_3";
		}

		if (age < 14) {
			return "under_14";
		}
	}

	return "";
}

const attendeeSchema = z.object({
	name: z.string().min(1, "Kérlek, adj meg egy nevet!"),
	age: attendeeAgeSchema,

	allergy: z.string().optional(),
	hasAllergy: z.boolean().optional(),
});

const attendeeNoValidationSchema = z.object({
	name: z.string(),
	age: attendeeAgeSchema,
	allergy: z.string().optional(),
	hasAllergy: z.boolean().optional(),
});

const formSchema = z.discriminatedUnion("attendance", [
	z.object({
		email: z.email("Kérlek, érvényes email címet adj meg!"),
		name: z.string().min(1, "Kérlek, add meg a neved!"),
		comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
		attendance: z.literal("yes"),
		transport: z.enum(["true", "false"]),
		attendees: z
			.array(attendeeSchema)
			.min(1, "Kérlek, adj meg legalább egy résztvevőt!"),
	}),
	z.object({
		email: z.email("Kérlek, érvényes email címet adj meg!"),
		name: z.string().min(1, "Kérlek, add meg a neved!"),
		comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
		attendance: z.literal("no"),
		transport: z.enum(["true", "false"]),
		// Keep user-entered attendee state intact, but do not block "no" submissions
		// because hidden attendee rows can contain incomplete values.
		attendees: z.array(attendeeNoValidationSchema),
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
		transport: "true" | "false";
		attendees: {
			name: string;
			age: Attendee["age"];
			allergy?: string;
			hasAllergy?: boolean;
		}[];
		comment: string;
	};
	editToken?: string;
} = {}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const captchaContainerRef = useRef<HTMLDivElement>(null);
	// const captchaInputName = "swetrix-captcha-response";
	// const captchaProjectId = TRACKING_ID;

	const form = useForm({
		defaultValues: {
			email: initialData?.email ?? "",
			name: initialData?.name ?? "",
			attendance: initialData?.attendance ?? ("" as "yes" | "no"),
			transport: initialData?.transport ?? "false",
			attendees:
				initialData?.attendees.map((attendee) => ({
					...attendee,
					age: normalizeAttendeeAge(attendee.age),
				})) ??
				([] as {
					name: string;
					age: AttendeeAgeCategory | "";
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
				// const captchaToken =
				// 	captchaContainerRef.current?.querySelector<HTMLInputElement>(
				// 		`input[name="${captchaInputName}"]`,
				// 	)?.value ?? "";

				// if (!captchaToken) {
				// 	console.error("Captcha token is missing");
				// 	toast.error("Kérlek, erősítsd meg, hogy nem vagy robot.");
				// 	return;
				// }

				const response = await fetch("/api/response", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...value,
						// captchaToken,
					}),
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
			{/* <Script
				src="https://cdn.swetrixcaptcha.com/captcha-loader.js"
				onLoad={() => {
					// @ts-expect-error: swetrixCaptchaForceLoad is defined in the loaded script
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					window.swetrixCaptchaForceLoad();
				}}
			/> */}
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
								<form.Field
									name="transport"
									validators={{
										onSubmit: ({ value }) => {
											// @ts-expect-error: value can be null
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
											if (!value || value === "") {
												return {
													message:
														"Kérlek, válaszd ki, hogy igénybe veszed-e a segítséget!",
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
												<FieldLabel htmlFor={field.name}>
													Kérsz segítséget a transzferben?
												</FieldLabel>
												<RadioGroup
													name={field.name}
													value={field.state.value}
													onValueChange={(value) => {
														field.handleChange(value as "true" | "false");
													}}
												>
													<Field
														orientation="horizontal"
														data-invalid={isInvalid}
													>
														<RadioGroupItem
															value="true"
															id="transport-yes"
															aria-invalid={isInvalid}
														/>
														<FieldLabel
															htmlFor="transport-yes"
															className="font-normal"
														>
															Igen, szeretnék segítséget kérni a transzferben.
														</FieldLabel>
													</Field>
													<Field
														orientation="horizontal"
														data-invalid={isInvalid}
													>
														<RadioGroupItem
															value="false"
															id="transport-no"
															aria-invalid={isInvalid}
														/>
														<FieldLabel
															htmlFor="transport-no"
															className="font-normal"
														>
															Nem, megoldom saját autóval/taxival.
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
							<FieldGroup>
								<FieldSet className={"@container"}>
									<FieldLegend>Résztvevők</FieldLegend>
									<FieldDescription>
										Írd be mely személyek jönnek veled együtt az eseményre.
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
														// eslint-disable-next-line react-x/no-array-index-key
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
																				const ageValue = normalizeAttendeeAge(
																					subField.state.value,
																				);
																				return (
																					<Field data-invalid={subInvalid}>
																						<FieldLabel>Korcsoport</FieldLabel>
																						<RadioGroup
																							name={subField.name}
																							value={ageValue}
																							onValueChange={(value) => {
																								subField.handleChange(
																									value as AttendeeAgeCategory,
																								);
																							}}
																						>
																							<Field orientation="horizontal">
																								<RadioGroupItem
																									value="under_3"
																									id={`${subField.name}-under-3`}
																								/>
																								<FieldLabel
																									htmlFor={`${subField.name}-under-3`}
																									className="font-normal"
																								>
																									3 év alatt
																								</FieldLabel>
																							</Field>
																							<Field orientation="horizontal">
																								<RadioGroupItem
																									value="under_14"
																									id={`${subField.name}-under-14`}
																								/>
																								<FieldLabel
																									htmlFor={`${subField.name}-under-14`}
																									className="font-normal"
																								>
																									3-14 év
																								</FieldLabel>
																							</Field>
																						</RadioGroup>
																						<Button
																							type="button"
																							variant="secondary"
																							size="sm"
																							disabled={ageValue === ""}
																							onClick={() => {
																								subField.handleChange("");
																							}}
																							className="h-8 px-0"
																						>
																							Nem gyerek
																						</Button>
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
																					Speciális étkezési igény
																					(ételallergia, intolerancia)
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
																									Allergiák, intoleranciák
																									megnevezése
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
																			<div>Korcsoport</div>
																			<Input
																				disabled
																				placeholder="3 év alatt / 3-14 év"
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
					{/* <FieldSet className="gap-3">
						<FieldLabel htmlFor="captcha">Biztonsági ellenőrzés</FieldLabel>
						<div
							ref={captchaContainerRef}
							id="captcha"
							className="swecaptcha h-[66px] w-[302px]"
							data-theme="light"
							data-project-id={captchaProjectId}
							data-response-input-name={captchaInputName}
							data-api-url="https://succ.andrisborbas.com/backend/v1/captcha"
							data-lang="hu"
						/>
					</FieldSet> */}
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
