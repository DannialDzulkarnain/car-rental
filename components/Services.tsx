import React from 'react';
import { Plane, Car, Map, Briefcase, Mountain, Users, Building2, MapPin } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Plane className="w-8 h-8 text-brand-500" />,
      title: "Airport TRAVTHRU & Transfer Service",
      description: "24/7 KLIA and KLIA2 airport transfer. Professional teksi servis with flight tracking. Reliable alternative to Grab with fixed rates and no surge pricing."
    },
    {
      icon: <Car className="w-8 h-8 text-brand-500" />,
      title: "Limo, Wedding & Corporate",
      description: "Premium limousine service for corporate events, weddings, and VIP transport. Toyota Alphard/Vellfire with professional chauffeur for your special day."
    },
    {
      icon: <Users className="w-8 h-8 text-brand-500" />,
      title: "Van Service & Group Transport",
      description: "Spacious van rental with driver for groups and families. 7-seater MPV service perfect for airport transfers, corporate events, and outstation trips."
    },
    {
      icon: <Mountain className="w-8 h-8 text-brand-500" />,
      title: "Genting Highlands & Cameron Transfer",
      description: "Direct transfer to Resorts World Genting or Cameron Highlands. Comfortable journey up the mountains with experienced drivers."
    },
    {
      icon: <Map className="w-8 h-8 text-brand-500" />,
      title: "KL Transport & Hourly Chauffeur",
      description: "Flexible hourly chauffeur service for city tours, meetings, or shopping. Explore KLCC, Batu Caves, and more with your own private driver."
    },
    {
      icon: <MapPin className="w-8 h-8 text-brand-500" />,
      title: "Outstation & Long Distance",
      description: "Long-distance car rental with driver to Penang, Singapore, Johor Bahru, Ipoh, Melaka. Professional intercity transport service."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4">Our Premium Services</h2>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            TravThru provides premium taxi service, limo service, and chauffeur service in KL. From airport transfers to executive transport, we're your trusted Grab alternative with professional drivers and luxury vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group p-8 bg-gray-50 rounded-2xl hover:bg-brand-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-brand-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>

              <div className="mb-6 bg-white p-4 rounded-xl inline-block shadow-sm group-hover:bg-white/10 relative z-10">
                <div className="group-hover:text-gold-500 transition-colors">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white text-gray-900 relative z-10">{service.title}</h3>
              <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed relative z-10">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;