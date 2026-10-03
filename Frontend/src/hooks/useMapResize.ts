import { useEffect, useRef } from 'react';

export function useMapResize(mapRef: React.RefObject<L.Map>) {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Force invalidate size on mount
    mapRef.current.invalidateSize();

    // Watch for parent size changes
    const container = mapRef.current.getContainer();
    resizeObserverRef.current = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    resizeObserverRef.current.observe(container);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [mapRef]);
}