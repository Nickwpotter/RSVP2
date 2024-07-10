import { db } from './db';
import { subscriptionTable } from './schema';
import { eq } from 'drizzle-orm';

export const getSubscriptionsByUserId = async (userId: string) => {
    return await db.select().from(subscriptionTable).where(eq(subscriptionTable.user_id, userId));
};

export const getSubscriptionById = async (subscriptionId: string) => {
    const subscription = await db.select().from(subscriptionTable).where(eq(subscriptionTable.id, subscriptionId));
    if (subscription.length === 0) {
        return null;
    } else {
        return subscription[0];
    }
};

type NewSubscription = {
    id: string;
    user_id: string;
    plan_id: string;
    start_date: number; // Use Unix epoch time
    end_date?: number; // Use Unix epoch time
    status: string;
    stripe_subscription_id: string;
};

export const createNewSubscription = async (subscription: NewSubscription) => {
    const result = await db.insert(subscriptionTable).values(subscription).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

type UpdateSubscription = Partial<typeof subscriptionTable.$inferInsert>;
export const updateSubscription = async (id: string, subscription: UpdateSubscription) => {
    const result = await db.update(subscriptionTable).set(subscription).where(eq(subscriptionTable.id, id)).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

export const deleteSubscription = async (id: string) => {
    await db.delete(subscriptionTable).where(eq(subscriptionTable.id, id));
};
