<?php

namespace App\Jobs;

use App\Models\StripeEvent;
use App\Services\Stripe\WebhookRouter;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessStripeEvent implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $stripeEventId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(WebhookRouter $router): void
    {
        $event = StripeEvent::findOrFail($this->stripeEventId);

        if ($event->status === 'processed') {
            return;
        }

        try {
            $router->route($event->type, $event->payload);

            $event->update([
                'status' => 'processed',
                'processed_at' => now(),
                'error_message' => null,
            ]);
        } catch (\Throwable $e) {
            $event->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            // Re-throw to allow retries if you want:
            throw $e;
        }
    }
}
