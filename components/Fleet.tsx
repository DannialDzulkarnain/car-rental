import React, { useState } from 'react';
import { CAR_FLEET } from '../constants';
import { Users, Briefcase, CheckCircle, Phone, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Car } from '../types';

interface FleetProps {
    onSelectCar: (carName: string) => void;
}

const Fleet: React.FC<FleetProps> = ({ onSelectCar }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (car: Car) => {
    setSelectedCar(car);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedCar(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCar) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCar.gallery.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCar) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedCar.gallery.length) % selectedCar.gallery.length);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <section id="fleet" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Our Fleet</h2>
          <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto font-medium">
            Explore our meticulously maintained vehicles. Perfect for business trips, family vacations, or VIP airport pickups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CAR_FLEET.map((car) => (
            <div key={car.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div 
                className="relative h-56 md:h-64 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => openGallery(car)}
              >
                <img 
                  src={car.image} 
                  alt={car.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/95 text-brand-900 px-4 py-2 rounded-full font-bold flex items-center shadow-xl text-sm transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn className="w-4 h-4 mr-2" /> View Details
                    </span>
                </div>
                <div className="absolute top-4 right-4 bg-brand-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                  {car.category}
                </div>
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{car.name}</h3>
                
                <div className="flex space-x-6 mb-6 text-xs md:text-sm text-gray-600 border-b border-gray-50 pb-5">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gold-500" />
                    <span className="font-semibold">{car.seats} Pax</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gold-500" />
                    <span className="font-semibold">Luggage</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                   {car.features.slice(0, 3).map((feature, idx) => (
                       <div key={idx} className="flex items-center text-sm text-gray-600 font-medium">
                           <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                           {feature}
                       </div>
                   ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <button 
                        onClick={() => openGallery(car)}
                        className="flex-1 bg-gray-50 text-brand-900 hover:bg-gray-100 font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-widest"
                    >
                        Photos
                    </button>
                    <button 
                        onClick={() => onSelectCar(car.name)}
                        className="flex-1 bg-brand-900 text-white hover:bg-brand-800 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg"
                    >
                        <Phone className="w-4 h-4" />
                        WhatsApp
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-[70] bg-brand-900/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-fade-in overflow-hidden">
            <button 
                onClick={closeGallery}
                className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full z-[80] shadow-xl"
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] flex flex-col md:flex-row bg-white sm:rounded-3xl overflow-hidden shadow-2xl">
                
                {/* Image Section */}
                <div className="relative flex-grow bg-black flex items-center justify-center md:w-2/3 h-[40vh] sm:h-[50vh] md:h-auto">
                    <img 
                        src={selectedCar.gallery[currentImageIndex]} 
                        alt={selectedCar.name}
                        onError={handleImageError}
                        className="max-h-full max-w-full object-contain"
                    />
                    
                    {selectedCar.gallery.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/10"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/10"
                            >
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        {currentImageIndex + 1} / {selectedCar.gallery.length}
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white p-6 md:p-10 md:w-1/3 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-none">
                    <div className="mb-8">
                        <span className="text-brand-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">{selectedCar.category}</span>
                        <h3 className="text-3xl font-serif font-bold text-brand-900">{selectedCar.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="flex items-center p-3 bg-gray-50 rounded-2xl">
                             <Users className="w-5 h-5 mr-3 text-gold-500" />
                             <span className="font-bold text-gray-700 text-sm">{selectedCar.seats} Pax</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-2xl">
                             <Briefcase className="w-5 h-5 mr-3 text-gold-500" />
                             <span className="font-bold text-gray-700 text-sm">Large Bag</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h4 className="font-black text-brand-900 mb-4 text-[11px] uppercase tracking-[0.15em]">Key Features</h4>
                        <div className="space-y-3">
                             {selectedCar.features.map((feat, i) => (
                                 <div key={i} className="flex items-start text-sm text-gray-600 font-medium">
                                     <CheckCircle className="w-4 h-4 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                                     {feat}
                                 </div>
                             ))}
                        </div>
                    </div>

                    {/* Gallery Thumbnails */}
                    <div className="mb-10">
                        <h4 className="font-black text-brand-900 mb-4 text-[11px] uppercase tracking-[0.15em]">Gallery</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {selectedCar.gallery.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-brand-900 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" onError={handleImageError} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button 
                            onClick={() => {
                                onSelectCar(selectedCar.name);
                                closeGallery();
                            }}
                            className="w-full bg-gold-500 hover:bg-gold-400 text-brand-900 font-black py-4.5 rounded-2xl shadow-xl hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.15em]"
                        >
                            <Phone className="w-5 h-5" />
                            Book Now via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Fleet;