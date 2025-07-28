'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { BarChart3Icon, LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useState } from 'react';
import { routes } from '@/routes';

export const Header = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={routes.home} className="text-xl font-bold hover:opacity-80 transition-opacity">
          CorgiLink
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <ThemeToggle />

          {isSignedIn ? (
            <>
              <Button variant={'ghost'} size={'sm'} asChild>
                <Link href={routes.dashboard.root} className="flex items-center gap-2">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>

              <Button variant={'ghost'} size={'sm'} asChild>
                <Link href={routes.dashboard.stats} className="flex items-center gap-2">
                  <BarChart3Icon className="size-4" />
                  My Stats
                </Link>
              </Button>

              <Button variant={'ghost'} size={'sm'} asChild>
                <Link href={routes.biolink.root} className="flex items-center gap-2">
                  <User className="size-4" />
                  BioLink
                </Link>
              </Button>

              <UserButton />
            </>
          ) : (
            <>
              <Button variant={'ghost'} size={'sm'} asChild>
                <Link href={routes.stats} className="flex items-center gap-2">
                  <BarChart3Icon className="size-4" />
                  Stats
                </Link>
              </Button>
              <SignInButton>
                <Button variant={'ghost'} size={'sm'}>
                  Login
                </Button>
              </SignInButton>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="text-left">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-2 mt-6">
                <Button variant={'ghost'} size={'sm'} asChild onClick={closeSheet}>
                  <Link
                    href={routes.dashboard.stats}
                    className="flex items-center gap-3 justify-start w-full h-12"
                  >
                    <BarChart3Icon className="size-4" />
                    Stats
                  </Link>
                </Button>

                {isSignedIn ? (
                  <>
                    <Button variant={'ghost'} size={'sm'} asChild onClick={closeSheet}>
                      <Link
                        href={routes.dashboard.root}
                        className="flex items-center gap-3 justify-start w-full h-12"
                      >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </Link>
                    </Button>

                    <Button variant={'ghost'} size={'sm'} asChild onClick={closeSheet}>
                      <Link
                        href={routes.dashboard.stats}
                        className="flex items-center gap-3 justify-start w-full h-12"
                      >
                        <BarChart3Icon className="size-4" />
                        My Stats
                      </Link>
                    </Button>

                    <Button variant={'ghost'} size={'sm'} asChild onClick={closeSheet}>
                      <Link
                        href={routes.biolink.root}
                        className="flex items-center gap-3 justify-start w-full h-12"
                      >
                        <User className="size-4" />
                        BioLink
                      </Link>
                    </Button>

                    <SignOutButton signOutOptions={{ redirectUrl: routes.home }}>
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="flex items-center gap-3 justify-start w-full h-12"
                        onClick={closeSheet}
                      >
                        <LogOut className="size-4" />
                        Logout
                      </Button>
                    </SignOutButton>
                  </>
                ) : (
                  <>
                    <Button variant={'ghost'} size={'sm'} asChild>
                      <Link href={routes.stats} className="flex items-center gap-2">
                        <BarChart3Icon className="size-4" />
                        Stats
                      </Link>
                    </Button>
                    <SignInButton>
                      <Button type="button">Login</Button>
                    </SignInButton>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
