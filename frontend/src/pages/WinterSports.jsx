import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import BookingModal from '../components/BookingModal'

const WinterSports = () => {
    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [activeTour, setActiveTour] = useState(null)

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/tour/type/${encodeURIComponent('Winter Sports')}`, { params: { planned: true } })
                const d = res.data
                if (d.success && d.tours && d.tours.length > 0) setActiveTour(d.tours[0])
            } catch (e) {
                console.error(e)
                if (e.code === 'ERR_NETWORK' || e.request) {
                    toast.error(`Cannot reach backend API — ensure backend server is running on ${backendUrl}`)
                } else {
                    toast.error('Error fetching planned Winter Sports tours')
                }
            }
        }
        fetchTour()
    }, [backendUrl])

    const tourDetails = {
        duration: activeTour ? `${activeTour.startDate} to ${activeTour.endDate}` : '8-12 Days',
        season: 'December - February',
        price: '₹55,000 - ₹85,000',
        difficulty: 'Moderate to Challenging',
        highlights: [
            'Chadar Trek - Walk on the frozen Zanskar River',
            'Ice Skating - Glide on crystal-clear frozen lakes',
            'Snowboarding & Skiing - Professional slopes available',
            'Snowshoeing - Trek through pristine snow landscapes',
            'Ice Climbing - Scale frozen waterfalls safely',
            'Winter Camping - Sleep under the stars in snow',
            'Sledding & Tobogganing - Fun winter activities',
            'Photography - Capture magical winter moments'
        ],
        inclusions: [
            'Winter Accommodation',
            'All Meals with Hot Beverages',
            'Winter Gear Rental',
            'Professional Sports Guides',
            'Safety Equipment',
            'Snow Insurance'
        ]
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl font-bold mb-4">⛷️ Winter Sports Tour</h1>
                        <p className="text-xl">Thrilling snow sports and adventures in Ladakh's frozen wonderland</p>
                    </div>
                </section>

                {/* Tour Details */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tour Overview</h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Experience the magic of Ladakh during winters! This is the perfect tour for adventure seekers and winter sports enthusiasts. From the world-famous Chadar Trek to ice skating on frozen lakes, we offer unique winter experiences that transform Ladakh into a winter sports paradise.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                With proper equipment and expert guidance, you'll safely enjoy thrilling snow activities at high altitudes.
                            </p>

                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Winter Highlights</h3>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Chadar Trek - Walk on the frozen Zanskar River',
                                    'Ice Skating - Glide on crystal-clear frozen lakes',
                                    'Snowboarding & Skiing - Professional slopes available',
                                    'Snowshoeing - Trek through pristine snow landscapes',
                                    'Ice Climbing - Scale frozen waterfalls safely',
                                    'Winter Camping - Sleep under the stars in snow',
                                    'Sledding & Tobogganing - Fun winter activities',
                                    'Photography - Capture magical winter moments'
                                ].map((highlight, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-blue-600 mr-3 text-xl">✓</span>
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Duration & Price */}
                            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="text-2xl font-bold text-blue-600">8-12 Days</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Best Season</p>
                                        <p className="text-2xl font-bold text-blue-600">December - February</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price Range</p>
                                        <p className="text-2xl font-bold text-blue-600">₹55,000 - ₹85,000</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Difficulty Level</p>
                                        <p className="text-2xl font-bold text-blue-600">Moderate to Challenging</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inclusions */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">What's Included</h3>
                                <ul className="space-y-2">
                                    {['Winter Accommodation', 'All Meals with Hot Beverages', 'Winter Gear Rental', 'Professional Sports Guides', 'Safety Equipment', 'Snow Insurance'].map((item, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <span className="text-blue-600 mr-3">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            {activeTour ? (
                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300">
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
                                { day: 'Day 1-2', title: 'Arrival & Training', desc: 'Arrival in Leh, safety training for winter sports, equipment fitting' },
                                { day: 'Day 3-4', title: 'Ice Skating', desc: 'Learn ice skating on frozen Pangong Lake with professional instructors' },
                                { day: 'Day 5-7', title: 'Chadar Trek', desc: 'Epic trek on frozen Zanskar River, camp in traditional Ladakhi style' },
                                { day: 'Day 8-9', title: 'Snow Sports', desc: 'Snowboarding, skiing, or snowshoeing with expert guides' },
                                { day: 'Day 10', title: 'Ice Climbing', desc: 'Thrilling ice climbing experience on frozen waterfalls' },
                                { day: 'Day 11', title: 'Rest & Exploration', desc: 'Rest day and explore local winter culture and markets' },
                                { day: 'Day 12', title: 'Departure', desc: 'Safe departure with incredible winter memories' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                                    <div className="flex items-start gap-4">
                                        <span className="text-lg font-bold text-blue-600 flex-shrink-0">{item.day}</span>
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
                tourName={activeTour ? activeTour.tourName : 'Winter Sports Tour'}
                tourDetails={tourDetails}
                tourId={activeTour ? activeTour._id : undefined}
                lockedDate={activeTour ? `${activeTour.startDate} - ${activeTour.endDate}` : undefined}
            />
        </>
    )
}

export default WinterSports
