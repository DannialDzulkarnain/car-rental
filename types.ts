export enum CarCategory {
  ECONOMY = 'Economy',
  SEDAN = 'Sedan',
  MPV = 'MPV',
  SUV = 'SUV',
  LUXURY = 'Luxury',
  VAN = 'Van'
}

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  pricePerDay: number; // Daily Rental
  priceTransfer: number; // KLIA Transfer approx
  seats: number;
  image: string;
  gallery: string[]; // New: Array of images for the gallery (Interior, Seats, etc.)
  features: string[];
}

export interface BookingDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  tripType: 'one-way' | 'return';
  selectedCarId?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}