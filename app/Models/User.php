<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class)->withPivot(['role'])->withTimestamps();
    }

    public function ownedTeams()
    {
        return $this->hasMany(Team::class, 'owner_id');
    }

    public function currentTeam(): ?Team
    {
        // simplest: first owned team, else first joined team
        return $this->ownedTeams()->first() ?? $this->teams()->first();
    }

    public function teamRole(?Team $team): ?string
    {
        if (! $team) {
            return null;
        }

        if ($this->isTeamOwner($team)) {
            return 'owner';
        }

        return $this->teams()
            ->where('teams.id', $team->id)
            ->first()?->pivot?->role;
    }

    public function isTeamOwner(?Team $team): bool
    {
        return $team && $team->owner_id === $this->id;
    }

    public function isTeamAdmin(?Team $team): bool
    {
        return $this->teamRole($team) === 'admin';
    }

    public function isTeamMember(?Team $team): bool
    {
        return in_array($this->teamRole($team), ['owner', 'admin', 'member'], true);
    }

    public function canManageTeamMembers(?Team $team): bool
    {
        return $this->isTeamOwner($team);
    }

    public function canManageBilling(?Team $team): bool
    {
        return $this->isTeamOwner($team);
    }
}
