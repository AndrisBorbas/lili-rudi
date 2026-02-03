import type { MDXComponents } from "mdx/types";

import {
	A,
	Blockquote,
	H1,
	H2,
	H3,
	H4,
	OL,
	P,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	UL,
} from "@/components/mdx/mdx";

const components: MDXComponents = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	a: A,
	p: P,
	ul: UL,
	ol: OL,
	blockquote: Blockquote,
	table: Table,
	thead: Thead,
	tbody: Tbody,
	tr: Tr,
	th: Th,
	td: Td,
};

export function useMDXComponents(): MDXComponents {
	return components;
}
