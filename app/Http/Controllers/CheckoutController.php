<?php

namespace App\Http\Controllers;

use App\Policies\TeamPolicy;
use App\Support\BillingSubscriptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $actor = $request->user();
        $team = $actor->currentTeam();

        abort_unless($team, 403);
        $this->authorize(TeamPolicy::MANAGE_BILLING, $team);

        $planKeys = array_keys(config('plans', []));

        $data = $request->validate([
            'plan_key' => ['required', 'string', Rule::in($planKeys)],
            'interval' => ['required', 'in:monthly,yearly'],
        ]);

        $stripePriceId = config("plans.{$data['plan_key']}.prices.{$data['interval']}");

        if (! is_string($stripePriceId) || $stripePriceId === '') {
            throw ValidationException::withMessages([
                'interval' => 'Selected billing interval is not configured for this plan.',
            ]);
        }

        $checkout =  $actor
            ->newSubscription(BillingSubscriptions::TEAM, $stripePriceId)
            ->checkout([
                'success_url' => route('billing.success'),
                'cancel_url' => route('billing.cancel'),
            ]);

        return Inertia::location($checkout->url);
    }
}
