<?php

namespace App\Actions\Billing;

use App\Models\User;
use Stripe\StripeClient;

class CreateBillingPortalSession
{
    public function handle(User $user): string
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

        $user->createOrGetStripeCustomer();

        $session = $stripe->billingPortal->sessions->create([
            'customer' => $user->stripe_id,
            'return_url' => route('dashboard'),
        ]);

        return (string) $session->url;
    }
}
