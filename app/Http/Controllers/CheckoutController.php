<?php

namespace App\Http\Controllers;

use App\Actions\Billing\CreateCheckoutSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function store(Request $request, CreateCheckoutSession $create)
    {
        $data = $request->validate([
            'plan_key' => ['required', 'string'],
            'interval' => ['required', 'in:monthly,yearly'],
        ]);

        $stripePriceId = 'price_1T6qyRSI4HFHecW6C96GdEU3';

        $quantity = 1;

        $checkout =  $request->user()
            ->newSubscription('default', 'price_1T6qyRSI4HFHecW6C96GdEU3')
            ->checkout([
                'success_url' => route('checkout-success'),
                'cancel_url' => route('checkout-cancel'),
            ]);

        return Inertia::location($checkout->url);
    }

    public function success(): RedirectResponse
    {
        return redirect()->route('dashboard')->with('success', 'Subscription started.');
    }

    public function cancel(): RedirectResponse
    {
        return redirect()->route('pricing')->with('error', 'Checkout cancelled.');
    }
}
