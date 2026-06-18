"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/login/actions";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  Search,
  GitCompare,
  Sparkles,
  Menu,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/builder", label: "Builder", icon: FileText },
  { href: "/analyzer", label: "ATS Analyzer", icon: Search },
  { href: "/matcher", label: "JD Matcher", icon: GitCompare },
  { href: "/optimizer", label: "Optimizer", icon: Sparkles },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
            Drafted
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-lg px-4 h-8 text-[0.8rem] font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
                <Avatar size="default" className="border border-white/10 hover:border-cyan-500 transition-colors">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-semibold">
                    {user.email?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 bg-slate-900 border border-white/10 text-white">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs leading-none text-muted-foreground">Logged in as</p>
                      <p className="text-sm font-medium leading-none truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="text-red-400 hover:text-red-300 focus:bg-red-950/20 cursor-pointer focus:text-red-300"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 h-8 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-6 pb-8 bg-slate-950 border-l border-white/10 text-white">
            <div className="flex flex-col gap-2 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`inline-flex items-center w-full justify-start gap-3 rounded-lg px-2.5 h-8 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-auto border-t border-white/10 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-2.5">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-semibold">
                        {user.email?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-muted-foreground leading-none">Logged in as</span>
                      <span className="text-sm font-medium text-white truncate max-w-[180px]">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="inline-flex items-center w-full justify-start rounded-lg px-2.5 h-8 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center w-full justify-center rounded-lg bg-blue-600 px-4 h-9 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
