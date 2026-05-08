<?php

namespace Tests\Feature\Team;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SingleTeamMembershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_create_a_second_team_when_already_in_one(): void
    {
        $user = User::factory()->create();
        $this->createTeamFor($user, 'Primary Team');

        $response = $this->actingAs($user)->post(route('team.create'), [
            'name' => 'Second Team',
        ]);

        $response
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('teams', 1);
        $this->assertDatabaseMissing('teams', ['name' => 'Second Team']);
    }

    public function test_owner_cannot_invite_user_who_already_belongs_to_another_team(): void
    {
        $owner = User::factory()->create();
        $ownerTeam = $this->createTeamFor($owner, 'Owner Team');

        $otherOwner = User::factory()->create();
        $otherTeam = $this->createTeamFor($otherOwner, 'Other Team');

        $member = User::factory()->create();
        $otherTeam->users()->attach($member->id, ['role' => 'member']);

        $response = $this->actingAs($owner)->post(route('team.members.add'), [
            'email' => $member->email,
        ]);

        $response->assertSessionHasErrors('email');

        $this->assertDatabaseMissing('team_user', [
            'team_id' => $ownerTeam->id,
            'user_id' => $member->id,
        ]);
    }

    private function createTeamFor(User $owner, string $name): Team
    {
        $team = Team::create([
            'owner_id' => $owner->id,
            'name' => $name,
        ]);

        $team->users()->attach($owner->id, ['role' => 'owner']);

        return $team;
    }
}
