import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import BookingModal from '../components/BookingModal'

const Birding = () => {
    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [activeTour, setActiveTour] = useState(null)

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/tour/type/${encodeURIComponent('Birding')}`, { params: { planned: true } })
                const d = res.data
                if (d.success && d.tours && d.tours.length > 0) setActiveTour(d.tours[0])
            } catch (e) {
                console.error(e)
                if (e.code === 'ERR_NETWORK' || e.request) {
                    toast.error(`Cannot reach backend API — ensure backend server is running on ${backendUrl}`)
                } else {
                    toast.error('Error fetching planned Birding tours')
                }
            }
        }
        fetchTour()
    }, [backendUrl])

    const tourDetails = {
        duration: activeTour ? `${activeTour.startDate} to ${activeTour.endDate}` : '9-12 Days',
        season: 'March - October',
        price: '₹50,000 - ₹75,000',
        difficulty: 'Easy to Moderate',
        highlights: [
            'Bar-headed Geese - Migratory geese crossing the Himalayas',
            'Black-necked Cranes - Rare and endangered crane species',
            'Lammergeier - Majestic vultures soaring high',
            'Tibetan Sandgrouse - Desert birds of high plateaus',
            'Brown-winged Eagles - Rare high-altitude eagles',
            'Finches & Warblers - 50+ species of smaller birds',
            'Photography Opportunities - Capture stunning bird moments',
            'Expert Ornithologists - Learn from bird experts'
        ],
        inclusions: [
            'Accommodation',
            'All Meals',
            'Expert Ornithologist Guide',
            'Transport & Transfers',
            'Binoculars Provided',
            'Bird Identification Books'
        ]
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl font-bold mb-4">🦅 Birding Tour</h1>
                        <p className="text-xl">Paradise for ornithologists - spot over 200 bird species in pristine habitats</p>
                    </div>
                </section>

                {/* Tour Details */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tour Overview</h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Ladakh is a birdwatcher's paradise with diverse habitats ranging from high altitude lakes to alpine meadows. Our Birding Tour is specially designed for ornithologists and bird photography enthusiasts to experience the incredible avian diversity of the Himalayas.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                With expert ornithologists as guides, you'll have the best opportunity to spot rare and endemic bird species throughout the year.
                            </p>

                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Birding Highlights</h3>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Bar-headed Geese - Migratory geese crossing the Himalayas',
                                    'Black-necked Cranes - Rare and endangered crane species',
                                    'Lammergeier - Majestic vultures soaring high',
                                    'Tibetan Sandgrouse - Desert birds of high plateaus',
                                    'Brown-winged Eagles - Rare high-altitude eagles',
                                    'Finches & Warblers - 50+ species of smaller birds',
                                    'Photography Opportunities - Capture stunning bird moments',
                                    'Expert Ornithologists - Learn from bird experts'
                                ].map((highlight, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-purple-600 mr-3 text-xl">✓</span>
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Duration & Price */}
                            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-purple-600">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tour Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="text-2xl font-bold text-purple-600">9-12 Days</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Best Season</p>
                                        <p className="text-2xl font-bold text-purple-600">March - October</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price Range</p>
                                        <p className="text-2xl font-bold text-purple-600">₹50,000 - ₹75,000</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Difficulty Level</p>
                                        <p className="text-2xl font-bold text-purple-600">Easy to Moderate</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inclusions */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">What's Included</h3>
                                <ul className="space-y-2">
                                    {['Accommodation', 'All Meals', 'Expert Ornithologist Guide', 'Transport & Transfers', 'Binoculars Provided', 'Bird Identification Books'].map((item, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <span className="text-purple-600 mr-3">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            {activeTour ? (
                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-300">
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
                                { day: 'Day 1-2', title: 'Arrival & Orientation', desc: 'Settle in Leh, bird identification workshop, equipment check' },
                                { day: 'Day 3-4', title: 'Pangong Lake Birds', desc: 'Early morning birding at Pangong, spot migratory geese and cranes' },
                                { day: 'Day 5-6', title: 'Nubra Valley Birding', desc: 'Explore diverse bird habitats, spot sandgrouse and eagles' },
                                { day: 'Day 7-8', title: 'High Altitude Birding', desc: 'Trek to alpine zones for high-altitude endemic species' },
                                { day: 'Day 9', title: 'Wetland Exploration', desc: 'Visit important wetlands and water bodies for waterfowl' },
                                { day: 'Day 10', title: 'Photography Workshop', desc: 'Learn bird photography techniques from experts' },
                                { day: 'Day 11', title: 'Rest & Documentation', desc: 'Compile bird sightings and prepare documentation' },
                                { day: 'Day 12', title: 'Departure', desc: 'Departure with unforgettable birding memories' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
                                    <div className="flex items-start gap-4">
                                        <span className="text-lg font-bold text-purple-600 flex-shrink-0">{item.day}</span>
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

                {/* Bird Species Section */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">Common Bird Species You Might Spot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'Bar-headed Goose', season: 'March - October', rarity: 'Common' },
                            { name: 'Black-necked Crane', season: 'September - April', rarity: 'Rare' },
                            { name: 'Lammergeier', season: 'Year-round', rarity: 'Uncommon' },
                            { name: 'Tibetan Sandgrouse', season: 'April - August', rarity: 'Uncommon' },
                            { name: 'Brown-winged Eagle', season: 'Year-round', rarity: 'Rare' },
                            { name: 'Bearded Reedling', season: 'March - October', rarity: 'Common' }
                        ].map((bird, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
                                <h4 className="font-bold text-lg text-gray-800 mb-2">{bird.name}</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold text-gray-700">Season:</span> {bird.season}</p>
                                    <p><span className="font-semibold text-gray-700">Rarity:</span> <span className="text-purple-600 font-semibold">{bird.rarity}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                tourName="Birding Tour"
                tourDetails={tourDetails}
            />
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                tourName={activeTour ? activeTour.tourName : 'Birding Tour'}
                tourDetails={tourDetails}
                tourId={activeTour ? activeTour._id : undefined}
                lockedDate={activeTour ? `${activeTour.startDate} - ${activeTour.endDate}` : undefined}
            />
        </>
    )
}

export default Birding
