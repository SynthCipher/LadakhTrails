import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Trash2, Edit2, X, Eye, Upload, LogOut, Plus, Mountain, Home, Locate, LocationEditIcon } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const AdminTours = () => {
    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [tours, setTours] = useState([])
    const [formData, setFormData] = useState({
        tourName: '',
        tourType: 'General',
        startDate: '',
        endDate: '',
        price: '',
        availableSeats: '',
        description: '',
        highlights: '',
        isPlanned: false,
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedTourBookings, setSelectedTourBookings] = useState(null)
    const [selectedTourId, setSelectedTourId] = useState(null)
    const [bookingsLoading, setBookingsLoading] = useState(false)
    const [bookingCounts, setBookingCounts] = useState({})

    // today's date in YYYY-MM-DD for date input min attributes
    const today = new Date().toISOString().split('T')[0]

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

    // Fetch tours from backend
    const fetchTours = useCallback(async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/tour/all`)
            const data = response.data
            if (data.success) {
                setTours(data.tours)
            } else {
                toast.error('Error fetching tours')
            }
        } catch (error) {
            console.error('Error fetching tours:', error)
            toast.error('Failed to fetch tours')
        }
    }, [backendUrl])

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuthenticated')
        if (auth === 'true') {
            setIsAuthenticated(true)
            fetchTours()
        }
    }, [fetchTours])

    useEffect(() => {
        // refresh booking counts whenever tours change
        if (tours.length > 0) {
            const promises = tours.map(t => axios.get(`${backendUrl}/api/tour/booking/count/${t._id}`)
                .then(res => ({ id: t._id, count: res.data && res.data.success ? res.data.count : 0 }))
                .catch(() => ({ id: t._id, count: 0 }))
            )
            Promise.all(promises).then(results => {
                const map = {}
                results.forEach(r => map[r.id] = r.count)
                setBookingCounts(map)
            })
        }
    }, [tours, backendUrl])

    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(fetchTours, 3000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated, fetchTours])

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === '12345678') {
            sessionStorage.setItem('adminAuthenticated', 'true')
            // save password to allow status updates to backend (falls back to header auth)
            sessionStorage.setItem('adminPassword', password)
            setIsAuthenticated(true)
            setPassword('')
            fetchTours()
            toast.success('Login successful!')
        } else {
            toast.error('Invalid password')
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuthenticated')
        sessionStorage.removeItem('adminPassword')
        setIsAuthenticated(false)
        setPassword('')
        toast.info('Logged out successfully')
    }

    // Fetch bookings for a specific tour
    const fetchTourBookings = async (tourId) => {
        try {
            setBookingsLoading(true)
            setSelectedTourId(tourId)
            const response = await axios.get(`${backendUrl}/api/tour/booking/${tourId}`)
            const data = response.data
            if (data.success) {
                setSelectedTourBookings(data.bookings)
            } else {
                toast.error('Error fetching bookings')
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
            toast.error('Failed to fetch bookings')
        } finally {
            setBookingsLoading(false)
        }
    }

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const adminPassword = sessionStorage.getItem('adminPassword')
            const res = await axios.put(`${backendUrl}/api/tour/booking/status`, { bookingId, status }, {
                headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword || '' }
            })
            const data = res.data
            if (data.success) {
                toast.success('Booking status updated')
                // refresh bookings and counts
                if (selectedTourId) await fetchTourBookings(selectedTourId)
                fetchTours()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error updating booking status:', error)
            toast.error('Failed to update booking status')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAddTour = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Validate dates: startDate must be today or in the future; endDate must be >= startDate
        try {
            if (!formData.startDate) {
                toast.error('Please provide a start date')
                setLoading(false)
                return
            }

            const start = new Date(formData.startDate).setHours(0, 0, 0, 0)
            const end = new Date(formData.endDate).setHours(0, 0, 0, 0)
            const todayDate = new Date(today).setHours(0, 0, 0, 0)

            if (start < todayDate) {
                toast.error('Start date must be today or in the future')
                setLoading(false)
                return
            }

            if (end < start) {
                toast.error('End date cannot be before start date')
                setLoading(false)
                return
            }

            const formDataToSend = new FormData()
            formDataToSend.append('tourName', formData.tourName)
            formDataToSend.append('tourType', formData.tourType)
            formDataToSend.append('startDate', formData.startDate)
            formDataToSend.append('endDate', formData.endDate)
            formDataToSend.append('price', formData.price)
            formDataToSend.append('availableSeats', formData.availableSeats)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('highlights', formData.highlights)
            formDataToSend.append('isPlanned', formData.isPlanned ? 'true' : 'false')
            if (imageFile) {
                formDataToSend.append('image', imageFile)
            }

            const url = editingId
                ? `${backendUrl}/api/tour/update/${editingId}`
                : `${backendUrl}/api/tour/add`

            const method = editingId ? 'PUT' : 'POST'

            const response = await axios({
                method: method,
                url,
                data: formDataToSend,
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            const data = response.data

            if (data.success) {
                toast.success(editingId ? 'Tour updated successfully!' : 'Tour added successfully!')
                setEditingId(null)
                setImageFile(null)
                setImagePreview(null)
                setFormData({
                    tourName: '',
                    tourType: 'General',
                    startDate: '',
                    endDate: '',
                    price: '',
                    availableSeats: '',
                    description: '',
                    highlights: '',
                    isPlanned: false,
                })
                fetchTours()
            } else {
                toast.error('Error saving tour: ' + data.message)
            }
        } catch (error) {
            console.error('Error saving tour:', error)
            toast.error('Failed to save tour')
        } finally {
            setLoading(false)
        }
    }

    const handleEditTour = (tour) => {
        setFormData({
            tourName: tour.tourName,
            tourType: tour.tourType,
            startDate: tour.startDate,
            endDate: tour.endDate,
            price: tour.price,
            availableSeats: tour.availableSeats,
            description: tour.description,
            highlights: tour.highlights,
            isPlanned: tour.isPlanned || false,
        })
        setImagePreview(tour.image || null)
        setEditingId(tour._id)
    }

    const handleDeleteTour = async (id) => {
        if (confirm('Are you sure you want to delete this tour?')) {
            try {
                setLoading(true)
                const response = await axios.delete(`${backendUrl}/api/tour/delete/${id}`)
                const data = response.data
                if (data.success) {
                    toast.success('Tour deleted successfully!')
                    fetchTours()
                } else {
                    toast.error('Error deleting tour')
                }
            } catch (error) {
                console.error('Error deleting tour:', error)
                toast.error('Failed to delete tour')
            } finally {
                setLoading(false)
            }
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
                    <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">Admin Login</h1>
                    <p className="text-center text-gray-600 mb-8">LadakhTrails Management</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                placeholder="Enter admin password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition duration-300"
                        >
                            Login
                        </button>
                    </form>
                </div>
                <ToastContainer position="bottom-right" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-lg md:text-3xl font-bold">
                            <Mountain className="inline-block mr-2" />
                            LadakhTrails Admin
                        </h1>
                        <p className="text-blue-100 text-xs md:text-sm">Tour Management Dashboard</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            <Home size={20} />
                            <span className='hidden sm:block'>Home</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold transition"
                        >
                            <LogOut size={20} />
                            <span className='hidden sm:block'>  Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Add/Edit Tour Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <Plus size={24} className="text-blue-600" />
                        {editingId ? 'Edit Tour' : 'Add New Tour'}
                    </h2>

                    <form onSubmit={handleAddTour} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tour Name *
                                </label>
                                <input
                                    type="text"
                                    name="tourName"
                                    value={formData.tourName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Ladakh Winter Adventure"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tour Type *
                                </label>
                                <select
                                    name="tourType"
                                    value={formData.tourType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="General">🏔️ General Tour</option>
                                    <option value="Wildlife">🐆 Wildlife Tour</option>
                                    <option value="Winter Sports">⛷️ Winter Sports</option>
                                    <option value="Birding">🦅 Birding Tour</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                    min={today}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    required
                                    min={formData.startDate || today}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Price Per Person *
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., ₹45,000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Available Seats *
                                </label>
                                <input
                                    type="number"
                                    name="availableSeats"
                                    value={formData.availableSeats}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 15"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tour description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Highlights (comma separated) *
                            </label>
                            <textarea
                                name="highlights"
                                value={formData.highlights}
                                onChange={handleInputChange}
                                required
                                rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Snow Leopard Tracking, Photography Opportunities, Expert Guides"
                            />
                            <div className="mt-3 flex items-center gap-3">
                                <input type="checkbox" id="isPlanned" checked={formData.isPlanned} onChange={(e) => setFormData(prev => ({ ...prev, isPlanned: e.target.checked }))} />
                                <label htmlFor="isPlanned" className="text-sm font-medium text-gray-700">Planned / Publish to site</label>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Upload size={20} className="text-blue-600" />
                                Tour Image
                            </label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="w-full"
                                required
                            />
                            {imagePreview && (
                                <div className="mt-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-40 h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null)
                                            setImagePreview(null)
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (editingId ? 'Update Tour' : 'Add Tour')}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null)
                                        setImageFile(null)
                                        setImagePreview(null)
                                        setFormData({
                                            tourName: '',
                                            tourType: 'General',
                                            startDate: '',
                                            endDate: '',
                                            price: '',
                                            availableSeats: '',
                                            description: '',
                                            highlights: '',
                                        })
                                    }}
                                    className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tours List Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            <LocationEditIcon /> Tours ({tours.length})
                        </h2>
                        <button
                            onClick={fetchTours}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                            Refresh
                        </button>
                    </div>

                    {tours.length === 0 ? (
                        <p className="text-gray-600 text-center py-12">No tours added yet. Create your first tour above!</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {tours.map(tour => (
                                <div
                                    key={tour._id}
                                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
                                >
                                    {/* Tour Image */}
                                    {tour.image && (
                                        <div className="relative h-48 overflow-hidden bg-gray-200">
                                            <img
                                                src={tour.image}
                                                alt={tour.tourName}
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {tour.tourType}
                                            </div>
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${tour.isPlanned ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                                {tour.isPlanned ? 'Planned' : 'Draft'}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.tourName}</h3>

                                        {/* Date & Price Row */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600 font-semibold">Dates</p>
                                                <p className="font-bold text-gray-800">{tour.startDate}</p>
                                                <p className="text-sm text-gray-700">to {tour.endDate}</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600 font-semibold">Price</p>
                                                <p className="font-bold text-green-700 text-lg">{tour.price}</p>
                                            </div>
                                        </div>

                                        {/* Seats Information */}
                                        <div className="bg-orange-50 p-3 rounded-lg mb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">Available Seats</p>
                                                    <p className="font-bold text-lg text-orange-700">{tour.availableSeats} seats</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-600 font-semibold">Booked</p>
                                                    <p className="font-bold text-lg text-red-600">{bookingCounts[tour._id] || 0} / {tour.availableSeats}</p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                                                {(() => {
                                                    const booked = bookingCounts[tour._id] || 0
                                                    const seats = Number(tour.availableSeats) || 0
                                                    const percent = seats > 0 ? Math.round((booked / seats) * 100) : 0
                                                    return <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                                                })()}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{tour.description}</p>

                                        {/* Highlights */}
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">Highlights:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {tour.highlights.split(',').slice(0, 3).map((h, idx) => (
                                                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                                        {h.trim()}
                                                    </span>
                                                ))}
                                                {tour.highlights.split(',').length > 3 && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                                        +{tour.highlights.split(',').length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => fetchTourBookings(tour._id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition"
                                            >
                                                <Eye size={18} />
                                                Applicants
                                            </button>
                                            <button
                                                onClick={() => handleEditTour(tour)}
                                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTour(tour._id)}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bookings Modal */}
            {selectedTourBookings !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 flex justify-between items-center">
                            <h3 className="text-2xl font-bold">📋 Tour Applicants</h3>
                            <button
                                onClick={() => setSelectedTourBookings(null)}
                                className="p-1 hover:bg-purple-700 rounded transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {bookingsLoading ? (
                                <p className="text-center text-gray-600">Loading applicants...</p>
                            ) : selectedTourBookings.length === 0 ? (
                                <p className="text-center text-gray-600">No applicants for this tour yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    <p className="font-semibold text-gray-800 bg-blue-50 p-3 rounded-lg">
                                        Total Applicants: {selectedTourBookings.length}
                                    </p>
                                    {selectedTourBookings.map((booking, idx) => (
                                        <div key={booking._id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">#{idx + 1} {booking.fullName}</h4>
                                                    <p className="text-sm text-gray-600">Applied on {new Date(booking.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                                <p><span className="font-semibold">Email:</span> {booking.email}</p>
                                                <p><span className="font-semibold">Phone:</span> {booking.phone}</p>
                                                <p><span className="font-semibold">People:</span> {booking.numberOfPeople}</p>
                                                <p><span className="font-semibold">Date:</span> {booking.startDate ? `${formatShortDate(booking.startDate)} — ${formatShortDate(booking.endDate) || ''}` : booking.tourDate}</p>
                                                {booking.durationDays && <p><span className="font-semibold">Duration:</span> {booking.durationDays} days</p>}
                                                {booking.specialRequests && (
                                                    <p className="col-span-2"><span className="font-semibold">Requests:</span> {booking.specialRequests}</p>
                                                )}
                                                <div className="col-span-2 mt-3">
                                                    <label className="text-xs font-semibold mr-2">Status:</label>
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                                        className="p-2 rounded-md border border-gray-300"
                                                    >
                                                        <option value="pending">pending</option>
                                                        <option value="confirmed">confirmed</option>
                                                        <option value="cancelled">cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default AdminTours
