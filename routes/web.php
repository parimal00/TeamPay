<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\TeamController;
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
        $team = $request->user()->currentTeam();

        return Inertia::render('dashboard', [
            'plans' => config('plans'),
            'team' => $team ? [
                'id' => $team->id,
                'name' => $team->name,
                'owner_id' => $team->owner_id,
                'seat_count' => $team->seatCount(),
            ] : null,
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
    Route::get('/billing/invoices', [InvoiceController::class, 'index'])->name('billing.invoices');
    Route::get('/billing/invoices/download', [InvoiceController::class, 'download'])->name('billing.invoices.download');    
});

// Stripe webhook (NO auth middleware)
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])->name('cashier.webhook');

Route::get('/checkout/success', function () {
    return redirect()->route('dashboard')->with('success', 'Subscription started.');
})->name('checkout-success');


Route::get('/checkout/failure', function () {
    return redirect()->route('pricing')->with('error', 'Checkout cancelled.');
})->name('checkout-cancel');
Route::get('/test', function () {
    return view('app');
});
require __DIR__ . '/settings.php';
