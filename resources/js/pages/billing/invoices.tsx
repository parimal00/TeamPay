import { Head, Link } from '@inertiajs/react';
import { Download, Receipt } from 'lucide-react';
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
import type { BreadcrumbItem } from '@/types';

type Invoice = {
    id: string;
    date: string;
    total: string;
    status: string;
    download_url?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/billing/invoices',
    },
];

export default function BillingInvoices({
    invoices,
    billingEnabled,
}: {
    invoices: Invoice[];
    billingEnabled: boolean;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />

            <div className="flex flex-1 flex-col gap-6 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.1),_transparent_22%)] p-4 md:p-6">
                <section className="rounded-[2rem] border border-border/70 bg-card/95 px-6 py-8 shadow-sm md:px-8">
                    <Badge className="w-fit bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                        <Receipt className="size-3.5" />
                        Billing history
                    </Badge>
                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <Heading
                            title="Invoice archive"
                            description="Track payment history, invoice status, and billing activity from a single screen."
                        />
                        <Button variant="outline" asChild>
                            <Link href="/pricing">Review plans</Link>
                        </Button>
                    </div>
                </section>

                <Card className="rounded-[2rem] border-border/70">
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>
                            {billingEnabled
                                ? 'The latest invoice records tied to this workspace.'
                                : 'Billing is not fully configured yet, so invoice data is unavailable.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/20 p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            {invoice.id}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Issued on {invoice.date}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline">
                                            {invoice.status}
                                        </Badge>
                                        <div className="min-w-24 text-right font-medium">
                                            {invoice.total}
                                        </div>
                                        {invoice.download_url ? (
                                            <Button variant="outline" asChild>
                                                <a href={invoice.download_url}>
                                                    <Download className="size-4" />
                                                    Open
                                                </a>
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center">
                                <div className="text-lg font-semibold">
                                    No invoices yet
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Complete checkout from the pricing page and
                                    your invoice history will appear here.
                                </p>
                                <Button className="mt-5" asChild>
                                    <Link href="/pricing">Open pricing</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
