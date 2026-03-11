import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CreditCard,
    Receipt,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type PlanConfig = {
    name: string;
    prices: {
        monthly?: string | null;
        yearly?: string | null;
    };
    features: string[];
};

type TeamSummary = {
    id: number;
    name: string;
    owner_id: number;
    seat_count: number;
} | null;

const pricePreview: Record<string, { monthly: string; yearly: string }> = {
    starter: { monthly: '$19', yearly: '$190' },
    pro: { monthly: '$59', yearly: '$590' },
};

export default function Dashboard({
    plans,
    team,
}: {
    plans: Record<string, PlanConfig>;
    team: TeamSummary;
}) {
    const { auth, flash } = usePage().props as {
        auth: { user: { name: string } };
        flash?: { success?: string; error?: string };
    };
    const planEntries = Object.entries(plans);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_28%)] p-4 md:p-6">
                <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-sm">
                    <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.9fr] md:px-8">
                        <div className="space-y-5">
                            <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                <Sparkles className="size-3.5" />
                                TeamPay workspace
                            </Badge>
                            <div className="space-y-3">
                                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                                    Keep seats, billing, and renewal visibility
                                    in one place.
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                    {auth.user.name}, this workspace is set up
                                    for team billing, member management, and
                                    invoice tracking without leaving the app.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <Link href="/team">
                                        Open team workspace
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/pricing">Review plans</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/billing/invoices">
                                        View invoices
                                    </Link>
                                </Button>
                            </div>
                            {flash?.success ? (
                                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                                    {flash.success}
                                </div>
                            ) : null}
                            {flash?.error ? (
                                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                                    {flash.error}
                                </div>
                            ) : null}
                        </div>

                        <div className="grid gap-4">
                            <Card className="rounded-2xl border-border/70 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
                                <CardHeader>
                                    <CardDescription className="text-slate-300">
                                        Current team status
                                    </CardDescription>
                                    <CardTitle className="text-2xl text-white">
                                        {team ? team.name : 'No team yet'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="rounded-xl bg-white/8 p-4">
                                        <div className="text-slate-300">
                                            Active seats
                                        </div>
                                        <div className="mt-2 text-3xl font-semibold">
                                            {team ? team.seat_count : 0}
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-white/8 p-4">
                                        <div className="text-slate-300">
                                            Plans available
                                        </div>
                                        <div className="mt-2 text-3xl font-semibold">
                                            {planEntries.length}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Card className="rounded-2xl border-border/70">
                                    <CardHeader>
                                        <Users className="size-5 text-cyan-600" />
                                        <CardTitle>Seats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Add or remove members from a single team
                                        roster.
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border-border/70">
                                    <CardHeader>
                                        <CreditCard className="size-5 text-emerald-600" />
                                        <CardTitle>Billing</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Switch between starter and pro plans as
                                        your headcount changes.
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border-border/70">
                                    <CardHeader>
                                        <ShieldCheck className="size-5 text-violet-600" />
                                        <CardTitle>Control</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Keep account settings, security, and
                                        invoices close to the workspace.
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card className="rounded-3xl border-border/70">
                        <CardHeader>
                            <Heading
                                title="Plan lineup"
                                description="Preview the plans currently configured for TeamPay."
                            />
                        </CardHeader>
                        <CardContent className="grid gap-4 lg:grid-cols-2">
                            {planEntries.map(([planKey, plan]) => (
                                <div
                                    key={planKey}
                                    className="rounded-2xl border border-border/70 bg-muted/30 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-lg font-semibold">
                                                {plan.name}
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Built for{' '}
                                                {planKey === 'starter'
                                                    ? 'lean teams getting started'
                                                    : 'operators managing multiple squads'}
                                                .
                                            </p>
                                        </div>
                                        <Badge variant="secondary">
                                            {pricePreview[planKey]?.monthly ??
                                                'Custom'}
                                            /mo
                                        </Badge>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {plan.features.map((feature) => (
                                            <Badge
                                                key={feature}
                                                variant="outline"
                                            >
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-5 flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Annual preview:{' '}
                                            {pricePreview[planKey]?.yearly ??
                                                'Custom'}
                                            /yr
                                        </span>
                                        <Link
                                            href="/pricing"
                                            className="font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                                        >
                                            Compare plan
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="size-5 text-cyan-600" />
                                Next actions
                            </CardTitle>
                            <CardDescription>
                                The shortest path to a usable billing setup.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="rounded-2xl border border-border/70 p-4">
                                <div className="font-medium">
                                    {team
                                        ? 'Keep your team list current'
                                        : 'Create your first team'}
                                </div>
                                <p className="mt-1 text-muted-foreground">
                                    {team
                                        ? 'Seat-based billing works better when your member roster stays accurate.'
                                        : 'Start with a team name, then invite members before enabling billing.'}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/team">Open team settings</Link>
                                </Button>
                            </div>

                            <div className="rounded-2xl border border-border/70 p-4">
                                <div className="font-medium">
                                    Review invoices and renewals
                                </div>
                                <p className="mt-1 text-muted-foreground">
                                    Use the invoice screen as the source of
                                    truth for subscription history.
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/billing/invoices">
                                        Open invoice archive
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
