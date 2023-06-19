import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
   keywords: null,
    result: [],
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

// CUSTOM HOOK
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
