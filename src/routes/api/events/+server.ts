import { db } from '$lib/server/database/db';
import { eventTable } from '$lib/server/database/schema';
import { json, error } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// Helper function to fetch events for a user and sort by type
async function getEventsByUserIdSortedByType(userId: string) {
    return await db
        .select()
        .from(eventTable)
        .where(eq(eventTable.user_id, userId))
        .orderBy(eventTable.type);
}

// POST /api/events - Create Event
export const POST = async ({ request, locals }: RequestEvent) => {
    const user = locals.user;
    if (!user) throw error(401, 'Unauthorized');

    const {
        name,
        type,
        description,
        registry_link,
        location,
        image,
        qr_code
    } = await request.json();

    const newEvent = {
        id: uuidv4(),
        user_id: user.id,
        name,
        type,
        description,
        registry_link,
        location,
        image,
        qr_code,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000)
    };

    await db.insert(eventTable).values(newEvent);

    return json({ success: true, event: newEvent });
};

// PUT /api/events/:id - Update Event
export const PUT = async ({ request, params, locals }: RequestEvent) => {
    const user = locals.user;
    if (!user) throw error(401, 'Unauthorized');

    const { id } = params;
    const {
        name,
        type,
        description,
        registry_link,
        location,
        image,
        qr_code
    } = await request.json();

    const updatedEvent = {
        name,
        type,
        description,
        registry_link,
        location,
        image,
        qr_code,
        updated_at: Math.floor(Date.now() / 1000)
    };

    await db.update(eventTable).set(updatedEvent).where(eq(eventTable.id, id)).where(eq(eventTable.user_id, user.id));

    const event = await db.select().from(eventTable).where(eq(eventTable.id, id)).where(eq(eventTable.user_id, user.id)).get();

    return json({ success: true, event });
};

// DELETE /api/events/:id - Delete Event
export const DELETE = async ({ params, locals }: RequestEvent) => {
    const user = locals.user;
    if (!user) throw error(401, 'Unauthorized');

    const { id } = params;
    await db.delete(eventTable).where(eq(eventTable.id, id)).where(eq(eventTable.user_id, user.id));

    return json({ success: true, message: 'Event deleted successfully' });
};

// GET /api/events - Fetch All Events and sort by type
export const GET = async ({ locals }: RequestEvent) => {
    const user = locals.user;
    if (!user) throw error(401, 'Unauthorized');

    const events = await getEventsByUserIdSortedByType(user.id);
    return json({ success: true, events });
};
