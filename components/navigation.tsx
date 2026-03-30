"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sparkles, Layers, ImageIcon, Sun, Moon, Monitor, ShoppingCart, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { TokenBalance, PokeCoinIcon } from "@/components/token-balance";
import usePokeData from "@/hooks/usePokeData";
import { CustomConnectButton } from "./custom-connect-button";
import { useBattleRoomState } from "@/lib/state-management/useBattleRoomState";

const navItems = [
  { href: "/draw", label: "Draw Cards", icon: Sparkles },
  { href: "/staking", label: "Staking", icon: Layers },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  {href:"/marketplace", label:"MarketPlace", icon: ShoppingCart},
  {href:'/gameplay', label:'Gameplay', icon:Gamepad2}
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const {roomId} = useBattleRoomState();
  const {walletAddress:address, isConnected, snorliesBalance}=usePokeData();

  return (
  <header className={`sticky ${pathname.includes("/gameplay") && roomId && 'hidden'} top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <PokeCoinIcon size={36} className="drop-shadow-lg" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Poke<span className="text-primary">Stake</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
               <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Token Balance */}
          {isConnected &&
          <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-secondary border border-border">
          <TokenBalance amount={snorliesBalance} size="sm" showLabel={true} />
          </div>
          }
          
<CustomConnectButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex w-full items-center justify-around border-t border-border/50 py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
             <span className="hidden sm:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
