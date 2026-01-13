import React from 'react';
import { ShieldCheck, Clock, UserCheck, HeartHandshake } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-gold-500" />,
      title: "Safety First",
      description: "Our fleet is rigorously maintained and sanitized. Your safety is our absolute priority on every journey."
    },
    {
      icon: <UserCheck className="w-10 h-10 text-gold-500" />,
      title: "Professional Chauffeurs",
      description: "Experienced, licensed, and polite drivers who know the routes well and ensure a smooth ride."
    },
    {
      icon: <Clock className="w-10 h-10 text-gold-500" />,
      title: "Always Punctual",
      description: "We value your time. For airport transfers, we monitor flights to ensure we are there when you arrive."
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-gold-500" />,
      title: "Personalized Service",
      description: "From baby seats to specific route requests, we go the extra mile to accommodate your travel needs."
    }
  ];

  return (
    <section className="py-16 bg-brand-900 text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">The TRAVTHRU Standard</h2>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-brand-100 max-w-2xl mx-auto">
            Just like premium private transportation services, we adhere to strict standards of excellence for our Kereta Sewa and Chauffeur services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4 bg-brand-800 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gold-500">{feature.title}</h3>
              <p className="text-brand-100 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;