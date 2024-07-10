import { db } from './db';
import { guestTable } from './schema';
import { eq } from 'drizzle-orm';

export const getGuestsByEventId = async (eventId: string) => {
    return await db.select().from(guestTable).where(eq(guestTable.event_id, eventId));
};

export const getGuestById = async (guestId: number) => {
    const guest = await db.select().from(guestTable).where(eq(guestTable.id, guestId));
    if (guest.length === 0) {
        return null;
    } else {
        return guest[0];
    }
};

type NewGuest = {
    event_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    address?: string;
    quantity: number;
};

export const createNewGuest = async (guest: NewGuest) => {
    const result = await db.insert(guestTable).values(guest).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

type UpdateGuest = Partial<typeof guestTable.$inferInsert>;
export const updateGuest = async (id: number, guest: UpdateGuest) => {
    const result = await db.update(guestTable).set(guest).where(eq(guestTable.id, id)).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

export const deleteGuest = async (id: number) => {
    await db.delete(guestTable).where(eq(guestTable.id, id));
};
