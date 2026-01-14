/* eslint-disable react/no-children-prop */

import { useForm, useStore } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { SignIn } from "@/components/auth/sign-in";
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
import { cn } from "@/lib/utils";

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
		name: z.string().min(1, "Kérlek, add meg a neved!"),
		comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
		attendance: z.literal("yes"),
		attendees: z
			.array(attendeeSchema)
			.min(1, "Kérlek, adj meg legalább egy résztvevőt!"),
	}),
	z.object({
		name: z.string().min(1, "Kérlek, add meg a neved!"),
		comment: z.string().max(3600, "Maximum 3600 karakter lehet"),
		attendance: z.literal("no"),
		attendees: z.array(attendeeSchema),
	}),
]);

export function ResponseForm() {
	const session = useSession();
	const loggedIn = session.status === "authenticated";

	const form = useForm({
		defaultValues: {
			name: loggedIn ? (session.data.user.name ?? "") : "",
			attendance: "" as "yes" | "no",
			attendees: [] as {
				name: string;
				age: number | "";
				allergy?: string;
				hasAllergy?: boolean;
			}[],
			comment: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			toast.success("A válaszod rögzítve lett. Köszönjük!");
			console.log("Submitted value:", value);
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

	return (
		<div className="w-full max-w-md">
			{session.status === "unauthenticated" && (
				<div className="flex justify-center px-4 pb-4">
					<SignIn
						trigger={
							<Button variant="outline">
								Kérlek jelentkezz be a válaszadáshoz
							</Button>
						}
					/>
				</div>
			)}
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
												disabled={!loggedIn}
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
												disabled={!loggedIn}
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
					{attendance === "yes" && (
						<>
							<FieldSeparator />
							<FieldGroup>
								<FieldSet className={cn()}>
									<FieldLegend>Résztvevők</FieldLegend>
									<FieldDescription>
										Írd be kik jönnek veled az eseményre.
									</FieldDescription>
									<form.Field
										name="attendees"
										mode="array"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<div className="space-y-4">
													{field.state.value.map((_, index) => (
														// eslint-disable-next-line react-x/no-array-index-key
														<Card key={index} className="p-4">
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
																		onClick={() => {
																			const current = field.state.value;
																			field.handleChange(
																				current.filter((_, i) => i !== index),
																			);
																		}}
																		className="text-destructive hover:text-destructive shrink-0"
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
													<Button
														type="button"
														variant="outline"
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
														className="w-full"
													>
														<Plus className="mr-2 h-4 w-4" />
														Résztvevő hozzáadása
													</Button>
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
											disabled={!loggedIn}
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
						<Button type="submit" disabled={!loggedIn} className="ml-auto">
							Beküldés
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
