import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import BookingModal from '../components/BookingModal'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import { assets } from '../assets/assets'

const Wildlife = () => {
    const heroImages = [
        assets.wildlife1,
        assets.wildlife2,
        assets.wildlife3,
        assets.wildlife4,
        assets.wildlife5,
    ].filter(Boolean)

    const [heroIndex, setHeroIndex] = useState(0)

    useEffect(() => {
        if (!heroImages.length) return
        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroImages.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [heroImages.length])

    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [tours, setTours] = useState([])
    const [activeTour, setActiveTour] = useState(null)
    const [seatsLeft, setSeatsLeft] = useState({})

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
    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    useEffect(() => {
        const fetchToursAndSort = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/tour/type/${encodeURIComponent('Wildlife')}`, { params: { planned: true } })
                const d = res.data
                if (d.success && d.tours && d.tours.length > 0) {
                    let fetchedTours = d.tours
                    const newSeatsLeft = {}

                    // 2. Fetch all seat counts in parallel
                    await Promise.all(fetchedTours.map(async (tour) => {
                        try {
                            const countRes = await axios.get(`${backendUrl}/api/tour/booking/count/${tour._id}`)
                            if (countRes.data.success) {
                                const booked = countRes.data.count
                                const available = tour.availableSeats - booked
                                newSeatsLeft[tour._id] = available
                            } else {
                                newSeatsLeft[tour._id] = tour.availableSeats
                            }
                        } catch (err) {
                            console.error('Error fetching count for', tour._id, err)
                            newSeatsLeft[tour._id] = tour.availableSeats
                        }
                    }))

                    setSeatsLeft(newSeatsLeft)

                    // 3. Sort Tours
                    fetchedTours.sort((a, b) => {
                        const getStatus = (tour) => {
                            const remaining = newSeatsLeft[tour._id] !== undefined ? newSeatsLeft[tour._id] : 999
                            const isFull = remaining <= 0

                            const now = new Date()
                            const start = new Date(tour.startDate)
                            const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
                            const isClosed = diffDays <= 7

                            if (isFull || isClosed) return 0
                            return 1
                        }

                        const statusA = getStatus(a)
                        const statusB = getStatus(b)

                        if (statusA !== statusB) return statusB - statusA
                        return new Date(a.startDate) - new Date(b.startDate)
                    })

                    setTours(fetchedTours)
                    setActiveTour(fetchedTours[0])

                } else {
                    setTours([])
                    setActiveTour(null)
                }
            } catch (e) {
                console.error(e)
                if (e.code === 'ERR_NETWORK' || e.request) {
                    toast.error(`Cannot reach backend API — ensure backend server is running on ${backendUrl}`)
                } else {
                    // toast.error('Error fetching planned Wildlife tours')
                }
            }
        }
        fetchToursAndSort()
    }, [backendUrl])

    const tourDetails = {
        duration: activeTour
            ? `${formatShortDate(activeTour.startDate)} to ${formatShortDate(activeTour.endDate)}`
            : '10-14 Days',
        season: 'January - March, August - October',
        price: activeTour ? activeTour.price : '₹60,000 - ₹90,000',
        difficulty: 'Challenging',
        tourType: 'Wildlife',
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
        ],
        totalSeats: activeTour ? activeTour.availableSeats : '20'
    }

    // Helper to check closure
    const checkBookingClosed = (dateStr) => {
        if (!dateStr) return false
        const now = new Date()
        const startDate = new Date(dateStr)
        const diffTime = startDate - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7
    }

    const isActiveBookingClosed = activeTour ? checkBookingClosed(activeTour.startDate) : false

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section
                    className="relative text-white py-20 px-4 overflow-hidden h-[60vh] flex items-center justify-center transition-all duration-1000"
                    style={heroImages.length ? {
                        backgroundImage: `url(${heroImages[heroIndex]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    } : {}}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Wildlife Tour</h1>
                        <p className="text-xl drop-shadow-md">Track rare snow leopards and discover Ladakh's pristine wildlife</p>
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
                            {/* Active tour image + quick book */}
                            {/* Active tour image + quick book */}
                            {activeTour ? (
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-100">
                                    {activeTour.image ? (
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
                                            <p className="font-semibold text-gray-800">{activeTour.tourName}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatShortDate(activeTour.startDate)} - {formatShortDate(activeTour.endDate)}
                                            </p>
                                        </div>
                                        <button
                                            disabled={isActiveBookingClosed}
                                            onClick={() => setIsBookingOpen(true)}
                                            className={`${isActiveBookingClosed
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-orange-600 hover:bg-orange-700'} text-white px-4 py-2 rounded-md font-semibold transition`}
                                        >
                                            {isActiveBookingClosed ? 'Booking Closed' : 'Book'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-100 opacity-75">
                                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
                                        No Active Tours
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">No Tours Scheduled</p>
                                            <p className="text-sm text-gray-600">Please check back later</p>
                                        </div>
                                        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-md font-semibold cursor-not-allowed">
                                            Book
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Duration & Price (overview) */}
                            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-orange-600">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Details (Overview)</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="text-2xl font-bold text-orange-600">{tourDetails.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Best Season</p>
                                        <p className="text-2xl font-bold text-orange-600">{tourDetails.season}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price</p>
                                        <p className="text-2xl font-bold text-orange-600">{tourDetails.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Difficulty Level</p>
                                        <p className="text-2xl font-bold text-orange-600">{tourDetails.difficulty}</p>
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

                            {/* Upcoming scheduled Wildlife tours list */}
                            {/* Upcoming scheduled Wildlife tours list */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Upcoming Scheduled Wildlife Tours</h3>
                                {tours.length > 0 ? (
                                    <div className="space-y-3">
                                        {[...tours].sort((a, b) => {
                                            const aLeft = seatsLeft[a._id] !== undefined ? seatsLeft[a._id] : 999
                                            const bLeft = seatsLeft[b._id] !== undefined ? seatsLeft[b._id] : 999
                                            const aFull = aLeft <= 0
                                            const bFull = bLeft <= 0
                                            return aFull === bFull ? 0 : aFull ? 1 : -1
                                        }).map((tour) => {

                                            const remaining = seatsLeft[tour._id]
                                            const isFull = remaining !== undefined && remaining <= 0
                                            const isClosed = checkBookingClosed(tour.startDate)

                                            return (
                                                <button
                                                    key={tour._id}
                                                    disabled={isFull || isClosed}
                                                    onClick={() => {
                                                        setActiveTour(tour)
                                                        setIsBookingOpen(true)
                                                    }}
                                                    className={`w-full text-left border rounded-lg px-4 py-3 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${isFull || isClosed
                                                        ? 'border-gray-200 bg-gray-100 grayscale opacity-70 cursor-not-allowed'
                                                        : 'border-orange-200 hover:bg-orange-50'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{tour.tourName}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatShortDate(tour.startDate)} - {formatShortDate(tour.endDate)}
                                                        </p>
                                                    </div>
                                                    {isFull ? (
                                                        <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                                            Sold Out
                                                        </span>
                                                    ) : isClosed ? (
                                                        <span className="text-sm font-bold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                                                            Booking Closed
                                                        </span>
                                                    ) : (
                                                        <p className="text-sm font-bold text-orange-600">₹{tour.price}</p>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm">No upcoming Wildlife tours are scheduled at the moment.</p>
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
