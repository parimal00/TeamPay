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
                'download_url' => route('billing.invoices.download') . '?download=' . $invoice->id,
            ])->values()
            : collect();

        return Inertia::render('billing/invoices', [
            'invoices' => $invoices,
            'billingEnabled' => method_exists($user, 'invoices'),
        ]);
    }

    public function download(Request $request){
        $user = $request->user();

        if (!method_exists($user, 'downloadInvoice')) {
            abort(404);
        }

        $invoiceId = $request->query('download');

        return $user->downloadInvoice($invoiceId, [
            'vendor' => config('app.name'),
            'product' => 'Subscription',
        ]);
    }
}
