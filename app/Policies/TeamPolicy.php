<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public const VIEW = 'view';
    public const MANAGE_MEMBERS = 'manageMembers';
    public const MANAGE_BILLING = 'manageBilling';

    public function view(User $user, Team $team): bool
    {
        return $user->isTeamMember($team);
    }

    public function manageMembers(User $user, Team $team): bool
    {
        return $user->canManageTeamMembers($team);
    }

    public function manageBilling(User $user, Team $team): bool
    {
        return $user->canManageBilling($team);
    }
}
