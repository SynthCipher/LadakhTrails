import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import BookingModal from '../components/BookingModal'
import { assets } from '../assets/assets'

const General = () => {
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
        // fetch planned tours of this type
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/tour/type/${encodeURIComponent('General')}`, { params: { planned: true } })
                const d = res.data
                if (d.success && d.tours && d.tours.length > 0) {
                    setTours(d.tours)
                    setActiveTour(d.tours[0])
                } else {
                    setTours([])
                    setActiveTour(null)
                }
            } catch (e) {
                console.error('Error fetching planned General tours', e)
                if (e.code === 'ERR_NETWORK' || e.request) {
                    toast.error(`Cannot reach backend API — ensure backend server is running on ${backendUrl}`)
                } else {
                    toast.error('Error fetching planned General tours')
                }
            }
        }
        fetchTour()
    }, [backendUrl])

    const tourDetails = {
        duration: activeTour
            ? `${formatShortDate(activeTour.startDate)} to ${formatShortDate(activeTour.endDate)}`
            : '7-10 Days',
        season: 'May - September',
        price: activeTour ? activeTour.price : '₹35,000 - ₹50,000',
        difficulty: 'Moderate',
        tourType: activeTour?.tourType || 'General',
        highlights: activeTour ? activeTour.highlights.split(',').map(h => h.trim()) : [
            'Leh Palace - Historic 9-storey palace with panoramic views',
            'Pangong Lake - Stunning high-altitude lake with changing colors',
            'Nubra Valley - Twin peaks and dramatic landscapes',
            'Hundar Sand Dunes - Desert landscape in Ladakh',
            'Ancient Monasteries - Buddhist heritage and spiritual experience',
            'Local Markets - Experience Ladakhi culture and crafts',
            'Khardung La Pass - One of the highest motorable passes',
            'Shey Palace - Ancient royal residence with golden Buddha'
        ],
        inclusions: [
            'Accommodation',
            'Meals (Breakfast & Dinner)',
            'Transport & Transfers',
            'Professional Guide',
            'Travel Insurance',
            'Permits & Fees'
        ]
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl font-bold mb-4">🏔️ General Ladakh Tour</h1>
                        <p className="text-xl">Experience the complete beauty of Ladakh - culture, landscapes, and adventure</p>
                    </div>
                </section>

                {/* Tour Details */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tour Overview</h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Our General Ladakh Tour is the perfect introduction to this magical region. Spanning 7-10 days, this tour covers all major attractions and provides an authentic experience of Ladakh's rich culture and stunning natural beauty.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                From the bustling streets of Leh to the serene monasteries and pristine lakes, every moment of this journey will leave you spellbound.
                            </p>

                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Highlights</h3>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Leh Palace - Historic 9-storey palace with panoramic views',
                                    'Pangong Lake - Stunning high-altitude lake with changing colors',
                                    'Nubra Valley - Twin peaks and dramatic landscapes',
                                    'Hundar Sand Dunes - Desert landscape in Ladakh',
                                    'Ancient Monasteries - Buddhist heritage and spiritual experience',
                                    'Local Markets - Experience Ladakhi culture and crafts',
                                    'Khardung La Pass - One of the highest motorable passes',
                                    'Shey Palace - Ancient royal residence with golden Buddha'
                                ].map((highlight, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-green-600 mr-3 text-xl">✓</span>
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Active tour image + quick book */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-100">
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
                                        <p className="font-semibold text-gray-800">{activeTour ? activeTour.tourName : 'General Ladakh Tour'}</p>
                                        {activeTour && (
                                            <p className="text-sm text-gray-600">
                                                {formatShortDate(activeTour.startDate)} - {formatShortDate(activeTour.endDate)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => activeTour && setIsBookingOpen(true)}
                                        disabled={!activeTour}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>

                            {/* Duration & Price (static overview) */}
                            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-green-600">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Details (Overview)</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="text-2xl font-bold text-green-600">{tourDetails.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Best Season</p>
                                        <p className="text-2xl font-bold text-green-600">{tourDetails.season}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price</p>
                                        <p className="text-2xl font-bold text-green-600">{tourDetails.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Difficulty Level</p>
                                        <p className="text-2xl font-bold text-green-600">{tourDetails.difficulty}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inclusions */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">What's Included</h3>
                                <ul className="space-y-2">
                                    {['Accommodation', 'Meals (Breakfast & Dinner)', 'Transport & Transfers', 'Professional Guide', 'Travel Insurance', 'Permits & Fees'].map((item, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <span className="text-green-600 mr-3">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Upcoming scheduled General tours list */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Upcoming Scheduled General Tours</h3>
                                {tours.length > 0 ? (
                                    <div className="space-y-3">
                                        {tours.map((tour) => (
                                            <button
                                                key={tour._id}
                                                onClick={() => {
                                                    setActiveTour(tour)
                                                    setIsBookingOpen(true)
                                                }}
                                                className="w-full text-left border border-green-200 rounded-lg px-4 py-3 hover:bg-green-50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={tour.image || assets.general}
                                                        alt={tour.tourName}
                                                        className="w-16 h-16 rounded-md object-cover bg-gray-100"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{tour.tourName}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatShortDate(tour.startDate)} - {formatShortDate(tour.endDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-green-600">₹{tour.price}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm">No upcoming General tours are scheduled at the moment.</p>
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
                                { day: 'Day 1-2', title: 'Arrival in Leh', desc: 'Arrival, acclimatization, explore Leh Palace and local markets' },
                                { day: 'Day 3', title: 'Leh to Nubra Valley', desc: 'Drive to Nubra Valley via Khardung La Pass, visit Hundar Sand Dunes' },
                                { day: 'Day 4', title: 'Nubra Valley', desc: 'Explore Nubra Valley, camel safari, monastery visits' },
                                { day: 'Day 5-6', title: 'Pangong Lake', desc: 'Drive to Pangong Lake, explore the stunning blue waters' },
                                { day: 'Day 7', title: 'Shey & Thiksey', desc: 'Visit ancient palaces and monasteries' },
                                { day: 'Day 8-9', title: 'Leisure & Shopping', desc: 'Last-minute sightseeing and shopping for souvenirs' },
                                { day: 'Day 10', title: 'Departure', desc: 'Departure from Leh' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                                    <div className="flex items-start gap-4">
                                        <span className="text-lg font-bold text-green-600 flex-shrink-0">{item.day}</span>
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
                tourName={activeTour ? activeTour.tourName : 'General Ladakh Tour'}
                tourDetails={tourDetails}
                tourId={activeTour ? activeTour._id : undefined}
                lockedDate={activeTour ? `${activeTour.startDate} - ${activeTour.endDate}` : undefined}
            />
        </>
    )
}

export default General
