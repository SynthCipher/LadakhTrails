import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { Trash2, Edit2, X, Eye, Upload, LogOut, Plus, Mountain, Home, Locate, LocationEditIcon, ClipboardList } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const AdminTours = () => {
    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
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
    const [selectedTour, setSelectedTour] = useState(null)
    const [showAddBookingForm, setShowAddBookingForm] = useState(false)
    const [manualBookingData, setManualBookingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        numberOfPeople: 1,
        status: 'confirmed', // Default to confirmed for offline/admin bookings
        paymentStatus: 'paid',
        paymentOption: 'offline',
        specialRequests: 'Offline Booking (Admin)'
    })



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
        const storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
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

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin`, {
                email,
                password
            })
            if (response.data.success) {
                sessionStorage.setItem('token', response.data.token)
                setToken(response.data.token)
                setIsAuthenticated(true)
                toast.success('Login successful')
                fetchTours()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        setIsAuthenticated(false)
        setToken('')
        setEmail('')
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

    const handleManualBookingSubmit = async (e) => {
        e.preventDefault()
        if (!selectedTour) return

        try {
            setLoading(true)
            const payload = {
                tourId: selectedTour._id,
                tourName: selectedTour.tourName,
                fullName: manualBookingData.fullName,
                email: manualBookingData.email,
                phone: manualBookingData.phone,
                numberOfPeople: manualBookingData.numberOfPeople,
                tourDate: `${selectedTour.startDate} - ${selectedTour.endDate}`,
                startDate: selectedTour.startDate,
                endDate: selectedTour.endDate,
                status: manualBookingData.status,
                paymentStatus: manualBookingData.paymentStatus,
                paymentOption: manualBookingData.paymentOption,
                specialRequests: manualBookingData.specialRequests
            }

            const res = await axios.post(`${backendUrl}/api/tour/booking/add`, payload)
            if (res.data.success) {
                toast.success('Offline booking added successfully')
                setShowAddBookingForm(false)
                setManualBookingData({
                    fullName: '',
                    email: '',
                    phone: '',
                    numberOfPeople: 1,
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    paymentOption: 'offline',
                    specialRequests: 'Offline Booking (Admin)'
                })
                // Refresh data
                fetchTourBookings(selectedTour._id)
                fetchTours()
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error('Error adding booking:', error)
            toast.error('Failed to add booking')
        } finally {
            setLoading(false)
        }
    }

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const res = await axios.put(`${backendUrl}/api/tour/booking/status`, { bookingId, status }, {
                headers: {
                    'Content-Type': 'application/json',
                    token: token
                }
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

    const imageInputRef = useRef(null)

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
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                placeholder="Enter admin email"
                            />
                        </div>
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
                <div className="bg-white rounded-2xl shadow-lg p-8  max-sm:px-4  mb-8">
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
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Upload size={20} className="text-blue-600" />
                                Tour Image
                            </p>

                            {/* Hidden native input */}
                            <input
                                ref={imageInputRef}
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                                required={!editingId && !imagePreview}
                            />

                            {/* Clickable area fills the whole box */}
                            <button
                                type="button"
                                onClick={() => imageInputRef.current && imageInputRef.current.click()}
                                className="w-full h-40 md:h-48 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-100/60 hover:bg-blue-100 hover:border-blue-400 transition"
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition">
                                            <span className="text-white font-semibold text-sm">
                                                Click to change image
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setImageFile(null)
                                                setImagePreview(null)
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center px-4">
                                        <Upload size={32} className="text-blue-500 mb-2" />
                                        <p className="text-sm font-semibold text-blue-900">
                                            Click anywhere here to upload an image
                                        </p>
                                        <p className="text-xs text-blue-700 mt-1">
                                            JPG, PNG, WEBP • Recommended size 1200×800
                                        </p>
                                    </div>
                                )}
                            </button>
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
                <div className="bg-white rounded-2xl shadow-lg p-8 max-sm:px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                            <LocationEditIcon className="w-8 h-8" />
                            <span>Tours ({tours.length})</span>
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
                        <div className="space-y-12">
                            {/* Active Tours Section */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                    Active Tours ({tours.filter(t => t.endDate >= today).length})
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {tours.filter(t => t.endDate >= today).map(tour => (
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
                                                        onClick={() => {
                                                            setSelectedTour(tour);
                                                            fetchTourBookings(tour._id);
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition"
                                                    >
                                                        <Eye size={18} />
                                                        Applicants
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleEditTour(tour);
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }}
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
                            </div>

                            {/* Completed Tours Section */}
                            {tours.filter(t => t.endDate < today).length > 0 && (
                                <div className="pt-8 border-t-2 border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
                                        Completed Tours ({tours.filter(t => t.endDate < today).length})
                                    </h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {tours.filter(t => t.endDate < today).map(tour => (
                                            <div
                                                key={tour._id}
                                                className="border-2 border-gray-200 rounded-xl overflow-hidden grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-500"
                                            >
                                                {/* Tour Image */}
                                                {tour.image && (
                                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                                        <img
                                                            src={tour.image}
                                                            alt={tour.tourName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                            Closed
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-gray-500 mb-2 italic">{tour.tourName} (Completed)</h3>

                                                    {/* Date Row */}
                                                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                                                        <p className="text-xs text-gray-600 font-semibold">Dates</p>
                                                        <p className="text-gray-500 font-medium">Ended on {tour.endDate}</p>
                                                    </div>

                                                    {/* Seats Information (Summary Only) */}
                                                    <div className="bg-gray-50 p-3 rounded-lg mb-4 flex justify-between items-center text-sm">
                                                        <span className="text-gray-600 font-semibold">Total Passengers:</span>
                                                        <span className="font-bold text-gray-800">{bookingCounts[tour._id] || 0}</span>
                                                    </div>

                                                    {/* Action Buttons (Limited) */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTour(tour);
                                                                fetchTourBookings(tour._id);
                                                            }}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
                                                        >
                                                            <Eye size={18} />
                                                            View History / Applicants
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bookings Modal */}
            {selectedTourBookings !== null && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-6 flex justify-between items-center rounded-t-3xl">
                            <h3 className="flex flex-col gap-1 text-2xl font-bold">
                                {/* Top line */}
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="w-7 h-7 text-white" />
                                    <span>Tour Applicants</span>
                                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                        {selectedTourBookings.reduce((sum, b) => sum + (b.numberOfPeople || 0), 0)} Applicants
                                    </span>
                                </div>

                                {/* Tour name line */}
                                <span className="text-sm font-medium text-purple-100 ml-10">
                                    {selectedTour?.tourName}
                                </span>
                            </h3>

                            <div className="flex items-center gap-3">
                                {selectedTour && new Date(selectedTour.endDate) < new Date(today) && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Completed / Read Only
                                    </span>
                                )}
                                <button
                                    onClick={() => setShowAddBookingForm(!showAddBookingForm)}
                                    disabled={selectedTour && new Date(selectedTour.endDate) < new Date(today)}
                                    className={`px-4 py-2 rounded-lg font-bold transition text-sm flex items-center gap-2 ${showAddBookingForm
                                        ? 'bg-white/20 hover:bg-white/30'
                                        : (selectedTour && new Date(selectedTour.endDate) < new Date(today)
                                            ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                            : 'bg-green-500 hover:bg-green-600')}`}
                                >
                                    {showAddBookingForm ? 'Cancel All' : 'Add Offline Booking'}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTourBookings(null)
                                        setShowAddBookingForm(false)
                                    }}
                                    className="p-2 rounded-full hover:bg-white/20 transition"
                                >
                                    <X size={26} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                            {showAddBookingForm ? (
                                <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <Upload size={20} className="text-purple-600" />
                                        New Manual Booking
                                    </h4>
                                    <form onSubmit={handleManualBookingSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={manualBookingData.fullName}
                                                onChange={e => setManualBookingData(prev => ({ ...prev, fullName: e.target.value }))}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={manualBookingData.email}
                                                    onChange={e => setManualBookingData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={manualBookingData.phone}
                                                    onChange={e => setManualBookingData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Number of People *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={manualBookingData.numberOfPeople}
                                                    onChange={e => setManualBookingData(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) || 1 }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Option</label>
                                                <select
                                                    value={manualBookingData.paymentOption}
                                                    onChange={e => setManualBookingData(prev => ({ ...prev, paymentOption: e.target.value }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                >
                                                    <option value="offline">Offline / Cache</option>
                                                    <option value="full">Full Payment Online</option>
                                                    <option value="partial">30% Advance</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
                                                <select
                                                    value={manualBookingData.paymentStatus}
                                                    onChange={e => setManualBookingData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                >
                                                    <option value="paid">Paid</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Status</label>
                                                <select
                                                    value={manualBookingData.status}
                                                    onChange={e => setManualBookingData(prev => ({ ...prev, status: e.target.value }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests / Notes</label>
                                            <textarea
                                                value={manualBookingData.specialRequests}
                                                onChange={e => setManualBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                rows="2"
                                                placeholder="e.g. Dietary requirements or offline payment details"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition mt-4 disabled:opacity-50"
                                        >
                                            {loading ? 'Adding Booking...' : 'Add Booking'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                selectedTourBookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <ClipboardList size={48} className="mb-4 opacity-20" />
                                        <p className="text-lg font-medium">No bookings found for this tour yet.</p>
                                    </div>
                                ) : (
                                    selectedTourBookings.map((booking, idx) => (
                                        <div
                                            key={booking._id}
                                            className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition mb-4"
                                        >
                                            {/* Card Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-800">
                                                        #{idx + 1} {booking.fullName}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Applied on {new Date(booking.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`px-4 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.status === "cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">

                                                <p><span className="font-semibold">Email:</span> {booking.email}</p>
                                                <p><span className="font-semibold">Phone:</span> {booking.phone}</p>
                                                <p><span className="font-semibold">People:</span> {booking.numberOfPeople}</p>

                                                <p>
                                                    <span className="font-semibold">Dates:</span>{" "}
                                                    {booking.startDate
                                                        ? `${formatShortDate(booking.startDate)} — ${formatShortDate(booking.endDate) || ""}`
                                                        : booking.tourDate}
                                                </p>

                                                {booking.durationDays && (
                                                    <p>
                                                        <span className="font-semibold">Duration:</span>{" "}
                                                        {booking.durationDays} days
                                                    </p>
                                                )}

                                                <p>
                                                    <span className="font-semibold">Payment Option:</span>{" "}
                                                    {booking.paymentOption === "partial"
                                                        ? "30% Advance + Remaining at Start"
                                                        : booking.paymentOption === "full"
                                                            ? "Full Payment Online"
                                                            : "Offline / Not Set"}
                                                </p>

                                                <p>
                                                    <span className="font-semibold">Payment Status:</span>{" "}
                                                    {booking.paymentStatus || "pending"}
                                                </p>

                                                {typeof booking.totalAmount === "number" && (
                                                    <p>
                                                        <span className="font-semibold">Total Amount:</span> ₹{booking.totalAmount}
                                                    </p>
                                                )}

                                                {typeof booking.advanceAmount === "number" && (
                                                    <p>
                                                        <span className="font-semibold">Advance Paid:</span> ₹{booking.advanceAmount}
                                                        {booking.paymentOption === "partial" &&
                                                            booking.isAdvanceNonRefundable && (
                                                                <span className="text-xs text-red-600 font-semibold">
                                                                    {" "} (non-refundable)
                                                                </span>
                                                            )}
                                                    </p>
                                                )}

                                                {typeof booking.remainingAmount === "number" && booking.remainingAmount > 0 && (
                                                    <p>
                                                        <span className="font-semibold">Remaining:</span> ₹{booking.remainingAmount}
                                                    </p>
                                                )}

                                                {booking.specialRequests && (
                                                    <p className="md:col-span-2 bg-white p-3 rounded-lg border">
                                                        <span className="font-semibold">Special Requests:</span>{" "}
                                                        {booking.specialRequests}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status Action */}
                                            <div className="mt-5 flex items-center gap-3">
                                                <label className="text-sm font-semibold">Update Status:</label>
                                                <select
                                                    value={booking.status}
                                                    disabled={selectedTour && new Date(selectedTour.endDate) < new Date(today)}
                                                    onChange={(e) =>
                                                        changeBookingStatus(booking._id, e.target.value)
                                                    }
                                                    className={`px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 ${selectedTour && new Date(selectedTour.endDate) < new Date(today) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))
                                )
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
