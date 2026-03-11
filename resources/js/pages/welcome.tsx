import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CreditCard,
    Receipt,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as {
        auth: {
            user: { name: string } | null;
        };
    };

    return (
        <>
            <Head title="TeamPay">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[linear-gradient(180deg,_rgba(240,253,250,0.95)_0%,_rgba(255,255,255,1)_28%,_rgba(248,250,252,1)_100%)] text-foreground dark:bg-[linear-gradient(180deg,_rgba(2,6,23,1)_0%,_rgba(3,7,18,1)_100%)]">
                <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 via-cyan-500 to-blue-600 text-lg font-semibold text-white shadow-lg shadow-cyan-950/20">
                            T
                        </div>
                        <div>
                            <div className="text-base font-semibold">
                                TeamPay
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Seats, invoices, and subscriptions
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <Link
                            href="/pricing"
                            className="rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground"
                        >
                            Pricing
                        </Link>
                        {auth.user ? (
                            <Button asChild>
                                <Link href={dashboard()}>Open dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground"
                                >
                                    Log in
                                </Link>
                                {canRegister ? (
                                    <Button asChild>
                                        <Link href={register()}>
                                            Start free
                                        </Link>
                                    </Button>
                                ) : null}
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 pt-8 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-12 lg:pb-24">
                    <section className="space-y-8">
                        <div className="space-y-5">
                            <Badge className="border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                                Team subscriptions without spreadsheet drift
                            </Badge>
                            <div className="space-y-4">
                                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                                    Run team billing, seat access, and invoice
                                    history from one clean workspace.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                    TeamPay is built for operators who need
                                    pricing clarity, predictable renewals, and a
                                    fast way to keep team access in sync.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Button asChild size="lg">
                                        <Link href={dashboard()}>
                                            Go to workspace
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        {canRegister ? (
                                            <Button asChild size="lg">
                                                <Link href={register()}>
                                                    Create account
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </Button>
                                        ) : null}
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                        >
                                            <Link href={login()}>Sign in</Link>
                                        </Button>
                                    </>
                                )}
                                <Button asChild size="lg" variant="ghost">
                                    <Link href="/pricing">View pricing</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Card className="rounded-3xl border-border/70 bg-card/85 backdrop-blur">
                                <CardHeader>
                                    <Users className="size-5 text-cyan-600" />
                                    <CardTitle>Seat-aware teams</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Keep membership aligned with the plan you
                                    are actually paying for.
                                </CardContent>
                            </Card>
                            <Card className="rounded-3xl border-border/70 bg-card/85 backdrop-blur">
                                <CardHeader>
                                    <CreditCard className="size-5 text-emerald-600" />
                                    <CardTitle>Clear pricing</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Compare starter and pro tiers before pushing
                                    the team through checkout.
                                </CardContent>
                            </Card>
                            <Card className="rounded-3xl border-border/70 bg-card/85 backdrop-blur">
                                <CardHeader>
                                    <Receipt className="size-5 text-violet-600" />
                                    <CardTitle>Invoice archive</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Keep renewals, receipts, and payment history
                                    close to the workspace.
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section className="grid gap-5 self-start">
                        <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-slate-950 text-white shadow-2xl shadow-cyan-950/15">
                            <CardHeader className="border-b border-white/10 pb-5">
                                <CardDescription className="text-slate-300">
                                    Operations snapshot
                                </CardDescription>
                                <CardTitle className="text-2xl text-white">
                                    From invite to invoice, without context
                                    switching.
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-white/6 p-4">
                                        <div className="text-xs tracking-[0.24em] text-slate-400 uppercase">
                                            Seat health
                                        </div>
                                        <div className="mt-2 text-3xl font-semibold">
                                            100%
                                        </div>
                                        <div className="mt-1 text-sm text-slate-300">
                                            team visibility
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-white/6 p-4">
                                        <div className="text-xs tracking-[0.24em] text-slate-400 uppercase">
                                            Billing flow
                                        </div>
                                        <div className="mt-2 text-3xl font-semibold">
                                            2
                                        </div>
                                        <div className="mt-1 text-sm text-slate-300">
                                            plan tiers ready
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-linear-to-r from-emerald-500/18 via-cyan-500/12 to-transparent p-5">
                                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                                        <ShieldCheck className="size-4" />
                                        Built for accountable access control
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-200">
                                        Pricing, member access, and renewal
                                        history stay attached to the same team
                                        record so nothing drifts.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Card className="rounded-3xl border-border/70 bg-card/90">
                                <CardHeader>
                                    <CardTitle>Starter</CardTitle>
                                    <CardDescription>
                                        For lean teams building process.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-semibold">
                                        $19
                                        <span className="text-base font-normal text-muted-foreground">
                                            /mo
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-3xl border-border/70 bg-card/90">
                                <CardHeader>
                                    <CardTitle>Pro</CardTitle>
                                    <CardDescription>
                                        For larger teams with heavier billing
                                        needs.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-semibold">
                                        $59
                                        <span className="text-base font-normal text-muted-foreground">
                                            /mo
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
