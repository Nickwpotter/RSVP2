import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Existing tables
export const userTable = sqliteTable('user', {
    id: text('id').notNull().primaryKey(),
    email: text('email').notNull(),
    email_verified: integer('email_verified', { mode: 'boolean' })
});

export const sessionTable = sqliteTable('session', {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer('expires_at').notNull()
});

export const emailVerificationTokenTable = sqliteTable('email_verification_token', {
    id: text('id').notNull().primaryKey(),
    user_id: text('user_id').notNull(),
    email: text('email').notNull(),
    expires_at: integer('expires_at').notNull()
});

export const signinTable = sqliteTable('signin', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    logged_in_at: integer('logged_in_at').notNull(),
    ip_address: text('ip_address').notNull(),
    email: text('email').notNull()
});

// New tables
export const subscriptionTable = sqliteTable('subscription', {
    id: text('id').notNull().primaryKey(),
    user_id: text('user_id').notNull().references(() => userTable.id),
    plan_id: text('plan_id').notNull(),
    start_date: integer('start_date').notNull(), // Storing timestamps as integers
    end_date: integer('end_date'),
    status: text('status').notNull(),
    stripe_subscription_id: text('stripe_subscription_id').notNull(),
    created_at: integer('created_at').notNull(),
    updated_at: integer('updated_at').notNull(),
});

export const eventTable = sqliteTable('event', {
    id: text('id').notNull().primaryKey(),
    user_id: text('user_id').notNull().references(() => userTable.id),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'address_book' or 'rsvp'
    description: text('description'),
    registry_link: text('registry_link'),
    location: text('location'),
    image: blob('image'),
    qr_code: blob('qr_code'),
    created_at: integer('created_at').notNull(),
    updated_at: integer('updated_at').notNull(),
});

// New guests table
export const guestTable = sqliteTable('guest', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    event_id: text('event_id').notNull().references(() => eventTable.id),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    email: text('email').notNull(),
    phone_number: text('phone_number'),
    address: text('address'),
    quantity: integer('quantity').notNull()
});
