<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessStripeEvent;
use App\Models\StripeEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (! class_exists(Webhook::class)) {
            return response('Stripe SDK not installed', 500);
        }

        $secret = config('services.stripe.webhook_secret');
        if (!$secret) {
            return response('Webhook secret not configured', 500);
        }

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Throwable $e) {
            return response('Invalid signature', 400);
        }

        // Idempotency: store once
        $stripeEvent = StripeEvent::firstOrCreate(
            ['stripe_event_id' => $event->id],
            [
                'type' => $event->type,
                'payload' => json_decode($payload, true) ?: [],
                'status' => 'pending',
            ],
        );

        // If already processed, return 200 quickly
        if ($stripeEvent->status === 'processed') {
            return response('Already processed', 200);
        }

        ProcessStripeEvent::dispatch($stripeEvent->id);

        return response('OK', 200);
    }
}
