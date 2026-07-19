import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { logout } from '@/app/login/actions'
import { NavLink } from './NavLink'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="sticky top-0 z-10 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              ByteFlow
            </span>
            <div className="flex items-center gap-1">
              <NavLink href="/dashboard/pages">Pages</NavLink>
              <NavLink href="/dashboard/templates">Templates</NavLink>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-200">
              Log out
            </button>
          </form>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
