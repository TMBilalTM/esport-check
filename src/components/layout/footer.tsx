'use client';

import Link from 'next/link';
import { Gamepad2, Github, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  product: [
    { label: 'Features', href: '#' },
    { label: 'Matches', href: '/matches' },
    { label: 'Teams', href: '/teams' },
    { label: 'Tournaments', href: '/tournaments' },
  ],
  platforms: [
    { label: 'VLR.gg', href: '#' },
    { label: 'HLTV', href: '#' },
    { label: 'Liquipedia', href: '#' },
    { label: 'FACEIT', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-semibold tracking-tight">
                  ESPORTS<span className="text-muted-foreground">.gg</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Track your favorite esports teams and matches in real-time across all major platforms.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium">Platforms</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.platforms.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ESPORTS.gg. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
