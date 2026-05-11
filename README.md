# TeamPay

TeamPay is a Laravel + Inertia (React) SaaS billing demo focused on team-based seat billing with Stripe.

## What this project demonstrates
- Team workspace with owner-managed member roster
- Stripe Checkout subscription flow from selected plan + billing interval
- Cashier-managed subscription lifecycle (`trialing`, `active`, `past_due`, `canceled`)
- Invoice archive with PDF download
- Seat quantity sync to Stripe when team members are added or removed

## Stack
- Backend: Laravel 12, PHP 8.2, Laravel Cashier (Stripe), Fortify
- Frontend: Inertia.js + React + TypeScript + Tailwind CSS
- Database: SQLite (default), compatible with MySQL/PostgreSQL
- Queue: database queue driver (`jobs` table)

## Architecture at a glance
- Web routes: `routes/web.php`
- Billing controllers:
  - `app/Http/Controllers/CheckoutController.php`
  - `app/Http/Controllers/SubscriptionController.php`
  - `app/Http/Controllers/InvoiceController.php`
  - `app/Http/Controllers/PortalController.php`
- Team and authorization:
  - `app/Http/Controllers/TeamController.php`
  - `app/Policies/TeamPolicy.php`
  - `app/Models/User.php`
- Seat sync action:
  - `app/Actions/Billing/SyncSubscriptionQuantity.php`
- Plans config:
  - `config/plans.php`
- Webhook strategy:
  - Single webhook source of truth via Laravel Cashier route `POST /stripe/webhook`

## Local setup
1. Install dependencies:
```bash
composer install
npm install
```

2. Prepare env + app key:
```bash
cp .env.example .env
php artisan key:generate
```

3. Configure Stripe and billing env values in `.env`:
```dotenv
APP_URL=http://127.0.0.1:8000

STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_STARTER_YEARLY=price_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
```

4. Migrate + seed:
```bash
php artisan migrate
php artisan db:seed
```

5. Run app (server, queue worker, logs, Vite) in one command:
```bash
composer run dev
```

## Stripe local webhook testing
1. Install and login to Stripe CLI.
2. Forward Stripe events to TeamPay:
```bash
stripe listen --forward-to http://127.0.0.1:8000/stripe/webhook
```
3. Copy the printed signing secret (`whsec_...`) into `.env` as `STRIPE_WEBHOOK_SECRET`.
4. Trigger test events if needed:
```bash
stripe trigger checkout.session.completed
stripe trigger invoice.paid
```

## Demo seed notes
- `php artisan db:seed` creates `test@example.com` with password `password`.
- Create extra demo users (for invite/seat demo):
```bash
php artisan tinker
```
```php
\App\Models\User::factory()->create([
    'name' => 'Demo Member',
    'email' => 'member@example.com',
]);
\App\Models\User::factory()->create([
    'name' => 'Demo Viewer',
    'email' => 'viewer@example.com',
]);
```
- Both users above also use password `password` (factory default).

## Demo flow (quick)
1. Login as team owner (`test@example.com`).
2. Create team on `/team`.
3. Invite `member@example.com` from Team page.
4. Go to `/pricing`, pick plan + interval, start checkout with Stripe test card `4242 4242 4242 4242`.
5. Open `/billing/invoices` and download the generated invoice PDF.
6. Return to `/team`, add/remove members and verify seat count updates in dashboard subscription card.

For a full narrated runbook, use `docs/PORTFOLIO_DEMO_SCRIPT.md`.
