import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BookingModal from './BookingModal'
import { Calendar, MapPin, Users, DollarSign, Feather, Eye, Snowflake, Bird, MountainSnow, PawPrint } from 'lucide-react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const UpcomingTours = () => {
    const [tours, setTours] = useState([])
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [selectedTour, setSelectedTour] = useState(null)
    const [loading, setLoading] = useState(true)
    const [seatsLeft, setSeatsLeft] = useState({})
    const [totalSeatsLeft, setTotalSeatsLeft] = useState(null)

    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    useEffect(() => {
        // Load tours from backend
        const fetchTours = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/tour/all`)
                const data = response.data
                if (data && data.success && Array.isArray(data.tours)) {
                    // only show planned / scheduled tours (handle boolean or string)
                    const planned = data.tours.filter(t => t && (t.isPlanned === true || t.isPlanned === 'true'))
                    setTours(planned)

                    // compute seats left for each tour by summing booked people
                    try {
                        const bookingPromises = planned.map(t =>
                            axios.get(`${backendUrl}/api/tour/booking/${t._id}`)
                                .then(res => ({ id: t._id, bookings: res.data && res.data.bookings ? res.data.bookings : [] }))
                                .catch(() => ({ id: t._id, bookings: [] }))
                        )

                        Promise.all(bookingPromises).then(results => {
                            const map = {}
                            let total = 0
                            results.forEach(r => {
                                const tour = planned.find(x => x._id === r.id)
                                if (!tour) return
                                const reserved = r.bookings.reduce((s, b) => s + (parseInt(b.numberOfPeople) || 0), 0)
                                const avail = parseInt(tour.availableSeats)
                                const left = isNaN(avail) ? null : Math.max(0, avail - reserved)
                                map[r.id] = left
                                if (left !== null) total += left
                            })
                            setSeatsLeft(map)
                            setTotalSeatsLeft(total)
                        })
                    } catch (e) {
                        // ignore seat computation errors
                        console.warn('Seat computation failed', e)
                    }
                } else {
                    console.error('Error fetching tours:', data?.message)
                }
            } catch (error) {
                console.error('Error fetching tours:', error)
                if (error.code === 'ERR_NETWORK' || error.request) {
                    // Inform user the backend is unreachable
                    toast.error('Cannot reach backend API — ensure backend server is running on ' + backendUrl)
                } else {
                    toast.error('Error fetching tours')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchTours()
    }, [backendUrl])

    const navigate = useNavigate()

    const handleBookClick = (tour) => {
        // Prepare tour details for booking modal and lock the dates from the scheduled tour
        const tourDetails = {
            duration: `${tour.startDate} to ${tour.endDate}`,
            season: '',
            price: tour.price,
            tourType: tour.tourType,      // ✅ add this line
            difficulty: '',
            highlights: (tour.highlights || '').split(',').map(h => h.trim()),
            inclusions: [
                'Accommodation',
                'Meals',
                'Transport',
                'Professional Guide',
                'Travel Insurance'
            ]
        }
        const lockedDate = `${tour.startDate} - ${tour.endDate}`
        setSelectedTour({ name: tour.tourName, details: tourDetails, id: tour._id, lockedDate })
        setIsBookingOpen(true)
    }

    const handleViewClick = (tour) => {
        // navigate to the tour-specific page (e.g., /wildlife, /birding)
        const path = `/${(tour.tourType || '').toLowerCase().replace(/\s+/g, '-')}`
        navigate(path)
    }

    const getTourIcon = (tourType) => {
        // use lucide-react icons for a cleaner look
        switch (tourType) {
            case 'Wildlife':
            case 'Wild Animal':
                return <PawPrint className="text-white" size={22} />
            case 'Birding':
                return <Bird className="text-white" size={22} />
            case 'Winter Sports':
                return <Snowflake className="text-white" size={22} />
            default:
                return <MountainSnow className="text-white" size={22} />
        }
    }

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

    const formatCurrency = (value) => {
        try {
            const n = Number(value)
            if (isNaN(n)) return value
            return new Intl.NumberFormat('en-IN').format(n)
        } catch {
            return value
        }
    }

    const getSpanClass = (index, total) => {
        // Layout rules based on total number of tours (per your request):
        // These apply at md and above; below md every card is full width with the same height
        // 1 => full, 2 => both half, 3 => first full, others half
        // 4 => first and fourth full, others half
        // 5 => first full, others half
        // 6 => first and last full, others half
        if (total === 1) return 'md:col-span-2'
        if (total === 2) return ''
        if (total === 3) return index === 0 ? 'md:col-span-2' : ''
        if (total === 4) return (index === 0 || index === 3) ? 'md:col-span-2' : ''
        if (total === 5) return index === 0 ? 'md:col-span-2' : ''
        if (total === 6) return (index === 0 || index === 5) ? 'md:col-span-2' : ''
        // fallback: first takes full width at md and above
        return index === 0 ? 'md:col-span-2' : ''
    }

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-16">
                <p className="text-center text-gray-600">Loading tours...</p>
            </section>
        )
    }

    if (tours.length === 0) {
        return null
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-3">

                <span>Upcoming Scheduled Tours</span>

            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {tours.map((tour, idx) => {
                    const spanClass = getSpanClass(idx, tours.length)
                    // small screens: all cards full-width with same height (h-64)
                    // md+ screens: use larger heights depending on whether item spans two columns
                    const heightClass = spanClass ? 'h-64 md:h-96' : 'h-64 md:h-80'

                    return (
                        <div
                            key={tour._id}
                            className={`${spanClass} relative rounded-lg overflow-hidden shadow-lg group`}
                            style={{ backgroundImage: tour.image ? `url(${tour.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: tour.image ? undefined : '#f8fafc' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>

                            <div className={`relative z-10 p-6 ${heightClass} flex flex-col justify-end`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                                            {getTourIcon(tour.tourType)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{tour.tourName}</h3>
                                            <p className="text-sm text-white/90">{tour.tourType}</p>
                                        </div>
                                    </div>

                                    {/* top-right pill with date, price and seats-left */}
                                    <div className="absolute top-4 right-4 bg-black/40 text-white px-3 py-2 rounded-md text-right">
                                        <div className="text-xs">{formatShortDate(tour.startDate)} — {formatShortDate(tour.endDate)}</div>
                                        <div className="font-semibold text-lg">₹{formatCurrency(tour.price)} <span className="text-sm font-normal text-white/80">/ person</span></div>
                                        <div className="text-xs text-white/80 mt-1">{seatsLeft[tour._id] !== undefined && seatsLeft[tour._id] !== null ? `${seatsLeft[tour._id]} seats left` : (tour.availableSeats ? `${tour.availableSeats} seats` : '')}</div>
                                    </div>
                                </div>

                                <p className="text-white/90 text-sm line-clamp-2">{(tour.description || '').slice(0, 160)}{(tour.description || '').length > 160 ? '...' : ''}</p>

                                <div className="mt-4 flex items-center gap-3">
                                    <button
                                        onClick={() => handleBookClick(tour)}
                                        className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
                                    >
                                        <Calendar size={16} /> Book Now
                                    </button>

                                    <button
                                        onClick={() => handleViewClick(tour)}
                                        className="bg-white/10 text-white px-3 py-2 rounded-lg font-semibold hover:bg-white/20 transition inline-flex items-center gap-2"
                                    >
                                        <Eye size={16} /> View
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Booking Modal */}
            {selectedTour && (
                <BookingModal
                    isOpen={isBookingOpen}
                    onClose={() => {
                        setIsBookingOpen(false)
                        setSelectedTour(null)
                    }}
                    tourName={selectedTour.name}
                    tourDetails={selectedTour.details}
                    tourId={selectedTour.id}
                    lockedDate={selectedTour.lockedDate}
                />
            )}
        </section>
    )
}

export default UpcomingTours
