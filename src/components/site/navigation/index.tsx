import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  user?: null | User
}

const Navigation = ({ user }: Props) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src="/assets/plura-logo.svg"
          width={40}
          height={40}
          alt="plura logo"
        />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href="/marketplace" className="hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link href="/site/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/site/features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/site/documentation" className="hover:text-primary transition-colors">
            Documentation
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Pricing
          </Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center relative">
        <Link
          href="/agency"
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 relative z-[10] cursor-pointer"
        >
          {user ? 'Dashboard' : 'Get Started'}
        </Link>
        <div className="relative z-[100]" style={{ position: 'relative', zIndex: 100 }}>
          <UserButton />
        </div>
        <div className="relative z-[50]">
          <ModeToggle />
        </div>
      </aside>
    </div>
  )
}

export default Navigation
