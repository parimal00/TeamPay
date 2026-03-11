<?php

namespace App\Http\Controllers;

use App\Actions\Billing\CreateBillingPortalSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function store(Request $request, CreateBillingPortalSession $create): RedirectResponse
    {
        $url = $create->handle($request->user());

        return redirect()->away($url);
    }
}
