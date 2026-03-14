import Link  from "next/link";
import { Store, Plus, Coins, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

const MarketplaceNav = () => {
  const location = usePathname();
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Coins className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            SNORLIE Market
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/marketplace">
            <Button
              variant={location.includes("/marketplace")? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5 text-sm"
            >
              <Store className="h-4 w-4" />
              Browse
            </Button>
          </Link>
          <Link href="/form">
            <Button
              variant={location.includes("/form") ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              List Asset
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDark(!dark)}
            className="ml-1 h-8 w-8 p-0"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default MarketplaceNav;