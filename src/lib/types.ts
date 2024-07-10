import type { signinTable } from './server/database/schema';

export type Link = {
	name: string;
	href: string;
};

export type Faq = {
	question: string;
	answer: string; // HTML
};

export type DefaultSeo = {
	pageTitle: string;
	pageDescription: string;
	twitterCard: string;
	twitterSite: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage: string;
	ogType: string;
	ogTitle?: string;
	ogDescription?: string;
	ogUrl: string;
	ogImage: string;
};

export type Signin = typeof signinTable.$inferInsert;

export type Seo = Partial<DefaultSeo>;

// Custom PageLoad type for SvelteKit
import type { LoadEvent } from '@sveltejs/kit';

export type PageLoad = (event: LoadEvent) => Promise<{ props: Record<string, unknown> }>;
