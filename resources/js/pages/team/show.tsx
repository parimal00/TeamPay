import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { MailPlus, Users } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type TeamMember = {
    id: number;
    name: string;
    email: string;
    role?: string | null;
};

type TeamData = {
    id: number;
    name: string;
    owner_id: number;
    seat_count: number;
    members: TeamMember[];
} | null;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
];

export default function TeamShow({ team }: { team: TeamData }) {
    const { auth, flash } = usePage().props as {
        auth: { user: { id: number } };
        flash?: { success?: string; error?: string };
    };
    const createTeam = useForm({
        name: '',
    });
    const inviteMember = useForm({
        email: '',
    });
    const isOwner = Boolean(team && auth.user.id === team.owner_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team" />

            <div className="flex flex-1 flex-col gap-6 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.1),_transparent_22%)] p-4 md:p-6">
                <section className="rounded-[2rem] border border-border/70 bg-card/95 px-6 py-8 shadow-sm md:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <Badge className="w-fit bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                                <Users className="size-3.5" />
                                Team workspace
                            </Badge>
                            <Heading
                                title={
                                    team
                                        ? `${team.name} members`
                                        : 'Create your first team'
                                }
                                description={
                                    team
                                        ? 'Invite teammates, manage seats, and keep the billing roster accurate.'
                                        : 'Start with a team name so billing and access can be managed in one place.'
                                }
                            />
                        </div>
                        {team ? (
                            <div className="grid gap-2 rounded-3xl border border-border/70 bg-muted/30 px-5 py-4 text-sm">
                                <span className="text-muted-foreground">
                                    Active seats
                                </span>
                                <span className="text-3xl font-semibold">
                                    {team.seat_count}
                                </span>
                            </div>
                        ) : null}
                    </div>
                    {flash?.success ? (
                        <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                            {flash.success}
                        </div>
                    ) : null}
                    {flash?.error ? (
                        <div className="mt-6 rounded-2xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                            {flash.error}
                        </div>
                    ) : null}
                </section>

                {!team ? (
                    <Card className="rounded-[2rem] border-border/70">
                        <CardHeader>
                            <CardTitle>Name your team</CardTitle>
                            <CardDescription>
                                This becomes the shared workspace for members,
                                seats, and invoices.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="grid gap-5 md:max-w-xl"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    createTeam.post('/team');
                                }}
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="team-name">Team name</Label>
                                    <Input
                                        id="team-name"
                                        value={createTeam.data.name}
                                        onChange={(event) =>
                                            createTeam.setData(
                                                'name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Operations, Finance, or Client Success"
                                    />
                                    <InputError
                                        message={createTeam.errors.name}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button disabled={createTeam.processing}>
                                        Create team
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/pricing">
                                            Review plans first
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <Card className="rounded-[2rem] border-border/70">
                            <CardHeader>
                                <CardTitle>Invite a member</CardTitle>
                                <CardDescription>
                                    Add people by email. Seat count updates from
                                    the same team roster.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="grid gap-5"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        inviteMember.post('/team/members', {
                                            onSuccess: () =>
                                                inviteMember.reset('email'),
                                        });
                                    }}
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="member-email">
                                            Member email
                                        </Label>
                                        <Input
                                            id="member-email"
                                            type="email"
                                            value={inviteMember.data.email}
                                            onChange={(event) =>
                                                inviteMember.setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="teammate@company.com"
                                            disabled={!isOwner}
                                        />
                                        <InputError
                                            message={inviteMember.errors.email}
                                        />
                                    </div>
                                    <Button
                                        disabled={
                                            inviteMember.processing || !isOwner
                                        }
                                    >
                                        <MailPlus className="size-4" />
                                        {isOwner
                                            ? 'Add member'
                                            : 'Only owners can invite members'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2rem] border-border/70">
                            <CardHeader>
                                <CardTitle>Current roster</CardTitle>
                                <CardDescription>
                                    Each person here counts toward your active
                                    seat total.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {team.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/25 p-4 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {member.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {member.email}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">
                                                {member.id === team.owner_id
                                                    ? 'Owner'
                                                    : (member.role ?? 'Member')}
                                            </Badge>
                                            {isOwner &&
                                            member.id !== team.owner_id ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.delete(
                                                            `/team/members/${member.id}`,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
