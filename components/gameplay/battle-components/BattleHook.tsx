import '@/components/components-styles.css';

type Props = {
    countdown: number | null;
    showFightIntro: boolean;
}



function BattleHook({countdown, showFightIntro}: Props) {
  return (
  <>
   {(countdown !== null || showFightIntro) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div className="relative flex flex-col items-center gap-6">
            {countdown !== null && (
              <>
                <p className="text-muted-foreground text-lg font-medium tracking-wider uppercase animate-pulse">Get Ready</p>
                <div
                  key={countdown}
                  className="text-[120px] font-black leading-none animate-countdown"
                  style={{ color: `hsl(var(--pokemon-yellow))` }}
                >
                  {countdown}
                </div>
                <div className="flex gap-2 mt-4">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div
                      key={n}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        n > countdown ? "bg-primary scale-100" : "bg-muted scale-75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {showFightIntro && (
              <div className="flex flex-col items-center gap-6 animate-fight-intro">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_hsl(var(--primary)/0.6)]">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                    <path d="M 2 50 A 48 48 0 0 1 98 50" fill="hsl(var(--pokemon-red))" />
                    <path d="M 2 50 A 48 48 0 0 0 98 50" fill="hsl(var(--foreground))" fillOpacity="0.9" />
                    <rect x="2" y="48" width="96" height="4" fill="hsl(var(--border))" />
                    <circle cx="50" cy="50" r="14" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="3" />
                    <circle cx="50" cy="50" r="8" fill="hsl(var(--foreground))" />
                  </svg>
                </div>
                <h1
                  className="text-5xl sm:text-6xl font-black uppercase tracking-widest"
                  style={{ color: "hsl(var(--pokemon-yellow))", textShadow: "0 0 30px hsl(var(--pokemon-yellow) / 0.5)" }}
                >
                  FIGHT!
                </h1>
              </div>
            )}
          </div>
        </div>
      )}
  </>
  )
}

export default BattleHook