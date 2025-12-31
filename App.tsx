import React, { useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import Fleet from './components/Fleet';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import { BookingDetails } from './types';

const App: React.FC = () => {

  const handleBookingSearch = useCallback((details: BookingDetails) => {
    // Construct WhatsApp message for Booking/Quote
    let message = `Hi AJ Taxi KL, I would like a quote for a transfer:%0A%0A` +
      `🚘 *Trip Type:* ${details.tripType === 'return' ? 'Return Trip' : 'One Way'}%0A` +
      `📍 *From:* ${details.pickupLocation}%0A` +
      `📍 *To:* ${details.dropoffLocation}%0A` +
      `📅 *Date:* ${details.pickupDate}%0A` +
      `⏰ *Time:* ${details.pickupTime}%0A`;

    // Append Return details if applicable
    if (details.tripType === 'return') {
        message += `🔙 *Return Date:* ${details.returnDate || 'Not specified'}%0A` +
                   `⏰ *Return Time:* ${details.returnTime || 'Not specified'}%0A`;
    }
    
    // Open WhatsApp Web/App
    window.open(`https://wa.me/60182335796?text=${message}`, '_blank');
  }, []);

  const handleCarSelect = useCallback((carName: string) => {
    const message = `Hi AJ Taxi KL, I am interested in booking the *${carName}*. Is it available for my trip?`;
    window.open(`https://wa.me/60182335796?text=${message}`, '_blank');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <BookingForm onSearch={handleBookingSearch} />
      <Features />
      <Fleet onSelectCar={handleCarSelect} />
      <Services />
      <Pricing />
      <Testimonials />
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default App;