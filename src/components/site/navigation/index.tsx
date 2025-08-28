import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navigation = () => {
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
          <Link href="/marketplace">
            <li className="cursor-pointer hover:text-primary transition-colors">Marketplace</li>
          </Link>
          <Link href="/site/about">
            <li className="cursor-pointer hover:text-primary transition-colors">About</li>
          </Link>
          <Link href="/site/features">
            <li className="cursor-pointer hover:text-primary transition-colors">Features</li>
          </Link>
          <Link href="/site/documentation">
            <li className="cursor-pointer hover:text-primary transition-colors">Documentation</li>
          </Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href="/agency"
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Get Started
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  )
}

export default Navigation

type Props = {
  user?: null | User
}

const Navigation = ({ user }: Props) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src={'./assets/plura-logo.svg'}
          width={40}
          height={40}
          alt="plur logo"
        />
        <span className="text-xl font-bold"> Plura.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href="#" className="hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Documentation
          </Link>
          <Link href="/marketplace" className="hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Features
          </Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href="/agency"
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  )
}

export default Navigation
