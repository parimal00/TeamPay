<?php

namespace App\Actions\Billing;

use App\Models\Team;
use App\Models\User;
use App\Support\BillingSubscriptions;

class SyncSubscriptionQuantity
{
    public function handle(User $owner, Team $team): void
    {
        if (! method_exists($owner, 'subscription')) {
            return;
        }

        // Cashier subscription used for team seats.
        $subscription = $owner->subscription(BillingSubscriptions::TEAM);

        if (!$subscription || !$subscription->valid()) {
            return;
        }

        $quantity = max(1, $team->seatCount());

        // Updates the subscription item quantity in Stripe
        $subscription->updateQuantity($quantity);
    }
}
