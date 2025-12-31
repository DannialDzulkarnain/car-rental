import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, Phone, Loader2 } from 'lucide-react';
import { BookingDetails } from '../types';

interface BookingFormProps {
  onSearch: (details: BookingDetails) => void;
}

const POPULAR_LOCATIONS = [
  "KLIA (Kuala Lumpur International Airport)",
  "KLIA 2",
  "Kuala Lumpur City Centre",
  "Genting Highlands",
  "Cameron Highlands",
  "Malacca (Melaka)",
  "Johor Bahru",
  "Ipoh",
  "Penang",
  "Legoland Malaysia",
  "Port Dickson",
  "Subang Airport"
];

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
  const [details, setDetails] = useState<BookingDetails>({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    tripType: 'one-way'
  });

  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'dropoff' | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(POPULAR_LOCATIONS);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = getMinDate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions(POPULAR_LOCATIONS.filter(loc => loc.toLowerCase().includes(query.toLowerCase())));
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=my&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const places = data.map((item: any) => item.display_name);
        const uniquePlaces = Array.from(new Set(places));
        setSuggestions(uniquePlaces);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setSuggestions(POPULAR_LOCATIONS.filter(loc => loc.toLowerCase().includes(query.toLowerCase())));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));

    if (name === 'pickupLocation' || name === 'dropoffLocation') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      debounceTimer.current = setTimeout(() => {
        fetchLocations(value);
      }, 500);
    }
  };

  const handleFocus = (field: 'pickup' | 'dropoff') => {
    setActiveDropdown(field);
    const currentValue = field === 'pickup' ? details.pickupLocation : details.dropoffLocation;
    fetchLocations(currentValue);
  };

  const handleLocationSelect = (field: 'pickupLocation' | 'dropoffLocation', value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(details);
  };

  const isReturn = details.tripType === 'return';
  const colSpanClass = isReturn ? "lg:col-span-3" : "lg:col-span-4";

  return (
    <div className="bg-white rounded-xl shadow-2xl p-5 md:p-8 -mt-16 md:-mt-24 relative z-20 mx-4 md:mx-auto max-w-5xl border-t-4 border-gold-500 font-sans">
      
      {/* Header & Trip Type */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-brand-900 text-white p-2 rounded-lg mr-3 shadow-md hidden sm:block">
              <Car className="w-5 h-5 md:w-6 md:h-6" />
          </span>
          <div>
            <span className="block text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Online Booking</span>
            <span className="text-base md:text-lg">Get Instant Quote</span>
          </div>
        </h3>
        
        {/* Tab Style Trip Type Selector */}
        <div className="flex w-full sm:w-auto bg-gray-100 p-1 rounded-lg shadow-inner">
          <button 
            type="button"
            onClick={() => setDetails(prev => ({...prev, tripType: 'one-way'}))}
            className={`flex-1 sm:flex-none px-4 md:px-6 py-2 text-xs md:text-sm font-bold rounded-md transition-all duration-200 ${
              details.tripType === 'one-way' 
                ? 'bg-white text-brand-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            One Way
          </button>
          <button 
            type="button"
            onClick={() => setDetails(prev => ({...prev, tripType: 'return'}))}
            className={`flex-1 sm:flex-none px-4 md:px-6 py-2 text-xs md:text-sm font-bold rounded-md transition-all duration-200 ${
              details.tripType === 'return' 
                ? 'bg-white text-brand-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Return
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6" ref={dropdownRef}>
        
        {/* Pickup Location */}
        <div className={`${colSpanClass} space-y-1 md:space-y-2 relative`}>
          <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">From</label>
          <div className="relative group">
            <MapPin className="absolute left-3 md:left-4 top-3 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-brand-500 z-10" />
            <input
              type="text"
              name="pickupLocation"
              placeholder="Search location..."
              className="w-full pl-10 md:pl-12 pr-10 py-3 md:py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:ring-0 transition-all outline-none text-sm md:text-base font-medium text-gray-800"
              value={details.pickupLocation}
              onChange={handleChange}
              onFocus={() => handleFocus('pickup')}
              required
              autoComplete="off"
            />
            {isLoadingLocation && activeDropdown === 'pickup' && (
              <Loader2 className="absolute right-3 top-3 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-brand-500 animate-spin z-10" />
            )}
          </div>
          {activeDropdown === 'pickup' && suggestions.length > 0 && (
             <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-48 md:max-h-60 overflow-y-auto">
               {suggestions.map((loc, idx) => (
                 <button
                   key={idx}
                   type="button"
                   className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 hover:bg-brand-50 text-xs md:text-sm font-medium text-gray-700 transition-colors flex items-center border-b border-gray-50 last:border-0"
                   onClick={() => handleLocationSelect('pickupLocation', loc)}
                 >
                   <MapPin className="w-3.5 h-3.5 mr-2 md:mr-3 text-gray-400 flex-shrink-0" />
                   <span className="truncate">{loc}</span>
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* Dropoff Location */}
        <div className={`${colSpanClass} space-y-1 md:space-y-2 relative`}>
          <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">To</label>
          <div className="relative group">
            <MapPin className="absolute left-3 md:left-4 top-3 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
            <input
              type="text"
              name="dropoffLocation"
              placeholder="Search destination..."
              className="w-full pl-10 md:pl-12 pr-10 py-3 md:py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:ring-0 transition-all outline-none text-sm md:text-base font-medium text-gray-800"
              value={details.dropoffLocation}
              onChange={handleChange}
              onFocus={() => handleFocus('dropoff')}
              required
              autoComplete="off"
            />
             {isLoadingLocation && activeDropdown === 'dropoff' && (
              <Loader2 className="absolute right-3 top-3 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-brand-500 animate-spin z-10" />
            )}
          </div>
          {activeDropdown === 'dropoff' && suggestions.length > 0 && (
             <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-48 md:max-h-60 overflow-y-auto">
               {suggestions.map((loc, idx) => (
                 <button
                   key={idx}
                   type="button"
                   className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 hover:bg-brand-50 text-xs md:text-sm font-medium text-gray-700 transition-colors flex items-center border-b border-gray-50 last:border-0"
                   onClick={() => handleLocationSelect('dropoffLocation', loc)}
                 >
                   <MapPin className="w-3.5 h-3.5 mr-2 md:mr-3 text-gray-400 flex-shrink-0" />
                   <span className="truncate">{loc}</span>
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* Pickup Date & Time */}
        <div className={`${colSpanClass} space-y-1 md:space-y-2`}>
          <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pickup Date</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="pickupDate"
                min={today}
                className="w-full pl-9 md:pl-10 pr-2 md:pr-3 py-3 md:py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:ring-0 outline-none text-sm md:text-base font-medium text-gray-800 appearance-none"
                value={details.pickupDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative w-28 md:w-32">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
               <input
                type="time"
                name="pickupTime"
                className="w-full pl-9 md:pl-10 pr-2 py-3 md:py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:ring-0 outline-none text-sm md:text-base font-medium text-gray-800 appearance-none"
                value={details.pickupTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Return Date & Time */}
        {isReturn && (
            <div className={`${colSpanClass} space-y-1 md:space-y-2 animate-fade-in`}>
            <label className="text-[10px] md:text-xs font-bold text-brand-600 uppercase tracking-wider ml-1">Return Date</label>
            <div className="flex gap-2">
                <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-brand-500" />
                </div>
                <input
                    type="date"
                    name="returnDate"
                    min={details.pickupDate || today}
                    className="w-full pl-9 md:pl-10 pr-2 md:pr-3 py-3 md:py-3.5 bg-brand-50 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:ring-0 outline-none text-sm md:text-base font-medium text-gray-800 appearance-none"
                    value={details.returnDate}
                    onChange={handleChange}
                    required={isReturn}
                />
                </div>
                <div className="relative w-28 md:w-32">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-brand-500" />
                </div>
                <input
                    type="time"
                    name="returnTime"
                    className="w-full pl-9 md:pl-10 pr-2 py-3 md:py-3.5 bg-brand-50 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:ring-0 outline-none text-sm md:text-base font-medium text-gray-800 appearance-none"
                    value={details.returnTime}
                    onChange={handleChange}
                    required={isReturn}
                />
                </div>
            </div>
            </div>
        )}

        <div className="lg:col-span-12 mt-2 md:mt-4">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 md:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base md:text-lg"
          >
            <Phone className="w-5 h-5 md:w-6 md:h-6" />
            <span>Request Quote on WhatsApp</span>
          </button>
        </div>
      </form>
      
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] md:text-sm text-gray-500">
         <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>Instant Quote</span>
         <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>Professional Drivers</span>
         <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>24/7 Service</span>
      </div>
    </div>
  );
};

export default BookingForm;