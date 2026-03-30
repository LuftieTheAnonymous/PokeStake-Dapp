function HpBar({ current, max, showNumbers }: { current: number; max: number; showNumbers?: boolean }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? "bg-green-300" : pct > 20 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-pokemon-yellow tracking-wider">HP</span>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      {showNumbers && (
        <p className="text-right text-xs font-mono text-foreground mt-0.5">
          {Math.max(0, current)} / {max}
        </p>
      )}
    </div>
  );
}

export default HpBar;