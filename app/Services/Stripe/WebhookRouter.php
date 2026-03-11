<?php

namespace App\Services\Stripe;

use App\Services\Stripe\Handlers\CheckoutSessionCompleted;
use App\Services\Stripe\Handlers\InvoicePaid;
use App\Services\Stripe\Handlers\InvoicePaymentFailed;
use App\Services\Stripe\Handlers\SubscriptionUpdated;

class WebhookRouter
{
    public function __construct(
        private CheckoutSessionCompleted $checkoutCompleted,
        private SubscriptionUpdated $subscriptionUpdated,
        private InvoicePaid $invoicePaid,
        private InvoicePaymentFailed $invoicePaymentFailed,
    ) {}

    public function route(string $type, array $payload): void
    {
        match ($type) {
            'checkout.session.completed' => $this->checkoutCompleted->handle($payload),
            'customer.subscription.updated',
            'customer.subscription.deleted',
            'customer.subscription.created' => $this->subscriptionUpdated->handle($payload),
            'invoice.paid' => $this->invoicePaid->handle($payload),
            'invoice.payment_failed' => $this->invoicePaymentFailed->handle($payload),
            default => null, // store event anyway; ignore unknowns
        };
    }
}