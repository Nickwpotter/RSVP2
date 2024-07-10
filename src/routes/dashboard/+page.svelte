<script context="module" lang="ts">
    import { redirect } from '@sveltejs/kit';
    import { getSubscriptionsByUserId } from '$lib/server/database/subscriptions.model';
    import type { PageLoad } from '$lib/types';
  
    export const load: PageLoad = async ({ locals }) => {
      const user = locals.user;
      if (!user) {
        throw redirect(302, '/login');
      }
  
      const subscriptions = await getSubscriptionsByUserId(user.id);
      return { props: { user, subscriptions } };
    };
  </script>
  
  <script lang="ts">
    export let data: { user: { id: string; email: string }; subscriptions: any[] };
  </script>
  
  <main class="container mx-auto mt-8">
    <h1 class="text-2xl font-bold">Welcome, {data.user.email}</h1>
  
    <section class="mt-4">
      <h2 class="text-xl font-semibold">Your Subscriptions</h2>
  
      {#if data.subscriptions.length > 0}
        <ul class="mt-2">
          {#each data.subscriptions as subscription}
            <li class="p-4 border rounded-lg mt-2">
              <p><strong>Plan ID:</strong> {subscription.plan_id}</p>
              <p><strong>Status:</strong> {subscription.status}</p>
              <p><strong>Start Date:</strong> {new Date(subscription.start_date * 1000).toLocaleDateString()}</p>
              {#if subscription.end_date}
                <p><strong>End Date:</strong> {new Date(subscription.end_date * 1000).toLocaleDateString()}</p>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="mt-2">You have no subscriptions yet.</p>
      {/if}
    </section>
  </main>
  
  <style>
    .container {
      max-width: 800px;
      padding: 0 20px;
    }
  </style>
  