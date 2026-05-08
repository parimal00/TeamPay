<?php

namespace App\Http\Controllers;

use App\Policies\TeamPolicy;
use App\Support\BillingSubscriptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Cashier\Subscription;

class SubscriptionController extends Controller
{
    public function cancel(Request $request): RedirectResponse
    {
        $subscription = $this->authorizedSubscription($request);

        if (! $subscription) {
            return back()->with('error', 'No subscription found for this team.');
        }

        if ($subscription->ended()) {
            return back()->with('error', 'Subscription already ended.');
        }

        if ($subscription->onGracePeriod()) {
            return back()->with('success', 'Subscription is already scheduled to cancel.');
        }

        try {
            $subscription->cancel();
        } catch (\Throwable) {
            return back()->with('error', 'Unable to cancel subscription right now. Try again.');
        }

        return back()->with('success', 'Subscription will cancel at period end.');
    }

    public function resume(Request $request): RedirectResponse
    {
        $subscription = $this->authorizedSubscription($request);

        if (! $subscription) {
            return back()->with('error', 'No subscription found for this team.');
        }

        if (! $subscription->onGracePeriod()) {
            return back()->with('error', 'Only on-grace subscriptions can be resumed.');
        }

        try {
            $subscription->resume();
        } catch (\Throwable) {
            return back()->with('error', 'Unable to resume subscription right now. Try again.');
        }

        return back()->with('success', 'Subscription resumed.');
    }

    private function authorizedSubscription(Request $request): ?Subscription
    {
        $actor = $request->user();
        $team = $actor->currentTeam();

        abort_unless($team, 403);
        $this->authorize(TeamPolicy::MANAGE_BILLING, $team);

        return $team->owner?->subscription(BillingSubscriptions::TEAM);
    }
}
