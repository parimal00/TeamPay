<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InvoiceController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        $invoices = method_exists($user, 'invoices')
            ? collect($user->invoices())->map(fn ($invoice) => [
                'id' => $invoice->id,
                'date' => $invoice->date()->toDateString(),
                'total' => $invoice->total(),
                'status' => $invoice->status,
                'download_url' => route('billing.invoices') . '?download=' . $invoice->id,
            ])->values()
            : collect();

        return Inertia::render('billing/invoices', [
            'invoices' => $invoices,
            'billingEnabled' => method_exists($user, 'invoices'),
        ]);
    }
}
