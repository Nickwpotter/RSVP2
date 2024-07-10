import { db } from './db';
import { eventTable } from './schema';
import { eq } from 'drizzle-orm';

export const getEventsByUserId = async (userId: string) => {
    return await db.select().from(eventTable).where(eq(eventTable.user_id, userId));
};

export const getEventById = async (eventId: string) => {
    const event = await db.select().from(eventTable).where(eq(eventTable.id, eventId));
    if (event.length === 0) {
        return null;
    } else {
        return event[0];
    }
};

type NewEvent = {
    id: string;
    user_id: string;
    name: string;
    type: string;
    description?: string;
    registry_link?: string;
    location?: string;
    image?: Blob;
    qr_code?: Blob;
};

export const createNewEvent = async (event: NewEvent) => {
    const result = await db.insert(eventTable).values(event).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

type UpdateEvent = Partial<typeof eventTable.$inferInsert>;
export const updateEvent = async (id: string, event: UpdateEvent) => {
    const result = await db.update(eventTable).set(event).where(eq(eventTable.id, id)).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

export const deleteEvent = async (id: string) => {
    await db.delete(eventTable).where(eq(eventTable.id, id));
};
