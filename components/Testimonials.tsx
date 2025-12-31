import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Client Reviews</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4">What Our Clients Say</h2>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-gold-500 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-100" />
              
              <div className="flex text-gold-500 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-brand-500 uppercase tracking-wide">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Static example to fill grid if only 2 real reviews exist */}
          <div className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-gold-500 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-100" />
              <div className="flex text-gold-500 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "The Kereta Sewa service was excellent. Car was clean, new, and the handover was very smooth. Will rent again when I'm in KL."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 text-sm">Ahmad Z.</h4>
                  <p className="text-xs text-brand-500 uppercase tracking-wide">Local Renter</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;