import { cn } from "@/lib/utils";

export function H1({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h1
			className={cn(
				"mt-8 mb-4 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
				className,
			)}
			{...restProps}
		>
			{children}
		</h1>
	);
}

export function H2({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h2
			className={cn(
				"mt-6 mb-2 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
				className,
			)}
			{...restProps}
		>
			{children}
		</h2>
	);
}

export function H3({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn(
				"mt-4 mb-2 scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
			{...restProps}
		>
			{children}
		</h3>
	);
}

export function H4({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h4
			className={cn(
				"mt-4 mb-2 scroll-m-20 text-xl font-semibold tracking-tight",
				className,
			)}
			{...restProps}
		>
			{children}
		</h4>
	);
}

export function A({
	className,
	children,
	...restProps
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<a
			className={cn(
				"text-primary hover:text-primary/80 underline underline-offset-4 transition-colors",
				className,
			)}
			target="_blank"
			{...restProps}
		>
			{children}
		</a>
	);
}

export function P({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn("mb-2 leading-7 not-first:mt-4", className)}
			{...restProps}
		>
			{children}
		</p>
	);
}

export function UL({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLUListElement>) {
	return (
		<ul
			className={cn("my-4 ml-6 list-disc space-y-2 [&>li]:mt-2", className)}
			{...restProps}
		>
			{children}
		</ul>
	);
}

export function OL({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLOListElement>) {
	return (
		<ol
			className={cn("my-4 ml-6 list-decimal space-y-2 [&>li]:mt-2", className)}
			{...restProps}
		>
			{children}
		</ol>
	);
}

export function Blockquote({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<blockquote
			className={cn(
				"text-muted-foreground mt-6 border-l-2 pl-4 italic",
				className,
			)}
			{...restProps}
		>
			{children}
		</blockquote>
	);
}

export function Table({
	className,
	children,
	...restProps
}: React.TableHTMLAttributes<HTMLTableElement>) {
	return (
		<table
			className={cn(
				"border-border my-6 w-full table-auto border-collapse border",
				className,
			)}
			{...restProps}
		>
			{children}
		</table>
	);
}

export function Thead({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLTableSectionElement>) {
	return (
		<thead
			className={cn("bg-accent text-accent-foreground", className)}
			{...restProps}
		>
			{children}
		</thead>
	);
}

export function Tbody({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tbody className={cn("", className)} {...restProps}>
			{children}
		</tbody>
	);
}

export function Tr({
	className,
	children,
	...restProps
}: React.HTMLAttributes<HTMLTableRowElement>) {
	return (
		<tr className={cn("even:bg-muted", className)} {...restProps}>
			{children}
		</tr>
	);
}

export function Th({
	className,
	children,
	...restProps
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th
			className={cn(
				"border-border border px-4 py-2 text-left font-medium",
				className,
			)}
			{...restProps}
		>
			{children}
		</th>
	);
}

export function Td({
	className,
	children,
	...restProps
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
	return (
		<td
			className={cn("border-border border px-4 py-2", className)}
			{...restProps}
		>
			{children}
		</td>
	);
}
