// src/hooks/useRouteOptions.ts
import { useMemo } from "react";

interface RouteOption {
  id: number;
  type: "Best Route" | "Nearest Terminal" | "Fastest Route";
  optionNumber: number;
  terminal: string;
  stops: string[];
  duration: string;
  distance: string;
  estimatedMoney: string;
  lat?: number;
  lng?: number;
  realDurationMin: number;
  realDistanceKm: number;
  score?: number;
}

interface Terminal {
  name: string;
  location?: { coordinates: [number, number] };
  routes?: string[];
  price?: number | null;
  realDistanceKm?: number;
  realDurationMin?: number;
}
// src/hooks/useRouteOptions.ts
export const useRouteOptions = (terminals: Terminal[]) => {
  return useMemo(() => {
    if (!terminals?.length) return [];

    const options: RouteOption[] = [];

    terminals.forEach((t, index) => {
      // Safely convert to number
      const dist = Number(t.realDistanceKm ?? 0);
      const time = Number(t.realDurationMin ?? 0);
      const cost = Number(t.price ?? 0);

      const score = dist * 0.4 + time * 0.4 + cost * 0.2;

      options.push({
        id: index + 1,
        type:
          index === 0
            ? "Nearest Terminal"
            : index === 1
              ? "Fastest Route"
              : "Best Route",
        optionNumber: index + 1,
        terminal: t.name || "Unknown",
        stops: t.routes || [],
        duration: time ? `${time} min` : "—",
        distance: !isNaN(dist) && dist > 0 ? `${dist.toFixed(1)} km` : "—",
        estimatedMoney:
          !isNaN(cost) && cost > 0 ? `${cost} ETB` : "Est. 20–50 ETB",
        lat: t.location?.coordinates?.[1],
        lng: t.location?.coordinates?.[0],
        realDurationMin: time,
        realDistanceKm: dist,
        score,
      });
    });

    options.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

    if (options.length > 0) options[0].type = "Best Route";
    if (options.length > 1) options[1].type = "Nearest Terminal";
    if (options.length > 2) options[2].type = "Fastest Route";

    return options.slice(0, 3);
  }, [terminals]);
};
