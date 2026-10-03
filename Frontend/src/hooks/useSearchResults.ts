import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SearchData {
  userLocation: { lat: number; lng: number; fromName?: string };
  terminals: any[];
  destination: string;
  fromName?: string;
}

export const useSearchResults = () => {
  const location = useLocation();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const state = location.state as
        | {
            from?: string;
            to: string;
            userLocation?: { lat: number; lng: number };
            maxDistance?: number; 
          }
        | undefined;

      if (state?.to) {
        setLoading(true);
        try {
          const payload: any = {
            destination: state.to.trim(),
            maxDistance: state.maxDistance ?? 7000, 
          };

          if (state.from?.trim()) {
            payload.from = state.from.trim();
          } else if (state.userLocation) {
            payload.latitude = state.userLocation.lat;
            payload.longitude = state.userLocation.lng;
          } else {
            throw new Error("No starting location provided");
          }

          const token = localStorage.getItem("token");

          const res = await fetch("http://localhost:5000/api/terminals/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Search failed");
          }

          const data = await res.json();

          const newData: SearchData = {
            terminals: data.results || [],
            userLocation: data.resolvedLocation ||
              state.userLocation || { lat: 9.03, lng: 38.74 },
            destination: payload.destination,
            fromName:
              data.resolvedLocation?.fromName ||
              state.from ||
              "Current Location",
          };

          setSearchData(newData);
          localStorage.setItem("searchData", JSON.stringify(newData));
        } catch (err: any) {
          setError(err.message || "Failed to fetch results");
        } finally {
          setLoading(false);
        }
        return;
      }

      // Fallback to localStorage (refresh / back button)
      const stored = localStorage.getItem("searchData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSearchData(parsed);
        } catch {
          setError("Invalid stored data");
        }
      } else {
        setError("No search data found. Please search again.");
      }

      setLoading(false);
    };

    loadData();
  }, [location.state]);

  return { searchData, loading, error };
};