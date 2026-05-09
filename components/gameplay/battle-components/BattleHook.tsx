type Props = {
    countdown: number | null;
    showFightIntro: boolean;
}



function BattleHook({countdown, showFightIntro}: Props) {
  return (
     <>
  {(countdown !== null || !showFightIntro) && (
         <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Semi-transparent backdrop blur — lets the battlefield show through */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div className="relative flex flex-col items-center gap-6">

            {/* Phase 1: Countdown numbers (5, 4, 3, 2, 1) */}
   
   
                <p className="text-muted-foreground text-lg font-medium tracking-wider uppercase animate-pulse">Get Ready</p>
                {/* key={countdown} forces React to remount this div each tick,
                    which re-triggers the .animate-countdown CSS animation */}
                <div
                  key={countdown}
                  className="text-[120px] text-(--pokemon-yellow) font-black leading-none animate-countdown"
                >
                  {countdown}
                </div>
                {/* Progress dots — filled dots for elapsed ticks */}
                <div className="flex gap-2 mt-4">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div
                      key={n}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        countdown && n > countdown ? "bg-primary scale-100" : "bg-muted scale-75"
                      }`}
                    />
                  ))}
                </div>

       

            {/* Phase 2: "FIGHT!" intro with Pokéball SVG */}
     {showFightIntro &&
            <div className="flex flex-col items-center gap-6 animate-fight-intro">
           
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_oklch(0.18 0.01 250)/0.6)]">
                    <circle cx="50" cy="50" r="48" fill="oklch(0.18 0.01 250)" stroke="oklch(0.18 0.01 250)" strokeWidth="3" />
                    <path d="M 2 50 A 48 48 0 0 1 98 50" fill="oklch(0.58 0.24 28)" />
                    <path d="M 2 50 A 48 48 0 0 0 98 50" fill="oklch(0.98 0.005 90)" fillOpacity="0.9" />
                    <rect x="2" y="48" width="96" height="4" fill="oklch(0.18 0.01 250)" />
                    <circle cx="50" cy="50" r="14" fill="oklch(0.98 0.005 90)" stroke="oklch(0.18 0.01 250)" strokeWidth="3" />
                    <circle cx="50" cy="50" r="8" fill="oklch(0.18 0.01 250)" />
                  </svg>
                </div>

                <h1
                  className="text-5xl sm:text-6xl font-black uppercase tracking-widest text-(--pokemon-yellow)"
                  style={{ textShadow: "0 0 30px oklch(0.88 0.16 90) / 0.5)" }}
                >
                  FIGHT!
                </h1>
              </div>
     }
       
    
          </div>
        </div>

      )}
  </>
  );
}


export default BattleHook