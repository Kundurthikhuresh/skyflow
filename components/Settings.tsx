import React, { useState, useEffect } from 'react';
import { Thermometer, MapPin, Search, Check, Globe, Navigation } from 'lucide-react';
import { Unit } from '../types';
import BackgroundEffects from './BackgroundEffects';

interface SettingsProps {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  isDark: boolean;
}

// Popular cities for quick selection (including many Indian cities)
const POPULAR_CITIES = [
  // Major Indian Cities
  "Mumbai, India",
  "Delhi, India",
  "Bangalore, India",
  "Chennai, India",
  "Hyderabad, India",
  "Kolkata, India",
  "Pune, India",
  "Ahmedabad, India",
  // Andhra Pradesh & Telangana
  "Visakhapatnam, India",
  "Vijayawada, India",
  "Guntur, India",
  "Nellore, India",
  "Tirupati, India",
  "Kakinada, India",
  "Rajahmundry, India",
  "Mangalagiri, India",
  "Ongole, India",
  // International Cities
  "New York, USA",
  "London, UK",
  "Tokyo, Japan",
  "Dubai, UAE",
  "Singapore",
  "Sydney, Australia",
];

const Settings: React.FC<SettingsProps> = ({ unit, setUnit, isDark }) => {
  const [defaultCity, setDefaultCity] = useState<string>('');
  const [customCity, setCustomCity] = useState('');
  const [useLocation, setUseLocation] = useState(true);
  const [saved, setSaved] = useState(false);

  // Load saved settings
  useEffect(() => {
    const savedCity = localStorage.getItem('climatix_default_city');
    const savedUseLocation = localStorage.getItem('climatix_use_location');
    
    if (savedCity) {
      setDefaultCity(savedCity);
      setCustomCity(savedCity);
    }
    if (savedUseLocation !== null) {
      setUseLocation(savedUseLocation === 'true');
    }
  }, []);

  const handleSaveCity = (city: string) => {
    setDefaultCity(city);
    setCustomCity(city);
    localStorage.setItem('climatix_default_city', city);
    localStorage.setItem('climatix_use_location', 'false');
    setUseLocation(false);
    showSavedMessage();
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      handleSaveCity(customCity.trim());
    }
  };

  const handleUseLocation = () => {
    setUseLocation(true);
    setDefaultCity('');
    localStorage.setItem('climatix_use_location', 'true');
    localStorage.removeItem('climatix_default_city');
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="relative flex-1 h-full overflow-hidden animate-fade-in">
      <BackgroundEffects isNight={isDark} />

      <div className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col overflow-y-auto scrollbar-hide">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 drop-shadow-sm">Settings</h2>
        
        {/* Saved notification */}
        {saved && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in z-50">
            <Check size={18} />
            Settings saved!
          </div>
        )}

        <div className="space-y-6">
          {/* Default City Setting */}
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-[2rem] p-6 shadow-lg border border-white/40 dark:border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-500" />
              Default City
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set a default city to load weather automatically when you open the app.
            </p>

            {/* Use My Location Option */}
            <button
              onClick={handleUseLocation}
              className={`w-full mb-4 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                useLocation
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                useLocation ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
              }`}>
                <Navigation size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800 dark:text-white">Use My Location</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Automatically detect your location</div>
              </div>
              {useLocation && <Check className="text-blue-500" size={20} />}
            </button>

            {/* Custom City Input */}
            <form onSubmit={handleCustomCitySubmit} className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Or enter a specific city:
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Set
                </button>
              </div>
            </form>

            {/* Current Default City Display */}
            {defaultCity && !useLocation && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 mb-4">
                <Check className="text-green-500" size={18} />
                <span className="text-green-700 dark:text-green-400 font-medium">
                  Default city: {defaultCity}
                </span>
              </div>
            )}

            {/* Quick Select Popular Cities */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Globe size={14} />
                Quick Select:
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSaveCity(city)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      defaultCity === city
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Units Setting */}
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-[2rem] p-6 shadow-lg border border-white/40 dark:border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Thermometer size={20} className="text-orange-500" />
              Units
            </h3>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-white/30 dark:border-slate-700">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Temperature & Speed</span>
              <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-slate-700">
                <button 
                  onClick={() => setUnit('metric')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    unit === 'metric' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Metric (°C)
                </button>
                <button 
                  onClick={() => setUnit('imperial')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    unit === 'imperial' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Imperial (°F)
                </button>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-[2rem] p-6 shadow-lg border border-white/40 dark:border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">About Climatix</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>🌤️ <strong>Climatix</strong> - Your Personal Weather Assistant</p>
              <p>• Real-time weather data from Open-Meteo API</p>
              <p>• Search any city worldwide</p>
              <p>• 7-day forecasts</p>
              <p>• AI-powered weather assistant</p>
              <p className="text-xs mt-4 opacity-60">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
