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
    const [tours, setTours] = useState([])
    const [activeTour, setActiveTour] = useState(null)

    const formatShortDate = (isoDate) => {
        try {
            if (!isoDate) return ''
            const d = new Date(isoDate)
            if (isNaN(d)) return isoDate
            const day = d.getDate()
            const month = d.toLocaleString('default', { month: 'short' })
            const year = String(d.getFullYear()).slice(-2)
            return `${day} ${month} '${year}`
        } catch {
            return isoDate
        }
    }

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/tour/type/${encodeURIComponent('Winter Sports')}`, { params: { planned: true } })
                const d = res.data
                if (d.success && d.tours && d.tours.length > 0) {
                    setTours(d.tours)
                    setActiveTour(d.tours[0])
                } else {
                    setTours([])
                    setActiveTour(null)
                }
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
        duration: activeTour
            ? `${formatShortDate(activeTour.startDate)} to ${formatShortDate(activeTour.endDate)}`
            : '8-12 Days',
        season: 'December - February',
        price: activeTour ? activeTour.price : '₹55,000 - ₹85,000',
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
                            {/* Active tour image + quick book */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
                                {activeTour?.image ? (
                                    <img
                                        src={activeTour.image}
                                        alt={activeTour.tourName}
                                        className="w-full h-56 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                                        No image available
                                    </div>
                                )}
                                <div className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{activeTour ? activeTour.tourName : 'Winter Sports Tour'}</p>
                                        {activeTour && (
                                            <p className="text-sm text-gray-600">
                                                {formatShortDate(activeTour.startDate)} - {formatShortDate(activeTour.endDate)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => activeTour && setIsBookingOpen(true)}
                                        disabled={!activeTour}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>

                            {/* Duration & Price (overview) */}
                            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Details (Overview)</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="text-2xl font-bold text-blue-600">{tourDetails.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Best Season</p>
                                        <p className="text-2xl font-bold text-blue-600">{tourDetails.season}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price</p>
                                        <p className="text-2xl font-bold text-blue-600">{tourDetails.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Difficulty Level</p>
                                        <p className="text-2xl font-bold text-blue-600">{tourDetails.difficulty}</p>
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

                            {/* Upcoming scheduled Winter Sports tours list */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Upcoming Scheduled Winter Sports Tours</h3>
                                {tours.length > 0 ? (
                                    <div className="space-y-3">
                                        {tours.map((tour) => (
                                            <button
                                                key={tour._id}
                                                onClick={() => {
                                                    setActiveTour(tour)
                                                    setIsBookingOpen(true)
                                                }}
                                                className="w-full text-left border border-blue-200 rounded-lg px-4 py-3 hover:bg-blue-50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-800">{tour.tourName}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatShortDate(tour.startDate)} - {formatShortDate(tour.endDate)}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-blue-600">₹{tour.price}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm">No upcoming Winter Sports tours are scheduled at the moment.</p>
                                )}
                            </div>
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
