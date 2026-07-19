'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname?.startsWith(href)

  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white'
          : 'rounded-md px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-100'
      }
    >
      {children}
    </Link>
  )
}
