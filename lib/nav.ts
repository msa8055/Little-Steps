import {
  LayoutDashboard, GraduationCap, ShieldCheck, PiggyBank, HeartPulse, Briefcase, GitBranch, Palette, ListChecks, Trophy, Gift, ClipboardCheck,
  Library, UserRound, BookHeart, Gamepad2, Users, Map, Bell, Settings, Baby, CalendarDays, FileText, Handshake, MessageSquare, FolderUp,
  BarChart3, UserCog, BadgeCheck, Layers, Megaphone, ScrollText, LifeBuoy, Home, type LucideIcon,
} from 'lucide-react'
import type { Role } from './store'

export type NavItem = { label: string; href: string; icon: LucideIcon }
export type NavGroup = { title: string; items: NavItem[] }

export const navByRole: Record<Role, NavGroup[]> = {
  child: [
    { title: 'Home', items: [{ label: 'Dashboard', href: '/child', icon: LayoutDashboard }, { label: 'Growth Map', href: '/child/growth', icon: Map }] },
    { title: 'Learn', items: [
      { label: 'Life Skills Academy', href: '/child/academy', icon: GraduationCap },
      { label: 'Digital Safety', href: '/child/safety', icon: ShieldCheck },
      { label: 'Money Centre', href: '/child/finance', icon: PiggyBank },
      { label: 'Wellbeing', href: '/child/wellbeing', icon: HeartPulse },
      { label: 'Careers', href: '/child/careers', icon: Briefcase },
      { label: 'Scenarios', href: '/child/scenarios', icon: GitBranch },
      { label: 'Assessments', href: '/child/assessments', icon: ClipboardCheck },
      { label: 'Library', href: '/child/library', icon: Library },
    ] },
    { title: 'Create & Play', items: [
      { label: 'Talent Centre', href: '/child/talent', icon: Palette },
      { label: 'Challenges', href: '/child/challenges', icon: Trophy },
      { label: 'Games Arcade', href: '/child/games', icon: Gamepad2 },
      { label: 'Rewards', href: '/child/rewards', icon: Gift },
      { label: 'Community', href: '/child/community', icon: Users },
    ] },
    { title: 'Me', items: [
      { label: 'Tasks & Planner', href: '/child/tasks', icon: ListChecks },
      { label: 'Journal', href: '/child/journal', icon: BookHeart },
      { label: 'Find a Mentor', href: '/child/mentors', icon: UserRound },
      { label: 'Notifications', href: '/child/notifications', icon: Bell },
      { label: 'Profile', href: '/child/profile', icon: UserRound },
      { label: 'Family Hub', href: '/child/family', icon: Users },
      { label: 'Mentor Assignments', href: '/child/learning', icon: ListChecks },
      { label: 'Connections', href: '/child/connections', icon: MessageSquare },
      { label: 'Settings', href: '/child/settings', icon: Settings },
    ] },
  ],
  parent: [
    { title: 'Family', items: [
      { label: 'Overview', href: '/parent', icon: Home },
      { label: 'My Children & Progress', href: '/parent/learning', icon: Baby },
      { label: 'Family Hub', href: '/parent/family', icon: Users },
    ] },
    { title: 'Support', items: [
      { label: 'Find a Mentor', href: '/parent/mentors', icon: Handshake },
      { label: 'Connections', href: '/parent/connections', icon: MessageSquare },
      { label: 'Settings', href: '/parent/settings', icon: Settings },
    ] },
  ],
  mentor: [
    { title: 'Mentoring', items: [
      { label: 'Overview', href: '/mentor', icon: LayoutDashboard },
      { label: 'My Mentees', href: '/mentor/mentees', icon: Users },
      { label: 'Learners & Assignments', href: '/mentor/learning', icon: Users },
      { label: 'Sessions', href: '/mentor/sessions', icon: CalendarDays },
      { label: 'Connections', href: '/mentor/connections', icon: MessageSquare },
      { label: 'Resources', href: '/mentor/resources', icon: FolderUp },
    ] },
    { title: 'Account', items: [
      { label: 'Mentor Profile', href: '/mentor/profile', icon: UserRound },
      { label: 'Notifications', href: '/mentor/notifications', icon: Bell },
      { label: 'Settings', href: '/mentor/settings', icon: Settings },
    ] },
  ],
  admin: [
    { title: 'Platform', items: [
      { label: 'Analytics', href: '/admin', icon: BarChart3 },
      { label: 'Accounts & Learning', href: '/admin/learning', icon: UserCog },
      { label: 'Mentor Approval', href: '/admin/mentors', icon: BadgeCheck },
      { label: 'Content', href: '/admin/content', icon: Layers },
      { label: 'Broadcast', href: '/admin/broadcast', icon: Megaphone },
    ] },
    { title: 'Operations', items: [
      { label: 'Reports', href: '/admin/reports', icon: FileText },
      { label: 'Audit Logs', href: '/admin/audit', icon: ScrollText },
      { label: 'Support & Feedback', href: '/admin/support', icon: LifeBuoy },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell }, { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
    ] },
  ],
}

export const roleMeta: Record<Role, { label: string; home: string }> = {
  child: { label: 'Child', home: '/child' },
  parent: { label: 'Parent', home: '/parent' },
  mentor: { label: 'Mentor', home: '/mentor' },
  admin: { label: 'Admin', home: '/admin' },
}

