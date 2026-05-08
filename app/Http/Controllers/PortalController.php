<?php

namespace App\Http\Controllers;

use App\Actions\Billing\CreateBillingPortalSession;
use App\Policies\TeamPolicy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function store(Request $request, CreateBillingPortalSession $create): RedirectResponse
    {
        $actor = $request->user();
        $team = $actor->currentTeam();

        abort_unless($team, 403);
        $this->authorize(TeamPolicy::MANAGE_BILLING, $team);

        $url = $create->handle($actor);

        return redirect()->away($url);
    }
}
