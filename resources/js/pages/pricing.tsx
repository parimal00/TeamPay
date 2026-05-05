import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type BillingInterval = 'monthly' | 'yearly';

type PlanConfig = {
    name: string;
    prices: {
        monthly?: string | null;
        yearly?: string | null;
    };
    features: string[];
};

const pricePreview: Record<string, { monthly: string; yearly: string }> = {
    starter: { monthly: '$19', yearly: '$190' },
    pro: { monthly: '$59', yearly: '$590' },
};

export default function Pricing({
    plans,
}: {
    plans: Record<string, PlanConfig>;
}) {
    const { auth, flash } = usePage().props as {
        auth: {
            user: { id: number; name: string } | null;
        };
        flash?: { success?: string; error?: string };
    };
    const checkout = useForm<{
        plan_key: string;
        interval: BillingInterval;
    }>({
        plan_key: 'starter',
        interval: 'monthly',
    });

    const submitCheckout = (planKey: string) => {
        checkout.transform((data) => ({
            ...data,
            plan_key: planKey,
        }));

        checkout.post('/billing/checkout');
    };

    return (
        <>
            <Head title="Pricing" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_20%)]">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
                    <Link href="/" className="text-lg font-semibold">
                        TeamPay
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild>
                            <Link href={auth.user ? '/dashboard' : '/login'}>
                                {auth.user ? 'Dashboard' : 'Sign in'}
                            </Link>
                        </Button>
                        {!auth.user ? (
                            <Button asChild>
                                <Link href="/register">Create account</Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pt-6 pb-16 lg:px-8">
                    <section className="flex flex-col gap-6 rounded-[2rem] border border-border/70 bg-card/90 px-6 py-8 shadow-sm md:px-8">
                        <Badge className="w-fit bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                            <Sparkles className="size-3.5" />
                            Transparent team billing
                        </Badge>
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl space-y-3">
                                <Heading
                                    title="Pricing built for seat-based teams"
                                    description="Choose a plan, switch billing cadence, and send your workspace to checkout when you are ready."
                                />
                            </div>
                            <div className="inline-flex rounded-full border border-border bg-muted/60 p-1">
                                {(
                                    ['monthly', 'yearly'] as BillingInterval[]
                                ).map((interval) => (
                                    <button
                                        key={interval}
                                        type="button"
                                        onClick={() =>
                                            checkout.setData(
                                                'interval',
                                                interval,
                                            )
                                        }
                                        className={cn(
                                            'rounded-full px-4 py-2 text-sm font-medium transition',
                                            checkout.data.interval === interval
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {interval === 'monthly'
                                            ? 'Monthly'
                                            : 'Yearly'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {flash?.error ? (
                            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                                {flash.error}
                            </div>
                        ) : null}
                        {flash?.success ? (
                            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                                {flash.success}
                            </div>
                        ) : null}
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        {Object.entries(plans).map(([planKey, plan]) => {
                            const billingConfigured = Boolean(
                                plan.prices[checkout.data.interval],
                            );

                            return (
                                <Card
                                    key={planKey}
                                    className={cn(
                                        'rounded-[2rem] border-border/70 transition',
                                        planKey === 'pro'
                                            ? 'bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 text-white shadow-xl shadow-cyan-950/15'
                                            : 'bg-card/95',
                                    )}
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <CardTitle
                                                    className={cn(
                                                        'text-3xl',
                                                        planKey === 'pro'
                                                            ? 'text-white'
                                                            : '',
                                                    )}
                                                >
                                                    {plan.name}
                                                </CardTitle>
                                                <CardDescription
                                                    className={cn(
                                                        'mt-2 max-w-md',
                                                        planKey === 'pro'
                                                            ? 'text-slate-300'
                                                            : '',
                                                    )}
                                                >
                                                    {planKey === 'starter'
                                                        ? 'A focused plan for small teams setting up billing discipline.'
                                                        : 'A heavier-duty tier for multi-seat operations and faster support.'}
                                                </CardDescription>
                                            </div>
                                            {planKey === 'pro' ? (
                                                <Badge className="bg-white/12 text-white">
                                                    Most flexible
                                                </Badge>
                                            ) : null}
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-5xl font-semibold tracking-tight">
                                                {pricePreview[planKey]?.[
                                                    checkout.data.interval
                                                ] ?? 'Custom'}
                                            </span>
                                            <span
                                                className={cn(
                                                    'pb-2 text-sm',
                                                    planKey === 'pro'
                                                        ? 'text-slate-300'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {checkout.data.interval ===
                                                'monthly'
                                                    ? 'per month'
                                                    : 'per year'}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-3">
                                            {plan.features.map((feature) => (
                                                <div
                                                    key={feature}
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm',
                                                        planKey === 'pro'
                                                            ? 'border-white/10 bg-white/6 text-slate-100'
                                                            : 'border-border/70 bg-muted/30',
                                                    )}
                                                >
                                                    <Check className="size-4 text-emerald-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        {auth.user ? (
                                            <div className="space-y-3">
                                                <Button
                                                    className={cn(
                                                        'w-full',
                                                        planKey === 'pro'
                                                            ? 'bg-white text-slate-950 hover:bg-slate-100'
                                                            : '',
                                                    )}
                                                    disabled={
                                                        checkout.processing ||
                                                        !billingConfigured
                                                    }
                                                    onClick={() =>
                                                        submitCheckout(planKey)
                                                    }
                                                >
                                                    <CreditCard className="size-4" />
                                                    {billingConfigured
                                                        ? `Start ${plan.name}`
                                                        : 'Price ID missing'}
                                                </Button>
                                                <InputError
                                                    message={
                                                        checkout.errors
                                                            .plan_key ||
                                                        checkout.errors.interval
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <Button
                                                className={cn(
                                                    'w-full',
                                                    planKey === 'pro'
                                                        ? 'bg-white text-slate-950 hover:bg-slate-100'
                                                        : '',
                                                )}
                                                asChild
                                            >
                                                <Link href="/register">
                                                    Create account to continue
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </section>
                </main>
            </div>
        </>
    );
}
