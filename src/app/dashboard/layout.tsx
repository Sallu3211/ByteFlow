import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { logout } from '@/app/login/actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold">ByteFlow</span>
          <Link href="/dashboard/pages" className="text-sm text-neutral-400 hover:text-neutral-100">
            Pages
          </Link>
          <Link href="/dashboard/templates" className="text-sm text-neutral-400 hover:text-neutral-100">
            Templates
          </Link>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-neutral-400 hover:text-neutral-100">
            Log out
          </button>
        </form>
      </nav>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  )
}
