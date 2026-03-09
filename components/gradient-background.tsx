"use client";

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Floating gradient orbs */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 dark:opacity-20 animate-blob"
        style={{ 
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
          top: '10%',
          left: '15%',
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-25 dark:opacity-15 animate-blob animation-delay-2000"
        style={{ 
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          top: '50%',
          right: '10%',
        }}
      />
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[110px] opacity-25 dark:opacity-15 animate-blob animation-delay-4000"
        style={{ 
          background: 'linear-gradient(135deg, #22c55e, #84cc16)',
          bottom: '10%',
          left: '25%',
        }}
      />
      <div 
        className="absolute w-[350px] h-[350px] rounded-full blur-[90px] opacity-30 dark:opacity-20 animate-blob animation-delay-3000"
        style={{ 
          background: 'linear-gradient(135deg, #f59e0b, #eab308)',
          top: '30%',
          right: '30%',
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 dark:opacity-10 animate-blob animation-delay-5000"
        style={{ 
          background: 'linear-gradient(135deg, #ef4444, #ec4899)',
          bottom: '30%',
          right: '20%',
        }}
      />
      
      {/* Subtle noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} 
      />
    </div>
  );
}
