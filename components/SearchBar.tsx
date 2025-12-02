import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Globe, Clock } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

interface CitySuggestion {
  id: number;
  name: string;
  country: string;
  admin1?: string; // State/Province
  latitude: number;
  longitude: number;
}

// Popular cities from around the world for quick access
const POPULAR_CITIES = [
  { name: "New York", country: "United States" },
  { name: "London", country: "United Kingdom" },
  { name: "Paris", country: "France" },
  { name: "Tokyo", country: "Japan" },
  { name: "Dubai", country: "UAE" },
  { name: "Singapore", country: "Singapore" },
  { name: "Sydney", country: "Australia" },
  { name: "Mumbai", country: "India" },
  { name: "Toronto", country: "Canada" },
  { name: "Berlin", country: "Germany" },
  { name: "Seoul", country: "South Korea" },
  { name: "Bangkok", country: "Thailand" },
  { name: "Istanbul", country: "Turkey" },
  { name: "Moscow", country: "Russia" },
  { name: "São Paulo", country: "Brazil" },
  { name: "Cairo", country: "Egypt" },
  { name: "Lagos", country: "Nigeria" },
  { name: "Jakarta", country: "Indonesia" },
  { name: "Shanghai", country: "China" },
  { name: "Mexico City", country: "Mexico" },
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('climatix_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {}
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (city: string) => {
    const updated = [city, ...recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('climatix_recent_searches', JSON.stringify(updated));
  };

  // Fetch city suggestions from multiple sources for complete worldwide coverage
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      // Try Open-Meteo first (faster)
      const openMeteoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      const openMeteoData = await openMeteoResponse.json();
      
      let results: CitySuggestion[] = [];
      
      if (openMeteoData.results && openMeteoData.results.length > 0) {
        results = openMeteoData.results.map((r: any) => ({
          id: r.id,
          name: r.name,
          country: r.country || '',
          admin1: r.admin1,
          latitude: r.latitude,
          longitude: r.longitude
        }));
      }
      
      // Also search Nominatim for more comprehensive results (includes small towns/villages)
      try {
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
          { headers: { 'User-Agent': 'Climatix Weather App' } }
        );
        const nominatimData = await nominatimResponse.json();
        
        if (nominatimData && nominatimData.length > 0) {
          const nominatimResults = nominatimData.map((r: any, index: number) => {
            const address = r.address || {};
            return {
              id: parseInt(r.place_id) || (100000 + index),
              name: address.city || address.town || address.village || address.county || address.state_district || r.name || query,
              country: address.country || '',
              admin1: address.state || address.region || '',
              latitude: parseFloat(r.lat),
              longitude: parseFloat(r.lon)
            };
          });
          
          // Merge results, avoiding duplicates
          nominatimResults.forEach((nr: CitySuggestion) => {
            const exists = results.some(r => 
              r.name.toLowerCase() === nr.name.toLowerCase() && 
              r.country.toLowerCase() === nr.country.toLowerCase()
            );
            if (!exists && results.length < 8) {
              results.push(nr);
            }
          });
        }
      } catch (e) {
        console.log("Nominatim search failed, using Open-Meteo results only");
      }
      
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
    setIsSearching(false);
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (input.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(input.trim());
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && trimmedInput !== lastSubmitted && !isLoading) {
      onSearch(trimmedInput);
      setLastSubmitted(trimmedInput);
      saveRecentSearch(trimmedInput);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    const cityName = suggestion.admin1 
      ? `${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setInput(cityName);
    onSearch(cityName);
    setLastSubmitted(cityName);
    saveRecentSearch(cityName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handlePopularCityClick = (city: { name: string; country: string }) => {
    const cityName = `${city.name}, ${city.country}`;
    setInput(cityName);
    onSearch(cityName);
    setLastSubmitted(cityName);
    saveRecentSearch(cityName);
    setShowSuggestions(false);
  };

  const handleRecentClick = (city: string) => {
    setInput(city);
    onSearch(city);
    setLastSubmitted(city);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInput('');
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          onSearch(loc);
          setLastSubmitted(loc);
          setShowSuggestions(false);
        },
        () => alert("Location access denied. Please enable location permissions.")
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && suggestions[selectedIndex]) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <div className="w-full relative mb-6">
      <form onSubmit={handleSubmit} className="relative flex items-center" role="search">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors z-10" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search any city worldwide..."
            className="w-full py-3 pl-12 pr-10 bg-white dark:bg-slate-800 rounded-2xl text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 shadow-sm transition-all border border-transparent dark:border-slate-700"
            disabled={isLoading}
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {isLoading || isSearching ? (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full"></div>
            ) : input ? (
              <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1">
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>
        <button 
          type="button" 
          onClick={handleLocationClick} 
          className="ml-3 p-3 bg-white dark:bg-slate-800 rounded-2xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          title="Use my location"
        >
          <MapPin size={20} />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-12 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
        >
          {/* Search Results */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Search size={12} />
                Search Results
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{suggestion.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.admin1 ? `${suggestion.admin1}, ` : ''}{suggestion.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && input.length < 2 && (
            <div className="p-2 border-t border-gray-100 dark:border-slate-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {recentSearches.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(city)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Cities */}
          {input.length < 2 && (
            <div className="p-2 border-t border-gray-100 dark:border-slate-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Globe size={12} />
                Popular Cities Worldwide
              </div>
              <div className="grid grid-cols-2 gap-1 px-1">
                {POPULAR_CITIES.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularCityClick(city)}
                    className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-700 dark:text-gray-200">{city.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{city.country}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {input.length >= 2 && suggestions.length === 0 && !isSearching && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Globe size={32} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">No cities found</p>
              <p className="text-sm">Try a different spelling or search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
