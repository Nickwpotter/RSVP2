import type { Config } from 'drizzle-kit';
export default {
	schema: './src/lib/server/database/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DB_URL!,
		authToken: process.env.TURSO_DB_AUTH_TOKEN!,	}
} satisfies Config;
