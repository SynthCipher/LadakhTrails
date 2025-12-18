import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UpcomingTours from '../components/UpcomingTours'
import LadakhCalendar from '../components/LadakhCalendar'
import ContactModal from '../components/ContactModal'
import { Users, Shield, Globe } from 'lucide-react'
import { assets } from '../assets/assets.js'
const Home = () => {
  const heroImages = [
    assets.homePageMainImage1,
    assets.homePageMainImage2,
    assets.homePageMainImage3,
    assets.homePageMainImage4,
    assets.homePageMainImage5,
    assets.homePageMainImage6,
  ].filter(Boolean)

  const [heroIndex, setHeroIndex] = useState(0)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  useEffect(() => {
    if (!heroImages.length) return
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [heroImages.length])
  const tours = [
    {
      id: 1,
      name: 'General Tour',
      description: 'Explore the stunning landscapes, historic monasteries, and vibrant culture of Ladakh',
      image: assets.general,
      path: '/general',
      highlights: ['Leh Palace', 'Pangong Lake', 'Nubra Valley', 'Monasteries']
    },
    {
      id: 2,
      name: 'Wildlife Tour',
      description: 'Discover the rare wildlife including snow leopards, bharal, and Himalayan animals',
      image: assets.wildlife,
      path: '/wildlife',
      highlights: ['Snow Leopard Tracking', 'Wildlife Photography', 'Nature Reserves', 'Expert Guides']
    },
    {
      id: 3,
      name: 'Winter Sports',
      description: 'Experience thrilling snow sports and winter adventures in the frozen landscapes',
      image: assets.winterSport,
      path: '/winter-sports',
      highlights: ['Ice Skating', 'Chadar Trek', 'Snow Activities', 'Winter Camping']
    },
    {
      id: 4,
      name: 'Birding Tour',
      description: 'Paradise for bird watchers with over 200 bird species throughout the year',
      image: assets.birding,
      path: '/birding',
      highlights: ['Rare Bird Species', 'Photography Opportunities', 'Expert Ornithologists', 'Seasonal Migrations']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with sliding background images */}
      <section
        className="relative text-white py-20 px-4 overflow-hidden"
        style={heroImages.length ? {
          backgroundImage: `url(${heroImages[heroIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* Blue gradient overlay to keep existing look */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-700/80 to-blue-600/70"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to LadakhTrails</h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Discover the majestic beauty of Ladakh with our expertly curated tour packages
          </p>
          <p className="text-lg opacity-90">Your adventure in the land of high passes and untouched landscapes starts here</p>
        </div>
      </section>

      {/* Upcoming Tours Section */}
      <UpcomingTours />



      {/* Tour Packages Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Tour Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group">
              <div className="flex flex-col">
                <div className="overflow-hidden">
                  <img src={tour.image} alt={tour.name} className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{tour.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tour.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Highlights:</h4>
                      <ul className="flex flex-wrap gap-2">
                        {tour.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1">{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 ">
                    <Link to={tour.path} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">
                      Explore Package
                    </Link>
                    {/* <a href="#book" className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition">
                      Book Now
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ladakh Festivals Calendar */}
      <LadakhCalendar />

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose Ladakh Trails?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Users size={36} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-3">Expert Guides</h3>
              <p className="text-gray-600">Our experienced and knowledgeable guides ensure you get the best experience</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Shield size={36} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-3">Safety First</h3>
              <p className="text-gray-600">All tours include comprehensive safety measures and emergency protocols</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Globe size={36} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-3">Sustainable Tourism</h3>
              <p className="text-gray-600">We are committed to preserving Ladakh's natural and cultural heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Adventure?</h2>
          <p className="text-xl mb-8">Book your tour package today and create unforgettable memories in Ladakh</p>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="inline-block bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get In Touch
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  )
}

export default Home
