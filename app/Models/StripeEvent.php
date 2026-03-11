<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StripeEvent extends Model
{
    protected $fillable = [
        'stripe_event_id',
        'type',
        'payload',
        'status',
        'processed_at',
        'error_message',
    ];

    protected $casts = [
        'payload' => 'array',
        'processed_at' => 'datetime',
    ];
}
