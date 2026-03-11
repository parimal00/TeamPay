import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-linear-to-br from-emerald-500 via-cyan-500 to-blue-600 text-sidebar-primary-foreground shadow-lg shadow-cyan-950/20">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    TeamPay
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Billing for growing teams
                </span>
            </div>
        </>
    );
}
