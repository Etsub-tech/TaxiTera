// src/hooks/useSuggestions.ts
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";

export const useSuggestions = () => {
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (query: string, type: "from" | "to") => {
      if (!query.trim() || query.length < 2) {
        type === "from" ? setFromSuggestions([]) : setToSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("http://localhost:5000/api/terminals");
        if (!res.ok) throw new Error("Failed to fetch terminals");

        const data = await res.json();
        const names = data.map((t: any) => t.name);

        const matches = names
          .filter((name: string) =>
            name.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 8);

        type === "from"
          ? setFromSuggestions(matches)
          : setToSuggestions(matches);
      } catch (err) {
        console.error("Suggestions error:", err);
        type === "from" ? setFromSuggestions([]) : setToSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350),
    [],
  );

  const clearSuggestions = useCallback((type: "from" | "to") => {
    type === "from" ? setFromSuggestions([]) : setToSuggestions([]);
  }, []);

  return {
    fromSuggestions,
    toSuggestions,
    fetchSuggestions,
    clearSuggestions, 
    loadingSuggestions: loading,
  };
};
