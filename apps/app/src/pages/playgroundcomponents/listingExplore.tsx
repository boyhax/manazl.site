import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, List, Map as MapIcon, Filter, X } from 'lucide-react';
import { MapContainer,TileLayer, Marker, Popup } from 'react-leaflet';


// UI Components
const Button = ({ children, onClick, className, variant }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md ${
      variant === 'outline'
        ? 'border border-gray-300 hover:bg-gray-100'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  />
);

const Slider = ({ min, max, step, value, onValueChange }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[1]}
    onChange={(e) => onValueChange([value[0], parseInt(e.target.value)])}
    className="w-full"
  />
);

const listings = [
  { id: 1, title: "Cozy Studio in Downtown", price: 1200, location: "Downtown", image: "https://via.placeholder.com/100", lat: 40.7128, lng: -74.0060 },
  { id: 2, title: "Spacious 2BR with View", price: 2000, location: "Uptown", image: "https://via.placeholder.com/100", lat: 40.7589, lng: -73.9851 },
  { id: 3, title: "Modern Loft near Park", price: 1800, location: "Midtown", image: "https://via.placeholder.com/100", lat: 40.7549, lng: -73.9840 },
  { id: 4, title: "Charming 1BR Apartment", price: 1500, location: "West End", image: "https://via.placeholder.com/100", lat: 40.7736, lng: -73.9566 },
];

export default function ListingsExplore() {
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([1000, 3000]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Explore Listings</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <Button className={''} onClick={() => setShowFilters(!showFilters)} variant="outline">
                {showFilters ? <X className="mr-2" /> : <Filter className="mr-2" />}
                {showFilters ? 'Close Filters' : 'Filters'}
              </Button>
              <Button onClick={() => setShowMap(!showMap)} className="lg:hidden" variant="outline">
                {showMap ? <List className="mr-2" /> : <MapIcon className="mr-2" />}
                {showMap ? 'List View' : 'Map View'}
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white rounded-lg shadow-lg p-4 mb-4"
                >
                  <h2 className="text-xl font-semibold mb-4">Filters</h2>
                  <div className="space-y-4">
                    <Input placeholder="Search by location" />
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                      <Slider
                        min={500}
                        max={5000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((listing) => (
                <motion.div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                    <p className="text-blue-600 font-bold">${listing.price}/month</p>
                    <p className="text-gray-600"><MapPin className="inline mr-1" size={16} />{listing.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={`w-full lg:w-1/3 ${showMap ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <Suspense fallback={<div>Loading map...</div>}>
                <MapContainer
                  center={[40.7128, -74.0060]}
                  zoom={13}
                  style={{ height: 'calc(100vh - 2rem)', width: '100%' }}
                  className="rounded-lg shadow-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {listings.map((listing) => (
                    <Marker key={listing.id} position={[listing.lat, listing.lng]}>
                      <Popup>
                        <div>
                          <h3 className="font-semibold">{listing.title}</h3>
                          <p>${listing.price}/month</p>
                          <p>{listing.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}