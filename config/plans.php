<?php

return [
    'starter' => [
        'name' => 'Starter',
        'prices' => [
            'monthly' => env('STRIPE_PRICE_STARTER_MONTHLY'),
            'yearly' => env('STRIPE_PRICE_STARTER_YEARLY'),
        ],
        'features' => ['Up to 5 seats', 'Basic support'],
    ],
    'pro' => [
        'name' => 'Pro',
        'prices' => [
            'monthly' => env('STRIPE_PRICE_PRO_MONTHLY'),
            'yearly' => env('STRIPE_PRICE_PRO_YEARLY'),
        ],
        'features' => ['Unlimited seats', 'Priority support'],
    ],
];
