import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import API from "../../services/auth.services";

const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // 🔥 SEARCH FUNCTION (API CALL)
  const searchIssues = async (q) => {
    const res = await API.get(`/issues/search?q=${q}`);
    return res.data;
  };

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const data = await searchIssues(query);
        setResults(data || []);
      } catch (err) {
        console.log(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-[40%] relative">
      {/* INPUT */}
      <Search className="absolute left-3 top-2 text-gray-400" />

      <input
        className="w-full pl-10 p-2 bg-slate-700 rounded outline-none"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* DROPDOWN */}
      {query && (
        <div className="absolute top-12 left-0 w-full bg-slate-800 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-2 text-gray-400 text-sm">No results</p>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                className="p-2 hover:bg-slate-700 cursor-pointer"
              >
                <p className="text-sm">{item.title}</p>
                <p className="text-xs text-gray-400">{item.project?.name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
