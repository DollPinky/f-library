import { useEffect, useState } from "react";

export default function useDebounce(search: string, delay: number) {
  const [debounceSearch, setDebounceSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, delay);
    return () => clearTimeout(timer);
  }, [search, delay]);
  return debounceSearch;
}
