import { useEffect, useEffectEvent } from "react";

export function useInterval(callback:(res?:any)=>void, delay:number) {
    const onTick = useEffectEvent(callback);
  
    useEffect(() => {
      if (delay === null) {
        return;
      }
      const id = setInterval(() => {
        onTick();
      }, delay);
      return () => clearInterval(id);
    }, [delay]);
  }