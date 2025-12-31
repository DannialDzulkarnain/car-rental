import React from 'react';
import { Plane, Car, Map, Briefcase, Mountain, Users, Building2, MapPin } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Plane className="w-8 h-8 text-brand-500" />,
      title: "KLIA / KLIA2 Airport Transfer",
      description: "Reliable airport pickup and drop-off. We monitor flight schedules to ensure our driver is waiting for you upon arrival."
    },
    {
      icon: <Mountain className="w-8 h-8 text-brand-500" />,
      title: "Genting Highlands & Cameron",
      description: "Direct transfer to Resorts World Genting or Cameron Highlands. Enjoy a comfortable journey up the mountains."
    },
    {
      icon: <MapPin className="w-8 h-8 text-brand-500" />,
      title: "Singapore & Legoland",
      description: "Cross-border transfers to Singapore and Legoland Malaysia. Hassle-free immigration clearance from the comfort of the vehicle."
    },
    {
      icon: <Map className="w-8 h-8 text-brand-500" />,
      title: "Outstation / Intercity",
      description: "Long-distance travel to Penang, Johor Bahru, Ipoh, Melaka, and other states with experienced drivers."
    },
    {
      icon: <Car className="w-8 h-8 text-brand-500" />,
      title: "Self Drive Kereta Sewa",
      description: "Affordable car rental options for those who prefer to drive themselves. Daily, weekly, and monthly rates available."
    },
    {
      icon: <Building2 className="w-8 h-8 text-brand-500" />,
      title: "KL City Tour",
      description: "Explore Kuala Lumpur's landmarks like KLCC, Batu Caves, and Dataran Merdeka with our hourly chauffeur service."
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
            AJ Rental provides comprehensive transport solutions tailored to your needs. From airport transfers to holiday trips, we ensure a smooth journey.
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