import { useMemo, useState } from 'react';
import {
  Bell,
  Blocks,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDot,
  Copy,
  CreditCard,
  Filter,
  FileText,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  MessageCircle,
  MonitorSmartphone,
  MoreHorizontal,
  Paperclip,
  PauseCircle,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  TerminalSquare,
  Timer,
  Trash2,
  UploadCloud,
  User,
  WandSparkles,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './ui/sidebar';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { Progress } from './ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Area, AreaChart } from 'recharts';
import { Calendar } from './ui/calendar';
import { cn } from './ui/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const navPrimary = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'auth', label: 'Login', icon: User },
  { id: 'chat', label: 'Chat Workspace', icon: MessageCircle },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'states', label: 'States', icon: CircleAlert },
];

const navSecondary = [
  { id: 'docs', label: 'Docs', icon: BookOpen },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

const breadcrumbTrail = ['Workspace', 'UI Kit', 'Premium Template'];

const actionVariants = [
  { label: 'Primary', variant: 'default' as const },
  { label: 'Secondary', variant: 'secondary' as const },
  { label: 'Ghost', variant: 'ghost' as const },
  { label: 'Destructive', variant: 'destructive' as const },
];

const kpis = [
  { label: 'Active conversations', value: '128', trend: '+12.4%', icon: MessageCircle },
  { label: 'Workflows automated', value: '42', trend: '+6.1%', icon: Sparkles },
  { label: 'Weekly runtime', value: '386 hrs', trend: '+3.8%', icon: Timer },
  { label: 'SLA coverage', value: '99.98%', trend: '+0.2%', icon: ShieldCheck },
];

const densityOptions = [
  { value: 'comfortable', label: 'Comfort' },
  { value: 'compact', label: 'Compact' },
  { value: 'dense', label: 'Dense' },
];

const statusPill = (status: string) =>
  cn('border-transparent', {
    'bg-emerald-500/15 text-emerald-600': status === 'Success',
    'bg-amber-500/15 text-amber-600': status === 'Pending',
    'bg-blue-500/15 text-blue-600': status === 'Review',
  });

const activity = [
  { title: 'SLA audit completed', detail: 'Enterprise program • 4 minutes ago', status: 'Success' },
  { title: 'Model rollout queued', detail: 'Atlas v5 • 18 minutes ago', status: 'Pending' },
  { title: 'Security review flagged', detail: 'Project Vega • 1 hour ago', status: 'Review' },
  { title: 'Workflow published', detail: 'Ops Automation • 3 hours ago', status: 'Success' },
];

const projects = [
  {
    name: 'Atlas Intelligence Suite',
    owner: 'Product Engineering',
    stage: 'In review',
    lastUpdate: '2 hours ago',
    risk: 'Low',
  },
  {
    name: 'Vega Knowledge Graph',
    owner: 'Applied Research',
    stage: 'Active',
    lastUpdate: 'Today',
    risk: 'Medium',
  },
  {
    name: 'Orion Support Automation',
    owner: 'Customer Success',
    stage: 'Planning',
    lastUpdate: 'Yesterday',
    risk: 'Low',
  },
  {
    name: 'Nova Compliance Monitor',
    owner: 'Security',
    stage: 'Blocked',
    lastUpdate: '3 days ago',
    risk: 'High',
  },
  {
    name: 'Pulse KPI Studio',
    owner: 'Analytics',
    stage: 'Active',
    lastUpdate: '4 days ago',
    risk: 'Medium',
  },
];

const tokenSpec = [
  { token: '--premium-bg', value: 'oklch(0.99 0 0)', usage: 'App background' },
  { token: '--premium-surface', value: 'oklch(1 0 0)', usage: 'Cards & surfaces' },
  { token: '--premium-primary', value: 'oklch(0.55 0.18 264)', usage: 'Primary actions' },
  { token: '--premium-secondary', value: 'oklch(0.96 0.01 264)', usage: 'Secondary actions' },
  { token: '--premium-border', value: 'oklch(0.89 0 0)', usage: 'Borders & dividers' },
  { token: '--premium-success', value: 'oklch(0.75 0.15 160)', usage: 'Success state' },
  { token: '--premium-warning', value: 'oklch(0.82 0.15 85)', usage: 'Warning state' },
  { token: '--premium-danger', value: 'oklch(0.62 0.22 25)', usage: 'Error state' },
  { token: '--premium-type-display', value: '32px/40px', usage: 'Display headings' },
  { token: '--premium-type-h2', value: '24px/32px', usage: 'Section titles' },
  { token: '--premium-type-body', value: '14px/20px', usage: 'Body copy' },
  { token: '--premium-space-2', value: '8px', usage: 'Base spacing unit' },
  { token: '--premium-space-4', value: '16px', usage: 'Card padding' },
  { token: '--premium-radius-sm', value: '8px', usage: 'Buttons & inputs' },
  { token: '--premium-radius-lg', value: '16px', usage: 'Cards & panels' },
  { token: '--premium-shadow-md', value: '0 10px 30px', usage: 'Elevated surfaces' },
];

const chartSeries = [38, 52, 48, 64, 78, 72, 86];

const componentInventory = [
  'Buttons: primary / secondary / ghost / destructive / icon',
  'Inputs, textarea, search bar, command palette modal (⌘K)',
  'Select, combobox, date picker',
  'Tabs & segmented controls',
  'Cards (KPI, info, list)',
  'Tables with sorting + pagination',
  'Toasts, alerts, banners',
  'Dialogs, drawers, popovers, tooltips',
  'Badges, status pills, progress, skeletons',
  'Chat bubbles with citations + copy action',
  'Message actions: edit / regenerate / fork / pin / delete',
  'Attachment chips + upload dropzone',
  'Empty + error states',
];

const responsiveRules = [
  'Desktop: 3-column shell (sidebar + content + inspector) with fixed topbar.',
  'Tablet: sidebar collapses to icons, inspector becomes slide-over drawer.',
  'Mobile: stacked layout, topbar condenses, filters move into sheet.',
  'Tables switch to card list with inline status chips and action menu.',
  'Chat input remains sticky bottom with safe-area padding.',
];

const comboboxOptions = [
  'Enterprise rollout',
  'Customer health',
  'Model governance',
  'Workflow automation',
  'Security review',
];

const messageActions = [
  { label: 'Edit', icon: FileText },
  { label: 'Regenerate', icon: RefreshCw },
  { label: 'Fork', icon: GitBranch },
  { label: 'Pin', icon: Pin },
  { label: 'Delete', icon: Trash2 },
];

const chatMessages = [
  {
    id: 'system',
    role: 'System',
    content: 'You are viewing the premium workspace template. Drafts are autosaved.',
  },
  {
    id: 'user',
    role: 'You',
    content: 'Summarize Q3 onboarding health for the Enterprise program.',
  },
  {
    id: 'assistant',
    role: 'Assistant',
    content:
      'Q3 onboarding health is strong: activation is up 18%, time-to-value dropped to 4.2 days, and churn risk fell by 11%. Key driver: the new guided workflow and proactive support SLAs.\n\nRecommendation: scale the proactive checklist to the top 20 accounts and monitor the 5 accounts with slow security reviews.\n\nSources: Activation dashboard, SLA tracker, Support pipeline.',
  },
];

export function PremiumUITemplate() {
  const [activePage, setActivePage] = useState('dashboard');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const pageTitle = useMemo(() => {
    switch (activePage) {
      case 'dashboard':
        return 'Main Dashboard';
      case 'chat':
        return 'Chat Workspace';
      case 'projects':
        return 'Projects';
      case 'settings':
        return 'Settings';
      case 'states':
        return 'Empty & Error States';
      default:
        return 'Dashboard';
    }
  }, [activePage]);

  return (
    <div className="premium-shell min-h-screen bg-[radial-gradient(circle_at_top,_var(--premium-bg-strong),_var(--premium-bg))] text-[color:var(--premium-text-strong)]">
      <SidebarProvider defaultOpen>
        <TooltipProvider delayDuration={200}>
          <Sidebar
            collapsible="icon"
            className="premium-sidebar border-r border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]"
          >
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--premium-primary)] text-white shadow-[var(--premium-shadow-md)]">
                <Sparkles className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Jargvis Enterprise</p>
                <p className="text-xs text-[color:var(--premium-text-muted)]">Premium UI Kit</p>
              </div>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--premium-text-muted)]" />
                  <Input
                    className="h-9 rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] pl-9 text-sm"
                    placeholder="Search workspace"
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navPrimary.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activePage === item.id}
                        onClick={() => setActivePage(item.id)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navSecondary.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
              <p className="text-xs text-[color:var(--premium-text-muted)]">Need help?</p>
              <p className="text-sm font-medium">Open onboarding checklist</p>
              <Button variant="secondary" size="sm" className="mt-3 w-full rounded-lg">
                Launch checklist
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="premium-topbar sticky top-0 z-30 border-b border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]/80 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--premium-text-muted)]">
                  {breadcrumbTrail.map((crumb, index) => (
                    <div key={crumb} className="flex items-center gap-2">
                      <span className={cn(index === breadcrumbTrail.length - 1 ? 'text-[color:var(--premium-text-strong)]' : undefined)}>
                        {crumb}
                      </span>
                      {index < breadcrumbTrail.length - 1 && <ChevronRight className="size-3" />}
                    </div>
                  ))}
                  <ChevronRight className="size-3" />
                  <span className="text-[color:var(--premium-text-strong)]">{pageTitle}</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--premium-text-muted)]" />
                  <Input
                    className="h-9 rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] pl-9 text-sm"
                    placeholder="Search workflows"
                  />
                </div>
                <Button variant="secondary" size="sm" className="rounded-lg">
                  <Plus className="size-4" />
                  New
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Bell className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 rounded-xl border-[color:var(--premium-border)]">
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Notifications</p>
                      <div className="rounded-lg border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-2 text-xs">
                        SLA review completed for Atlas Suite.
                      </div>
                      <div className="rounded-lg border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-2 text-xs">
                        3 workflows require approval.
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCommandOpen(true)}>
                        <TerminalSquare className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Command palette (⌘K)</TooltipContent>
                  </Tooltip>
                  <DialogContent className="max-w-lg rounded-2xl border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                    <DialogHeader>
                      <DialogTitle>Command palette</DialogTitle>
                      <DialogDescription>Jump to actions, workflows, and settings.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Input placeholder="Type a command..." />
                      <div className="grid gap-2 text-sm">
                        <button className="flex items-center justify-between rounded-lg border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] px-3 py-2">
                          <span>Open new workflow</span>
                          <kbd className="rounded border border-[color:var(--premium-border)] px-2 py-1 text-xs">N</kbd>
                        </button>
                        <button className="flex items-center justify-between rounded-lg border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] px-3 py-2">
                          <span>Invite collaborator</span>
                          <kbd className="rounded border border-[color:var(--premium-border)] px-2 py-1 text-xs">I</kbd>
                        </button>
                        <button className="flex items-center justify-between rounded-lg border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] px-3 py-2">
                          <span>Switch to dark mode</span>
                          <kbd className="rounded border border-[color:var(--premium-border)] px-2 py-1 text-xs">D</kbd>
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Profile</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <main className="premium-content grid gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <Tabs value={activePage} onValueChange={setActivePage} className="space-y-6">
                <TabsList className="premium-tabs flex w-fit gap-1 rounded-full border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-1">
                  {navPrimary.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-[color:var(--premium-primary)] data-[state=active]:text-white"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi) => (
                      <Card key={kpi.label} className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-[color:var(--premium-text-muted)]">
                            {kpi.label}
                          </CardTitle>
                          <div className="flex size-9 items-center justify-center rounded-lg bg-[color:var(--premium-surface-strong)]">
                            <kpi.icon className="size-4 text-[color:var(--premium-primary)]" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-semibold">{kpi.value}</div>
                          <div className="text-xs text-[color:var(--premium-success)]">{kpi.trend} vs last week</div>
                        </CardContent>
                      </Card>
                    ))}
                  </section>

                  <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Adoption velocity</CardTitle>
                        <CardDescription>Weekly activity and retention across key accounts.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 h-[220px]">
                          <ChartContainer
                            config={{
                              adoption: {
                                label: 'Adoption',
                                color: 'var(--premium-primary)',
                              },
                            }}
                          >
                            <AreaChart data={chartSeries.map((value, index) => ({ name: index, adoption: value }))}>
                              <Area
                                dataKey="adoption"
                                type="monotone"
                                stroke="var(--premium-primary)"
                                fill="var(--premium-primary)"
                                fillOpacity={0.15}
                                strokeWidth={2}
                              />
                              <ChartTooltip
                                cursor={{ stroke: 'var(--premium-border)', strokeWidth: 1 }}
                                content={<ChartTooltipContent />}
                              />
                            </AreaChart>
                          </ChartContainer>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[color:var(--premium-text-muted)]">
                          <span>Retention</span>
                          <span>98%</span>
                        </div>
                        <Progress value={78} className="mt-2 h-2" />
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                            <p className="text-xs text-[color:var(--premium-text-muted)]">Net ARR</p>
                            <p className="text-lg font-semibold">$2.4M</p>
                            <p className="text-xs text-[color:var(--premium-success)]">+7.1%</p>
                          </div>
                          <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                            <p className="text-xs text-[color:var(--premium-text-muted)]">Time to value</p>
                            <p className="text-lg font-semibold">4.2 days</p>
                            <p className="text-xs text-[color:var(--premium-success)]">-0.8 days</p>
                          </div>
                          <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                            <p className="text-xs text-[color:var(--premium-text-muted)]">Engagement score</p>
                            <p className="text-lg font-semibold">93</p>
                            <p className="text-xs text-[color:var(--premium-success)]">+5 pts</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Activity feed</CardTitle>
                        <CardDescription>Latest actions from the workspace.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {activity.map((item) => (
                          <div
                            key={item.title}
                            className="flex items-start gap-3 rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3"
                          >
                            <div className="mt-1 size-2 rounded-full bg-[color:var(--premium-primary)]" />
                            <div>
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-[color:var(--premium-text-muted)]">{item.detail}</p>
                            </div>
                            <Badge variant="outline" className={cn('ml-auto', statusPill(item.status))}>
                              {item.status}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </section>
                </TabsContent>

                <TabsContent value="auth" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1fr]">
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>Sign in to continue to your enterprise workspace.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Work email</label>
                          <Input placeholder="you@company.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Password</label>
                          <Input type="password" placeholder="••••••••" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-[color:var(--premium-text-muted)]">
                          <span>Remember this device</span>
                          <Button variant="ghost" size="sm" className="h-auto px-0">Forgot password?</Button>
                        </div>
                        <Button className="w-full rounded-lg">Sign in</Button>
                        <Button variant="secondary" className="w-full rounded-lg">
                          Continue with SSO
                        </Button>
                      </CardContent>
                      <CardFooter className="text-xs text-[color:var(--premium-text-muted)]">
                        By continuing, you agree to the enterprise terms of service.
                      </CardFooter>
                    </Card>
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>Invite your team and configure your workspace.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Full name</label>
                          <Input placeholder="Alex Kim" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Company</label>
                          <Input placeholder="Acme Corporation" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Role</label>
                          <Select defaultValue="design">
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="product">Product</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full rounded-lg">Request access</Button>
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3 text-xs text-[color:var(--premium-text-muted)]">
                          Enterprise customers can enable SSO, SCIM provisioning, and audit logging during setup.
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Enterprise Q3 Review</CardTitle>
                          <CardDescription>Client health summary & executive highlights.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CircleDot className="size-3" />
                            Generating
                          </Badge>
                          <Button variant="secondary" size="sm" className="rounded-lg">
                            <PauseCircle className="size-4" />
                            Stop
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[color:var(--premium-text-muted)]">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">Branch: /Exec Summary</Badge>
                            <Badge variant="outline">Forked from /Q3 Review</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <CircleDot className="size-3 animate-pulse text-[color:var(--premium-primary)]" />
                            Streaming response...
                          </div>
                        </div>
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`rounded-2xl border px-4 py-3 text-sm shadow-[var(--premium-shadow-sm)] ${
                              message.role === 'Assistant'
                                ? 'border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)]'
                                : message.role === 'System'
                                  ? 'border-[color:var(--premium-warning)]/30 bg-[color:var(--premium-warning)]/10 text-[color:var(--premium-warning)]'
                                  : 'border-[color:var(--premium-primary)]/30 bg-[color:var(--premium-primary)]/10'
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[color:var(--premium-text-muted)]">
                              <span>{message.role}</span>
                              {message.role === 'Assistant' && (
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Copy className="size-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <WandSparkles className="size-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <p className="whitespace-pre-line text-[color:var(--premium-text-strong)]">{message.content}</p>
                            {message.role === 'Assistant' && (
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--premium-text-muted)]">
                                <Badge variant="outline">Citations</Badge>
                                <Badge variant="outline">Copy response</Badge>
                                <Badge variant="outline">Fork from here</Badge>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="rounded-2xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">Message actions</p>
                              <p className="text-xs text-[color:var(--premium-text-muted)]">Edit, fork, regenerate, or pin responses.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {messageActions.map((action) => (
                                <Button key={action.label} variant="ghost" size="sm" className="rounded-lg">
                                  <action.icon className="size-4" />
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-dashed border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Attachments</p>
                              <p className="text-xs text-[color:var(--premium-text-muted)]">Drag files or paste links.</p>
                            </div>
                            <Button variant="secondary" size="sm" className="rounded-lg">
                              <UploadCloud className="size-4" />
                              Upload
                            </Button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="secondary">Q3-health.xlsx</Badge>
                            <Badge variant="secondary">support-notes.pdf</Badge>
                            <Badge variant="secondary">SLA_export.csv</Badge>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-[color:var(--premium-text-muted)]">
                            <Paperclip className="size-3" />
                            Drop files (PDF, CSV, PPTX) or paste URLs.
                          </div>
                        </div>
                        <div className="rounded-2xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Loading response</p>
                              <p className="text-xs text-[color:var(--premium-text-muted)]">Skeleton preview while streaming.</p>
                            </div>
                            <Badge variant="outline">Streaming</Badge>
                          </div>
                          <div className="mt-4 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-3">
                        <Textarea
                          placeholder="Ask a question, reference a workflow, or paste a snippet..."
                          className="min-h-[120px] rounded-2xl"
                        />
                        <div className="flex w-full flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" className="rounded-lg">
                              Regenerate
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-lg">
                              Fork conversation
                            </Button>
                          </div>
                          <Button className="rounded-lg">Send prompt</Button>
                        </div>
                      </CardFooter>
                    </Card>
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Inspector</CardTitle>
                        <CardDescription>Context, logs, and model metadata.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                          <p className="text-xs text-[color:var(--premium-text-muted)]">Model</p>
                          <p className="text-sm font-semibold">Jargvis Enterprise v5.2</p>
                          <Badge variant="outline" className="mt-2">Streaming active</Badge>
                        </div>
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                          <p className="text-xs text-[color:var(--premium-text-muted)]">Model settings</p>
                          <div className="mt-2 space-y-2">
                            <Select defaultValue="enterprise">
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="enterprise">Enterprise v5.2</SelectItem>
                                <SelectItem value="fast">Fast Response</SelectItem>
                                <SelectItem value="balanced">Balanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select defaultValue="creative">
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Tone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="analytical">Analytical</SelectItem>
                                <SelectItem value="concise">Concise</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                          <p className="text-xs text-[color:var(--premium-text-muted)]">Branch path</p>
                          <p className="text-sm">/Workspace / Q3 Review / Exec Summary</p>
                          <Button variant="ghost" size="sm" className="mt-2">View breadcrumbs</Button>
                        </div>
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                          <p className="text-xs text-[color:var(--premium-text-muted)]">Response actions</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {messageActions.map((action) => (
                              <Badge key={action.label} variant="secondary" className="flex items-center gap-1">
                                <action.icon className="size-3" />
                                {action.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                    <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>Track high-impact initiatives and governance status.</CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" className="rounded-lg">
                          <Filter className="size-4" />
                          Filter
                        </Button>
                        <Button size="sm" className="rounded-lg" onClick={() => setDetailsOpen(true)}>
                          <Plus className="size-4" />
                          New project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">Active</Badge>
                          <Badge variant="secondary">Compliance review</Badge>
                          <Badge variant="secondary">Assigned to you</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Select defaultValue="status">
                            <SelectTrigger className="h-8 w-[160px] rounded-lg text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="status">Status: All</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="review">In review</SelectItem>
                              <SelectItem value="blocked">Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="owner">
                            <SelectTrigger className="h-8 w-[160px] rounded-lg text-xs">
                              <SelectValue placeholder="Owner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner: All</SelectItem>
                              <SelectItem value="product">Product</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="analytics">Analytics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project) => (
                            <TableRow key={project.name}>
                              <TableCell className="font-medium">{project.name}</TableCell>
                              <TableCell>{project.owner}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{project.stage}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={project.risk === 'High' ? 'destructive' : 'secondary'}>
                                  {project.risk}
                                </Badge>
                              </TableCell>
                              <TableCell>{project.lastUpdate}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--premium-text-muted)]">
                        <span>Showing 5 of 24 projects</span>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                1
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)] lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Profile & Workspace</CardTitle>
                        <CardDescription>Keep your workspace details aligned for enterprise stakeholders.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Full name</label>
                          <Input defaultValue="Ava Martinez" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Role</label>
                          <Input defaultValue="Staff Product Designer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Workspace</label>
                          <div className="relative">
                            <Input defaultValue="Enterprise Studio" className="pr-10" />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md"
                                >
                                  <ChevronRight className="size-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 rounded-xl border-[color:var(--premium-border)]">
                                <div className="space-y-2 text-sm">
                                  <p className="font-medium">Quick workspaces</p>
                                  {comboboxOptions.map((option) => (
                                    <button
                                      key={option}
                                      className="w-full rounded-lg border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] px-3 py-2 text-left text-xs"
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[color:var(--premium-text-muted)]">Region</label>
                          <Select defaultValue="us">
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="eu">Europe</SelectItem>
                              <SelectItem value="apac">APAC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost">Reset</Button>
                        <Button>Save changes</Button>
                      </CardFooter>
                    </Card>
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Switch between premium modes.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                          <p className="text-sm font-medium">Theme</p>
                          <ToggleGroup type="single" defaultValue="light" className="mt-3">
                            <ToggleGroupItem value="light">Light</ToggleGroupItem>
                            <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                            <ToggleGroupItem value="system">System</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                          <p className="text-sm font-medium">Density</p>
                          <ToggleGroup type="single" defaultValue="comfortable" className="mt-3">
                            {densityOptions.map((option) => (
                              <ToggleGroupItem key={option.value} value={option.value}>
                                {option.label}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </div>
                        <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Date picker</p>
                            <SlidersHorizontal className="size-4 text-[color:var(--premium-text-muted)]" />
                          </div>
                          <div className="mt-3 rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                            <Calendar />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                    <CardHeader>
                      <CardTitle>Model & Provider Settings</CardTitle>
                      <CardDescription>Configure guardrails, routing, and default inference policies.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                        <p className="text-xs text-[color:var(--premium-text-muted)]">Default model</p>
                        <p className="text-sm font-semibold">Enterprise v5.2</p>
                        <p className="text-xs text-[color:var(--premium-text-muted)]">Latency optimized</p>
                      </div>
                      <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                        <p className="text-xs text-[color:var(--premium-text-muted)]">Fallback routing</p>
                        <p className="text-sm font-semibold">Atlas Core + Edge</p>
                        <p className="text-xs text-[color:var(--premium-text-muted)]">Auto failover enabled</p>
                      </div>
                      <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                        <p className="text-xs text-[color:var(--premium-text-muted)]">Safety policy</p>
                        <p className="text-sm font-semibold">Enterprise guardrails</p>
                        <p className="text-xs text-[color:var(--premium-text-muted)]">v3.1 active</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="states" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Empty state</CardTitle>
                        <CardDescription>Illustration placeholder with clear next step.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-[color:var(--premium-surface-strong)] text-[color:var(--premium-primary)]">
                          <Blocks className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">No workflows yet</p>
                          <p className="text-xs text-[color:var(--premium-text-muted)]">
                            Create your first automation or import a template to get started.
                          </p>
                        </div>
                        <Button className="rounded-lg">Create workflow</Button>
                      </CardContent>
                    </Card>
                    <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                      <CardHeader>
                        <CardTitle>Error state</CardTitle>
                        <CardDescription>Clear guidance with recovery action.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Alert variant="destructive" className="border-[color:var(--premium-danger)]/40">
                          <CircleAlert className="size-4" />
                          <AlertTitle>We couldn’t sync the workspace.</AlertTitle>
                          <AlertDescription>
                            Check your network connection and try again. Contact support if the issue persists.
                          </AlertDescription>
                        </Alert>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary">Retry sync</Button>
                          <Button variant="ghost">View status page</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                <CardHeader>
                  <CardTitle>Design tokens</CardTitle>
                  <CardDescription>Use the token roles across light and dark themes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Usage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tokenSpec.map((token) => (
                        <TableRow key={token.token}>
                          <TableCell className="font-mono text-xs">{token.token}</TableCell>
                          <TableCell>{token.value}</TableCell>
                          <TableCell>{token.usage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                <CardHeader>
                  <CardTitle>Component inventory</CardTitle>
                  <CardDescription>Reusable, accessible building blocks and variants.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {componentInventory.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 text-[color:var(--premium-success)]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 rounded-2xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
                    <p className="text-sm font-medium">Component variants</p>
                    <div className="flex flex-wrap gap-2">
                      {actionVariants.map((action) => (
                        <Button key={action.label} variant={action.variant} size="sm" className="rounded-lg">
                          {action.label}
                        </Button>
                      ))}
                      <Button variant="ghost" size="icon" className="rounded-lg">
                        <Star className="size-4" />
                      </Button>
                    </div>
                    <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface)] p-3 text-xs text-[color:var(--premium-text-muted)]">
                      Use consistent radii, spacing, and focus rings across all variants.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                <CardHeader>
                  <CardTitle>Responsive rules</CardTitle>
                  <CardDescription>Desktop-first behavior with tablet/mobile considerations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {responsiveRules.map((rule) => (
                    <div key={rule} className="flex items-start gap-2 text-sm text-[color:var(--premium-text-muted)]">
                      <ChevronRight className="mt-0.5 size-4 text-[color:var(--premium-primary)]" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                <CardHeader>
                  <CardTitle>Inspector</CardTitle>
                  <CardDescription>Live metadata, logs, and tools.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                    <p className="text-xs text-[color:var(--premium-text-muted)]">Active workspace</p>
                    <p className="text-sm font-semibold">Premium UI Kit</p>
                    <p className="text-xs text-[color:var(--premium-text-muted)]">Updated 2 minutes ago</p>
                  </div>
                  <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                    <p className="text-xs text-[color:var(--premium-text-muted)]">Current focus</p>
                    <p className="text-sm font-semibold">Executive summary layout</p>
                    <Badge variant="secondary" className="mt-2">In review</Badge>
                  </div>
                  <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-3">
                    <p className="text-xs text-[color:var(--premium-text-muted)]">Quick tools</p>
                    <div className="mt-2 grid gap-2">
                      <Button variant="secondary" size="sm" className="w-full rounded-lg">
                        <TerminalSquare className="size-4" />
                        Command palette
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full rounded-lg">
                        <MonitorSmartphone className="size-4" />
                        Preview responsive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>Availability and system readiness.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security posture</span>
                    <Badge variant="secondary">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Latency budget</span>
                    <Badge variant="secondary">Stable</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <Badge variant="secondary">3 new</Badge>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </main>
          </SidebarInset>
        </TooltipProvider>
      </SidebarProvider>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="premium-drawer border-[color:var(--premium-border)] bg-[color:var(--premium-surface)]">
          <SheetHeader>
            <SheetTitle>Project details</SheetTitle>
            <SheetDescription>Inspector drawer for workflow metadata.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-4">
            <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
              <p className="text-xs text-[color:var(--premium-text-muted)]">Primary stakeholders</p>
              <p className="text-sm font-semibold">Enterprise Success, Security, Analytics</p>
            </div>
            <div className="rounded-xl border border-[color:var(--premium-border)] bg-[color:var(--premium-surface-strong)] p-4">
              <p className="text-xs text-[color:var(--premium-text-muted)]">Next milestone</p>
              <p className="text-sm font-semibold">Executive review • Feb 12</p>
              <Button variant="secondary" size="sm" className="mt-3 w-full rounded-lg">
                Add reminder
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
