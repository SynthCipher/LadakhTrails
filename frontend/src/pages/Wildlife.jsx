import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import BookingModal from '../components/BookingModal'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'

const Wildlife = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [activeTour, setActiveTour] = useState(null)
    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/tour/type/${encodeURIComponent('Wildlife')}`, { params: { planned: true } })
                const d = res.data
                if (d.success && d.tours && d.tours.length > 0) setActiveTour(d.tours[0])
            } catch (e) {
                console.error(e)
                if (e.code === 'ERR_NETWORK' || e.request) {
                    toast.error('Cannot reach backend API — ensure backend server is running on http://localhost:8081')
                } else {
                    toast.error('Error fetching planned Wildlife tours')
                }
            }
        }
        fetchTour()
    }, [])

    const tourDetails = {
        duration: activeTour ? `${activeTour.startDate} to ${activeTour.endDate}` : '10-14 Days',
        season: 'January - March, August - October',
        price: '₹60,000 - ₹90,000',
        difficulty: 'Challenging',
        highlights: [
            'Snow Leopard Tracking - Track the elusive big cat',
            'Photography Opportunities - Capture stunning wildlife moments',
            'Bharal Herds - Watch the blue sheep of the Himalayas',
            'Himalayan Ibex - Majestic wild goats with curved horns',
            'Lammergeier & Eagles - Soaring raptors of high altitude',
            'Alpine Flora - Unique high-altitude vegetation',
            'Expert Naturalists - Learn from wildlife experts',
            'Conservation Talk - Understand wildlife protection efforts'
        ],
        inclusions: [
            'Accommodation',
            'All Meals',
            'Expert Wildlife Guide',
            'Transport & Transfers',
            'Binoculars & Equipment',
            'Photography Assistance'
        ]
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl font-bold mb-4">🐆 Wildlife Tour</h1>
                        <p className="text-xl">Track rare snow leopards and discover Ladakh's pristine wildlife</p>
                    </div>
                </section>

                {/* Tour Details */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tour Overview</h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Ladakh is home to some of the world's most elusive and endangered wildlife. Our Wildlife Tour is designed for nature enthusiasts and wildlife photographers to experience the raw beauty of Himalayan fauna in their natural habitat.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Led by expert naturalists and wildlife photographers, this tour provides the best opportunity to spot snow leopards, Himalayan ibex, bharal, and over 200 bird species.
                            </p>

                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Wildlife Highlights</h3>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Snow Leopard Tracking - Track the elusive big cat',
                                    'Photography Opportunities - Capture stunning wildlife moments',
                                    'Bharal Herds - Watch the blue sheep of the Himalayas',
                                    'Himalayan Ibex - Majestic wild goats with curved horns',
                                    'Lammergeier & Eagles - Soaring raptors of high altitude',
                                    'Alpine Flora - Unique high-altitude vegetation',
                                    'Expert Naturalists - Learn from wildlife experts',
                                    'Conservation Talk - Understand wildlife protection efforts'
                                ].map((highlight, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-orange-600 mr-3 text-xl">✓</span>
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Duration & Price */}
                            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-orange-600">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="text-2xl font-bold text-orange-600">10-14 Days</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Best Season</p>
                                        <p className="text-2xl font-bold text-orange-600">January - March, August - October</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price Range</p>
                                        <p className="text-2xl font-bold text-orange-600">₹60,000 - ₹90,000</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Difficulty Level</p>
                                        <p className="text-2xl font-bold text-orange-600">Challenging</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inclusions */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">What's Included</h3>
                                <ul className="space-y-2">
                                    {['Accommodation', 'All Meals', 'Expert Wildlife Guide', 'Transport & Transfers', 'Binoculars & Equipment', 'Photography Assistance'].map((item, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <span className="text-orange-600 mr-3">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            {activeTour ? (
                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition duration-300">
                                    Book This Tour
                                </button>
                            ) : (
                                <div className="w-full py-4 rounded-lg text-center text-gray-600">Not scheduled at the moment</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Itinerary */}
                <section className="bg-gray-100 py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-gray-800">Sample Itinerary</h2>
                        <div className="space-y-4">
                            {[
                                { day: 'Day 1-2', title: 'Arrival & Acclimatization', desc: 'Settle in Leh, orientation session on wildlife of Ladakh' },
                                { day: 'Day 3-5', title: 'Nubra Valley Wildlife', desc: 'Trek to remote areas, spot bharal, ibex, and alpine wildlife' },
                                { day: 'Day 6-8', title: 'Snow Leopard Territory', desc: 'Early morning treks in snow leopard habitat, photography sessions' },
                                { day: 'Day 9-10', title: 'Pangong Wildlife', desc: 'Bird watching and wildlife spotting at high altitude lake' },
                                { day: 'Day 11-12', title: 'Nature Reserves', desc: 'Visit protected wildlife reserves with expert guides' },
                                { day: 'Day 13', title: 'Conservation Seminar', desc: 'Learn about wildlife protection and conservation efforts' },
                                { day: 'Day 14', title: 'Departure', desc: 'Departure from Leh with unforgettable wildlife memories' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
                                    <div className="flex items-start gap-4">
                                        <span className="text-lg font-bold text-orange-600 flex-shrink-0">{item.day}</span>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                tourName={activeTour ? activeTour.tourName : 'Wildlife Tour'}
                tourDetails={tourDetails}
                tourId={activeTour ? activeTour._id : undefined}
                lockedDate={activeTour ? `${activeTour.startDate} - ${activeTour.endDate}` : undefined}
            />
        </>
    )
}

export default Wildlife
