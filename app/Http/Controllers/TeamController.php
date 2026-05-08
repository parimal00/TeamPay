<?php

namespace App\Http\Controllers;

use App\Actions\Billing\SyncSubscriptionQuantity;
use App\Models\Team;
use App\Models\User;
use App\Policies\TeamPolicy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class TeamController extends Controller
{
    public function show(Request $request): InertiaResponse
    {
        $user = $request->user();
        $team = $user->currentTeam();

        return Inertia::render('team/show', [
            'team' => $team ? [
                'id' => $team->id,
                'name' => $team->name,
                'owner_id' => $team->owner_id,
                'seat_count' => $team->seatCount(),
                'members' => $team->users()
                    ->select('users.id', 'users.name', 'users.email')
                    ->get()
                    ->map(fn(User $member) => [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'role' => $member->pivot?->role,
                    ])
                    ->values(),
            ] : null,
        ]);
    }

    public function create(Request $request): RedirectResponse
    {
        if ($request->user()->currentTeam()) {
            throw ValidationException::withMessages([
                'name' => 'You can only belong to one team.',
            ]);
        }

        $data = $request->validate(['name' => ['required', 'string', 'max:100']]);

        $team = Team::create([
            'owner_id' => $request->user()->id,
            'name' => $data['name'],
        ]);

        $team->users()->attach($request->user()->id, ['role' => 'owner']);

        return redirect()->route('team.show');
    }

    public function addMember(Request $request, SyncSubscriptionQuantity $syncSeats): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $owner = $request->user();
        $team = $owner->currentTeam();

        abort_unless($team, 403);
        $this->authorize(TeamPolicy::MANAGE_MEMBERS, $team);

        $member = User::where('email', $data['email'])->first();

        if (! $member) {
            throw ValidationException::withMessages([
                'email' => 'No user exists with that email address.',
            ]);
        }

        $memberCurrentTeam = $member->currentTeam();

        if ($memberCurrentTeam && $memberCurrentTeam->id !== $team->id) {
            throw ValidationException::withMessages([
                'email' => 'This user already belongs to another team.',
            ]);
        }

        $team->users()->syncWithoutDetaching([$member->id => ['role' => 'member']]);

        // seat billing sync (safe even if no subscription)
        $syncSeats->handle($owner, $team);

        return back();
    }

    public function removeMember(Request $request, User $user, SyncSubscriptionQuantity $syncSeats): RedirectResponse
    {
        $owner = $request->user();
        $team = $owner->currentTeam();

        abort_unless($team, 403);
        $this->authorize(TeamPolicy::MANAGE_MEMBERS, $team);
        abort_if($user->id === $team->owner_id, 422, 'Cannot remove owner.');
        abort_unless($team->users()->where('users.id', $user->id)->exists(), 404);

        $team->users()->detach($user->id);

        $syncSeats->handle($owner, $team);

        return back();
    }
}
