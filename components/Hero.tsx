import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1622185135505-2d79504399d9?auto=format&fit=crop&q=80&w=2000",
];

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home" className="relative min-h-[85vh] md:h-[90vh] w-full overflow-hidden flex flex-col">
      {/* Background Slider */}
      {BACKGROUND_IMAGES.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={img} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/40 to-brand-900/80"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-24 md:pt-32 pb-32 md:pb-40">
        <div className="max-w-3xl text-white">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 animate-fade-in">
             <span className="px-3 py-1 md:px-4 md:py-1.5 bg-green-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded flex items-center shadow-lg">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse mr-2"></div>
                24/7 Available
             </span>
             <span className="px-3 py-1 md:px-4 md:py-1.5 bg-gold-500 text-brand-900 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded shadow-lg">
                Official AJ Taxi KL
             </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight md:leading-[1.1] mb-4 md:mb-6 animate-slide-up">
            Reliable Private <br/>
            <span className="text-gold-500">Chauffeur</span> & <br/>
            <span className="relative">
                Airport Transfer
                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-gold-500/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-200 mb-8 md:mb-10 leading-relaxed max-w-2xl animate-slide-up animate-delay-100">
            Professional <b>Kereta Sewa</b> and private transfer services across Malaysia. Comfortable, safe, and punctual rides to KLIA, Genting, and beyond.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10 max-w-lg animate-slide-up animate-delay-200">
             {[
                "Punctual & Reliable", 
                "Well Maintained Fleet", 
                "Professional Drivers", 
                "No Hidden Fees"
             ].map((item, i) => (
                <div key={i} className="flex items-center text-gray-100 font-medium text-sm md:text-base">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gold-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                </div>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 animate-slide-up animate-delay-300">
            <a 
              href="https://wa.me/60182335796" 
              className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-gold-500 text-brand-900 font-black rounded-lg hover:bg-gold-400 transition-all shadow-[0_10px_20px_-5px_rgba(254,194,0,0.3)] hover:-translate-y-1 flex items-center justify-center"
            >
              Book via WhatsApp
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#fleet" 
              className="w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-lg hover:bg-white/20 transition-all hover:-translate-y-1 text-center"
            >
              Our Fleet
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Hint */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center animate-bounce text-white/50">
          <span className="text-[10px] uppercase font-bold tracking-widest mb-2">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;