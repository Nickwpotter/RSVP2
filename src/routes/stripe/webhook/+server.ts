import { json, type RequestEvent } from '@sveltejs/kit';
import { stripeClient } from '../stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { createNewSubscription, updateSubscription, deleteSubscription } from '$lib/subscription.model';
import { getUserByEmail } from '$lib/server/database/user.model';

function toBuffer(ab: ArrayBuffer): Buffer {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; i++) {
        buf[i] = view[i];
    }
    return buf;
}

export async function POST(event: RequestEvent) {
    const req = event.request;
    let eventType: string;
    let stripeEvent;

    if (STRIPE_WEBHOOK_SECRET) {
        const _rawBody = await req.arrayBuffer();
        const payload = toBuffer(_rawBody);
        const signature = req.headers.get('stripe-signature') as string;

        try {
            stripeEvent = stripeClient.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
            eventType = stripeEvent.type;
        } catch (err) {
            console.error('Webhook signature verification failed.', err.message);
            return json({ error: 'Webhook Error: Invalid signature' }, { status: 400 });
        }
    } else {
        const body = await req.json();
        eventType = body.type;
        stripeEvent = body; // Directly use the body as the event if no secret is provided
    }

    switch (eventType) {
        case 'checkout.session.completed':
            const session = stripeEvent.data.object;
            const userEmail = session.customer_email;
            const user = await getUserByEmail(userEmail);
            
            if (user) {
                const newSubscription = {
                    id: session.subscription,
                    user_id: user.id,
                    plan_id: session.display_items[0].price.id,
                    start_date: Math.floor(Date.now() / 1000),
                    status: 'active',
                    stripe_subscription_id: session.subscription
                };
                await createNewSubscription(newSubscription);
            }
            console.log('Event: checkout.session.completed');
            break;

        case 'invoice.paid':
            const invoice = stripeEvent.data.object;
            const paidSubscription = {
                status: 'active'
            };
            await updateSubscription(invoice.subscription, paidSubscription);
            console.log('Event: invoice.paid');
            break;

        case 'invoice.payment_failed':
            const failedInvoice = stripeEvent.data.object;
            const failedSubscription = {
                status: 'past_due'
            };
            await updateSubscription(failedInvoice.subscription, failedSubscription);
            console.log('Event: invoice.payment_failed');
            break;

        case 'customer.subscription.updated':
            const updatedSubscriptionData = stripeEvent.data.object;
            const updatedSubscription = {
                plan_id: updatedSubscriptionData.items.data[0].price.id,
                status: updatedSubscriptionData.status
            };
            await updateSubscription(updatedSubscriptionData.id, updatedSubscription);
            console.log('Event: customer.subscription.updated');
            break;

        case 'customer.subscription.deleted':
            const deletedSubscriptionId = stripeEvent.data.object.id;
            await deleteSubscription(deletedSubscriptionId);
            console.log('Event: customer.subscription.deleted');
            break;

        default:
            console.log(`Unhandled event type ${eventType}`);
    }

    return json({ received: true });
}
