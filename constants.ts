import { Car, CarCategory } from './types';

export const CAR_FLEET: Car[] = [
  {
    id: '1',
    name: 'Toyota Alphard',
    category: CarCategory.LUXURY,
    pricePerDay: 950,
    priceTransfer: 350,
    seats: 6,
    image: 'https://images.unsplash.com/photo-1621213032485-649068b5779c?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1621213032485-649068b5779c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1200',
    ],
    features: ['VIP Captain Seats', 'Dual Power Doors', 'Premium Leather Interior', 'Privacy Glass'],
  },
  {
    id: '2',
    name: 'Hyundai Staria',
    category: CarCategory.MPV,
    pricePerDay: 850,
    priceTransfer: 300,
    seats: 7,
    image: 'https://images.unsplash.com/photo-1696515233159-d8e6f1f51662?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1696515233159-d8e6f1f51662?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
    ],
    features: ['Futuristic Design', 'Huge Window Views', 'Premium Lounge Seats', 'Advanced Safety Tech'],
  },
  {
    id: '3',
    name: 'Toyota Innova',
    category: CarCategory.MPV,
    pricePerDay: 450,
    priceTransfer: 180,
    seats: 7,
    image: 'https://images.unsplash.com/photo-1594967396014-41d441052608?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1594967396014-41d441052608?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1200',
    ],
    features: ['Family Favorite', 'Robust Performance', 'Spacious Cargo Space', 'Excellent AC'],
  },
  {
    id: '4',
    name: 'Perodua Alza',
    category: CarCategory.MPV,
    pricePerDay: 250,
    priceTransfer: 130,
    seats: 7,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
    ],
    features: ['Compact MPV', 'Modern Multimedia', 'Versatile Seating', 'Fuel Efficient'],
  },
  {
    id: '5',
    name: 'Perodua Bezza',
    category: CarCategory.ECONOMY,
    pricePerDay: 150,
    priceTransfer: 90,
    seats: 4,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200',
    ],
    features: ['Best Economy Sedan', 'Huge Boot Space', 'Exceptional Fuel Economy', 'Smooth for City'],
  },
  {
    id: '6',
    name: 'Perodua Axia',
    category: CarCategory.ECONOMY,
    pricePerDay: 120,
    priceTransfer: 80,
    seats: 4,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200',
    ],
    features: ['Ultra Compact', 'Easy Parking', 'Very Economical', 'Agile Handling'],
  },
];

export const TESTIMONIALS = [
  {
    name: "Johnathan Tan",
    role: "Regular Customer",
    text: "AJ Taxi KL is my go-to for airport transfers. Always punctual and the cars are exceptionally clean. The Toyota Alphard is perfect for business trips.",
    rating: 5,
  },
  {
    name: "Aisyah Osman",
    role: "Family Traveler",
    text: "Booked a Toyota Innova for a trip to Genting. The driver was very careful and professional. Best service in Kuala Lumpur!",
    rating: 5,
  },
];