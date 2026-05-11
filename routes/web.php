<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TeamController;
use App\Support\BillingSubscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Cashier\Http\Controllers\WebhookController;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/pricing', fn() => Inertia::render('pricing', [
    'plans' => config('plans'),
]))->name('pricing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $actor = $request->user();
        $team = $actor->currentTeam();
        $owner = $team?->owner;
        $subscription = $owner?->subscription(BillingSubscriptions::TEAM);
        $actorRole = $team
            ? $team->users()->where('users.id', $actor->id)->first()?->pivot?->role
            : null;
        $canManageBilling = $team && ($team->owner_id === $actor->id || $actorRole === 'admin');

        $plans = config('plans', []);
        $matchedPlanKey = null;
        $matchedInterval = null;

        foreach ($plans as $planKey => $plan) {
            foreach ($plan['prices'] as $price) {
                if ($subscription && $subscription->stripe_price === $price) {
                    $matchedPlanKey = $planKey;
                    $matchedInterval = array_search($price, $plan['prices'], true) ?: null;
                    break 2;
                }
            }
        }

        $lifecycleStatus = null;
        $renewalDate = null;

        if ($subscription) {
            if ($subscription->onTrial()) {
                $lifecycleStatus = 'trialing';
                $renewalDate = $subscription->trial_ends_at;
            } elseif ($subscription->canceled()) {
                $lifecycleStatus = 'canceled';
                $renewalDate = $subscription->ends_at;
            } elseif ($subscription->pastDue()) {
                $lifecycleStatus = 'past_due';
            } elseif ($subscription->active()) {
                $lifecycleStatus = 'active';
            } else {
                $lifecycleStatus = $subscription->stripe_status;
            }

            if (! $renewalDate && in_array($lifecycleStatus, ['active', 'past_due'], true)) {
                try {
                    $renewalDate = $subscription->currentPeriodEnd();
                } catch (\Throwable) {
                    $renewalDate = null;
                }
            }
        }

        $subscriptionSnapshot = $subscription ? [
            'status' => $lifecycleStatus,
            'plan_key' => $matchedPlanKey,
            'plan_name' => $matchedPlanKey ? ($plans[$matchedPlanKey]['name'] ?? null) : null,
            'interval' => $matchedInterval,
            'renewal_date' => $renewalDate?->toDateString(),
            'seat_quantity' => $team ? $team->seatCount() : 0,
            'can_manage_billing' => $canManageBilling,
            'can_cancel' => $canManageBilling && ! $subscription->ended() && ! $subscription->onGracePeriod(),
            'can_resume' => $canManageBilling && $subscription->onGracePeriod(),
        ] : null;

        return Inertia::render('dashboard', [
            'plans' => $plans,
            'team' => $team ? [
                'id' => $team->id,
                'name' => $team->name,
                'owner_id' => $team->owner_id,
                'seat_count' => $team->seatCount(),
            ] : null,
            'subscription' => $subscriptionSnapshot,
        ]);
    })->name('dashboard');

    // Team
    Route::get('/team', [TeamController::class, 'show'])->name('team.show');
    Route::post('/team', [TeamController::class, 'create'])->name('team.create');
    Route::post('/team/members', [TeamController::class, 'addMember'])->name('team.members.add');
    Route::delete('/team/members/{user}', [TeamController::class, 'removeMember'])->name('team.members.remove');

    // Billing
    Route::post('/billing/checkout', [CheckoutController::class, 'store'])->name('billing.checkout');
    Route::get('/billing/success', [CheckoutController::class, 'success'])->name('billing.success');
    Route::get('/billing/cancel', [CheckoutController::class, 'cancel'])->name('billing.cancel');

    Route::post('/billing/portal', [PortalController::class, 'store'])->name('billing.portal');
    Route::post('/billing/subscription/cancel', [SubscriptionController::class, 'cancel'])->name('billing.subscription.cancel');
    Route::post('/billing/subscription/resume', [SubscriptionController::class, 'resume'])->name('billing.subscription.resume');
    Route::get('/billing/invoices', [InvoiceController::class, 'index'])->name('billing.invoices');
    Route::get('/billing/invoices/download', [InvoiceController::class, 'download'])->name('billing.invoices.download');
});

// Single source of truth: Stripe webhooks are handled by Laravel Cashier.
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])->name('cashier.webhook');

require __DIR__ . '/settings.php';
