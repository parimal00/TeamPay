<?php

namespace App\Actions\Billing;

use App\Models\User;
use Illuminate\Support\Arr;
use Stripe\StripeClient;

class CreateCheckoutSession
{
    public function handle(User $user, string $planKey, string $interval): string
    {
        if (! class_exists(StripeClient::class)) {
            abort(500, 'Stripe SDK is not installed.');
        }

        if (! method_exists($user, 'createOrGetStripeCustomer')) {
            abort(500, 'Billing is not configured for the user model.');
        }

        $secret = config('services.stripe.secret');

        if (! $secret) {
            abort(500, 'Stripe secret is not configured.');
        }

        $stripe = new StripeClient($secret);
        $plans = config('plans');
        $plan = Arr::get($plans, $planKey);

        if (!$plan) {
            abort(422, 'Invalid plan.');
        }

        $priceId = Arr::get($plan, "prices.$interval");
        if (!$priceId) {
            abort(422, 'Plan price not configured.');
        }

        // Ensure Stripe customer exists
        $user->createOrGetStripeCustomer();

        $team = $user->currentTeam();
        $quantity = $team ? $team->seatCount() : 1;

        $session = $stripe->checkout->sessions->create([
            'mode' => 'subscription',
            'customer' => $user->stripe_id,
            'line_items' => [[
                'price' => $priceId,
                'quantity' => $quantity,
            ]],
            'success_url' => route('billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('billing.cancel'),
            'subscription_data' => [
                'metadata' => [
                    'user_id' => (string) $user->id,
                    'team_id' => (string) ($team?->id ?? ''),
                    'plan_key' => $planKey,
                    'interval' => $interval,
                ],
                // Optional: trial in days
                'trial_period_days' => 7,
            ],
            'metadata' => [
                'user_id' => (string) $user->id,
                'team_id' => (string) ($team?->id ?? ''),
                'plan_key' => $planKey,
                'interval' => $interval,
            ],
        ]);

        return (string) $session->url;
    }
}
