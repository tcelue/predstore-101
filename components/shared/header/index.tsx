'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavItems as navItems } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    
    await signOut(auth)
    setUser(null)
  }

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={50} height={31} />
          <span className="font-bold text-lg">。。</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, idx) =>
            item.subItems ? (
              <DropdownMenu key={idx}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2 hover:bg-muted">
                    {item.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.subItems.map((sub, subIdx) => (
                    <DropdownMenuItem key={subIdx} asChild>
                      <Link href={sub.href}>{sub.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link key={idx} href={item.href} className="text-sm hover:underline">
                {item.label}
              </Link>
            )
          )}

          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map((item, idx) =>
            item.subItems ? (
              <div key={idx} className="space-y-1">
                <div className="font-medium">{item.label}</div>
                <div className="ml-3 space-y-1">
                  {item.subItems.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      href={sub.href}
                      className="block text-sm hover:underline"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={idx}
                href={item.href}
                className="block text-sm hover:underline"
              >
                {item.label}
              </Link>
            )
          )}

          <div className="flex space-x-2 pt-2">
            {!user ? (
              <>
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            ) : (
              <Button className="w-full" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
