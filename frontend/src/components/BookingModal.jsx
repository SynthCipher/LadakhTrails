import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { X, Calendar, DollarSign, BarChart, Sun, Phone, MapPin, Mountain } from 'lucide-react'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { BsWhatsapp } from 'react-icons/bs'

const BookingModal = ({ isOpen, onClose, tourName, tourDetails, tourId, lockedDate }) => {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        numberOfPeople: '1',
        specialRequests: '',
    })
    const [loading, setLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [paymentOption, setPaymentOption] = useState('partial') // 'partial' (30%) or 'full'

    const context = useContext(AppContext)
    const backendUrl = context?.backendUrl || 'http://localhost:8081'

    // helpers for date parsing/formatting
    const monthToNumber = (monthName) => {
        const m = monthName.toLowerCase()
        const map = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }
        // accept full month names too
        const short = m.slice(0, 3)
        return map[short] || '01'
    }

    const toIsoDate = React.useCallback((monthName, day, year) => {
        const mm = monthToNumber(monthName)
        const dd = String(day).padStart(2, '0')
        return `${year}-${mm}-${dd}`
    }, [])

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

    const computeDurationFromIso = React.useCallback((isoStart, isoEnd) => {
        try {
            const s = new Date(isoStart)
            const e = new Date(isoEnd)
            if (isNaN(s) || isNaN(e)) return ''
            const diff = Math.round((e - s) / (1000 * 60 * 60 * 24))
            return String(diff + 1)
        } catch {
            return ''
        }
    }, [])

    useEffect(() => {
        // If the modal is opened for a scheduled tour, prefill and lock the date
        if (isOpen && lockedDate) {
            // lockedDate expected in format "start - end" where start/end may be ISO (YYYY-MM-DD) or "MonthName D"
            const parts = lockedDate.split(' - ')
            const rawStart = (parts[0] || '').trim()
            const rawEnd = (parts[1] || '').trim()
            const currentYear = new Date().getFullYear()
            let isoStart = ''
            let isoEnd = ''

            const isoRegex = /^\d{4}-\d{2}-\d{2}$/
            if (isoRegex.test(rawStart) && isoRegex.test(rawEnd)) {
                isoStart = rawStart
                isoEnd = rawEnd
            } else {
                // try parsing formats like "January 1" or "Jan 1"
                try {
                    const sParts = rawStart.split(' ')
                    const eParts = rawEnd.split(' ')
                    const sMonth = sParts[0]
                    const sDay = parseInt(sParts[sParts.length - 1])
                    const eMonth = eParts[0]
                    const eDay = parseInt(eParts[eParts.length - 1])
                    isoStart = toIsoDate(sMonth, sDay, currentYear)
                    // if end has no month (like "8"), reuse start month
                    if (eParts.length === 1 || isNaN(parseInt(eParts[0]))) {
                        isoEnd = toIsoDate(sMonth, eDay, currentYear)
                    } else {
                        isoEnd = toIsoDate(eMonth, eDay, currentYear)
                    }
                } catch {
                    isoStart = rawStart
                    isoEnd = rawEnd
                }
            }

            const duration = computeDurationFromIso(isoStart, isoEnd)
            setFormData(prev => ({ ...prev, tourDateSlot: lockedDate, startDate: isoStart, endDate: isoEnd, durationDays: duration }))
        }
    }, [isOpen, lockedDate, toIsoDate, computeDurationFromIso])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePaymentOptionChange = (e) => {
        setPaymentOption(e.target.value)
    }




    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // ensure dates selected / provided
            if (!formData.startDate && !formData.tourDateSlot) {
                toast.error('Please select preferred tour dates')
                setLoading(false)
                return
            }

            // Calculate pricing
            const rawPrice = typeof tourDetails.price === 'string'
                ? tourDetails.price.replace(/[^0-9]/g, '')
                : tourDetails.price

            const priceNumber = Number(rawPrice || 0)
            if (!priceNumber || Number.isNaN(priceNumber)) {
                toast.error('Invalid tour price. Please contact support.')
                setLoading(false)
                return
            }

            const peopleCount = parseInt(formData.numberOfPeople)
            const totalAmount = priceNumber * peopleCount
            const advanceAmount = paymentOption === 'partial'
                ? Math.round(totalAmount * 0.3)
                : totalAmount
            const remainingAmount = totalAmount - advanceAmount

            // Save booking to MongoDB (info + payment preference, but no online payment yet)
            const bookingData = {
                tourId: tourId,
                tourName: tourName,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                numberOfPeople: peopleCount,
                tourDateSlot: formData.tourDateSlot,
                startDate: formData.startDate,
                endDate: formData.endDate,
                durationDays: formData.durationDays,
                specialRequests: formData.specialRequests,
                paymentOption,
                totalAmount,
                advanceAmount,
                remainingAmount,
                isAdvanceNonRefundable: paymentOption === 'partial',
                paymentStatus: 'pending',
            }

            const response = await axios.post(`${backendUrl}/api/tour/booking/add`, bookingData)
            const data = response.data

            if (!data.success) {
                toast.error('Error saving booking: ' + data.message)
                setLoading(false)
                return
            }

            toast.success('Booking saved successfully!')

            // Prepare WhatsApp message
            const message = `
LADAKHTRAILS - BOOKING REQUEST

Tour Details:
Tour: ${tourName}
Duration: ${tourDetails.duration}
Price: ${tourDetails.price}
Difficulty: ${tourDetails.difficulty}
Best Season: ${tourDetails.season}

Tour Highlights:
${tourDetails.highlights.map(h => `- ${h}`).join('\n')}

Inclusions:
${tourDetails.inclusions.map(i => `- ${i}`).join('\n')}

---

Booking Information:
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Number of People: ${formData.numberOfPeople}
Start Date: ${formatShortDate(formData.startDate) || 'Not specified'}
End Date: ${formatShortDate(formData.endDate) || 'Not specified'}
Duration: ${formData.durationDays ? formData.durationDays + ' days' : 'Not specified'}
Special Requests: ${formData.specialRequests || 'None'}

---

Payment Preference:
Option: ${paymentOption === 'partial' ? '30% Advance (non-refundable) + remaining at tour start' : 'Full payment on tour'}
Total Tour Amount: ₹${totalAmount}
Planned Advance Amount: ₹${advanceAmount}
Remaining Amount at Tour Start: ₹${remainingAmount}

---

Please confirm this booking and provide further instructions.

Thank you!
    `.trim()

            // Encode message for WhatsApp
            const encodedMessage = encodeURIComponent(message)

            // WhatsApp Business API or regular WhatsApp link
            const whatsappNumber = '919682574824'
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

            // Open WhatsApp
            window.open(whatsappURL, '_blank')

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                numberOfPeople: '1',
                tourDateSlot: '',
                startDate: '',
                endDate: '',
                durationDays: '',
                specialRequests: '',
            })
            setPaymentOption('partial')

            // Close modal
            onClose()
            toast.info('Opening WhatsApp...')
        } catch (error) {
            console.error('Error submitting booking:', error)
            toast.error('Failed to submit booking. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // helper to load Razorpay script dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
            document.body.appendChild(script)
        })
    }

    const handlePayNow = async () => {
        try {
            // basic validation
            if (!formData.fullName || !formData.email || !formData.phone || !formData.numberOfPeople) {
                toast.error('Please fill all required fields before payment')
                return
            }

            if (!formData.startDate && !formData.tourDateSlot) {
                toast.error('Please select preferred tour dates')
                return
            }

            setPaymentLoading(true)

            // 1) Calculate pricing
            const rawPrice = typeof tourDetails.price === 'string'
                ? tourDetails.price.replace(/[^0-9]/g, '')
                : tourDetails.price

            const priceNumber = Number(rawPrice || 0)
            if (!priceNumber || Number.isNaN(priceNumber)) {
                toast.error('Invalid tour price. Please contact support.')
                setPaymentLoading(false)
                return
            }

            const peopleCount = parseInt(formData.numberOfPeople)
            const totalAmount = priceNumber * peopleCount
            const advanceAmount = paymentOption === 'partial'
                ? Math.round(totalAmount * 0.3)
                : totalAmount
            const remainingAmount = totalAmount - advanceAmount

            // Razorpay maximum per order is typically 1,000,000 INR
            if (advanceAmount > 1000000) {
                toast.error('Advance amount exceeds online payment limit. Please contact us directly.')
                setPaymentLoading(false)
                return
            }

            // 2) Save booking first (with payment info)
            const bookingData = {
                tourId: tourId,
                tourName: tourName,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                numberOfPeople: peopleCount,
                tourDateSlot: formData.tourDateSlot,
                startDate: formData.startDate,
                endDate: formData.endDate,
                durationDays: formData.durationDays,
                specialRequests: formData.specialRequests,
                paymentOption,
                totalAmount,
                advanceAmount,
                remainingAmount,
                isAdvanceNonRefundable: paymentOption === 'partial',
                paymentStatus: paymentOption === 'partial' ? 'partial' : 'paid',
            }

            const bookingRes = await axios.post(`${backendUrl}/api/tour/booking/add`, bookingData)
            const bookingDataRes = bookingRes.data

            if (!bookingDataRes.success) {
                toast.error('Error saving booking: ' + bookingDataRes.message)
                setPaymentLoading(false)
                return
            }

            const booking = bookingDataRes.booking

            // 3) Create Razorpay order on backend (for advance or full amount)
            const paymentRes = await axios.post(`${backendUrl}/api/payment/create-order`, {
                amount: advanceAmount,
                currency: 'INR',
                bookingId: booking._id,
            })

            const paymentData = paymentRes.data

            if (!paymentData.success) {
                toast.error('Failed to start payment: ' + paymentData.message)
                setPaymentLoading(false)
                return
            }

            const loaded = await loadRazorpayScript()
            if (!loaded) {
                toast.error('Unable to load payment SDK. Please try again.')
                setPaymentLoading(false)
                return
            }

            const options = {
                key: paymentData.keyId,
                amount: paymentData.order.amount,
                currency: paymentData.order.currency,
                name: 'Namgail Tours',
                description: tourName,
                order_id: paymentData.order.id,
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    bookingId: booking._id,
                    tourName,
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${backendUrl}/api/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: booking._id,
                        })

                        if (verifyRes.data && verifyRes.data.success) {
                            toast.success('Payment successful! Your booking is confirmed.')
                            // Optional: also open WhatsApp for communication
                            // Prepare WhatsApp message
                            const message = `
LADAKHTRAILS - BOOKING REQUEST (${paymentOption === 'partial' ? 'ADVANCE PAID (30%)' : 'FULLY PAID'})

Tour Details:
Tour: ${tourName}
Duration: ${tourDetails.duration}
Price: ${tourDetails.price}
Difficulty: ${tourDetails.difficulty}
Best Season: ${tourDetails.season}

Tour Highlights:
${tourDetails.highlights.map(h => `- ${h}`).join('\n')}

Inclusions:
${tourDetails.inclusions.map(i => `- ${i}`).join('\n')}

---

Booking Information:
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Number of People: ${formData.numberOfPeople}
Start Date: ${formatShortDate(formData.startDate) || 'Not specified'}
End Date: ${formatShortDate(formData.endDate) || 'Not specified'}
Duration: ${formData.durationDays ? formData.durationDays + ' days' : 'Not specified'}
Special Requests: ${formData.specialRequests || 'None'}

---

Payment:
Total Tour Amount: ₹${totalAmount}
${paymentOption === 'partial'
        ? `Advance Paid Now (Non-Refundable 30%): ₹${advanceAmount}
Remaining to be Paid at Tour Start: ₹${remainingAmount}`
        : `Amount Paid Now (100%): ₹${advanceAmount}`
    }

Razorpay Payment ID: ${response.razorpay_payment_id}

Please confirm this booking and share further details.

Thank you!
                            `.trim()

                            const encodedMessage = encodeURIComponent(message)
                            const whatsappNumber = '919682574824'
                            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
                            window.open(whatsappURL, '_blank')

                            // Reset form and close modal
                            setFormData({
                                fullName: '',
                                email: '',
                                phone: '',
                                numberOfPeople: '1',
                                tourDateSlot: '',
                                startDate: '',
                                endDate: '',
                                durationDays: '',
                                specialRequests: '',
                            })
                            setPaymentOption('partial')
                            onClose()
                        } else {
                            toast.error('Payment verification failed. Please contact support.')
                        }
                    } catch (err) {
                        console.error('Payment verification error:', err)
                        toast.error('Payment verification failed. Please contact support.')
                    }
                },
                theme: {
                    color: '#2563eb',
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error('Error initializing payment:', error)
            toast.error('Failed to start payment. Please try again.')
        } finally {
            setPaymentLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <MapPin size={22} />
                        <h2 className="text-2xl font-bold">Book {tourName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-blue-700 p-1 rounded transition"
                    >
                        <X size={24} />
                    </button>
                </div>




                {/* Tour Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">
                        Tour Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Start Date */}
                        <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                            <Calendar className="text-blue-500" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Start Date</p>
                                <p className="font-bold text-blue-700">
                                    {formatShortDate(formData.startDate) || "To be selected"}
                                </p>
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                            <Calendar className="text-blue-500" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">End Date</p>
                                <p className="font-bold text-blue-700">
                                    {formatShortDate(formData.endDate) || "To be selected"}
                                </p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                            <BarChart className="text-orange-500" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Duration</p>
                                <p className="font-bold text-orange-600">
                                    {formData.durationDays
                                        ? `${formData.durationDays} Days`
                                        : tourDetails.duration}
                                </p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                            <DollarSign className="text-green-500" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Price</p>
                                <p className="font-bold text-green-600">
                                    {tourDetails.price} / person
                                </p>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                            <Mountain className="text-purple-500" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Category</p>
                                <p className="font-bold text-purple-600">
                                    {tourDetails.tourType}
                                </p>
                            </div>
                        </div>

                        {/* Best Season */}
                        {/* <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                            <Sun className="text-yellow-500" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Best Season</p>
                                <p className="font-bold text-yellow-600">
                                    {tourDetails.season}
                                </p>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Number of People *
                            </label>
                            <input
                                type="number"
                                name="numberOfPeople"
                                value={formData.numberOfPeople}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Preferred Tour Dates */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Preferred Tour Dates
                            </label>

                            {lockedDate ? (
                                <div>
                                    <div className="relative flex items-center">
                                        <Calendar
                                            size={18}
                                            className="absolute left-3 text-gray-400 pointer-events-none"
                                        />

                                        <input
                                            type="text"
                                            readOnly
                                            value={
                                                formData.startDate && formData.endDate
                                                    ? `${formatShortDate(formData.startDate)} – ${formatShortDate(formData.endDate)}`
                                                    : 'Not selected'
                                            }
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-00 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                                        />
                                    </div>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Dates are fixed for this scheduled tour
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}


                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Special Requests / Questions
                        </label>
                        <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Any special requests, dietary restrictions, or questions..."
                        />
                    </div>

                    {/* Payment option selection */}
                    <div className="border rounded-lg p-4 bg-blue-50 space-y-3">
                        <p className="text-sm font-semibold text-blue-900">
                            Payment Option
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentOption"
                                    value="partial"
                                    checked={paymentOption === 'partial'}
                                    onChange={handlePaymentOptionChange}
                                    className="mt-1"
                                />
                                <span className="text-sm text-gray-800">
                                    <span className="font-semibold">Book Seat with 30% Advance (Recommended)</span>
                                    <br />
                                    30% of the total tour cost is charged now to confirm your seat. This advance is{' '}
                                    <span className="font-semibold text-red-600">non-refundable</span>. The remaining 70% can be paid when the tour starts.
                                </span>
                            </label>
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentOption"
                                    value="full"
                                    checked={paymentOption === 'full'}
                                    onChange={handlePaymentOptionChange}
                                    className="mt-1"
                                />
                                <span className="text-sm text-gray-800">
                                    <span className="font-semibold">Pay Full Amount Now</span>
                                    <br />
                                    Pay 100% of the tour cost online now. This secures your booking in full.
                                </span>
                            </label>
                        </div>
                        <p className="text-xs text-gray-600">
                            Exact payable amount will be shown in the Razorpay checkout before you confirm the payment.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={loading || paymentLoading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <BsWhatsapp size={18} className="text-grey-400" />
                            <span>{loading ? 'Processing...' : 'Send via WhatsApp'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePayNow}
                            disabled={paymentLoading || loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                        >
                            {paymentLoading ? 'Opening Payment...' : 'Pay Now (Razorpay)'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading || paymentLoading}
                            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400 transition duration-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="space-y-1 pb-2">
                        <p className="text-xs font-bold text-center text-gray-600">
                            Note: Your booking will be saved before WhatsApp or payment.
                        </p>
                        <p className="text-xs text-center text-gray-500">
                            You can either send your booking via WhatsApp or pay securely online using Razorpay.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BookingModal
