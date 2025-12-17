import React from 'react'

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">Terms & Conditions</h1>
                    <p className="text-xl">Please read these terms carefully before booking with LadakhTrails</p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                    {/* Introduction */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms and Conditions ("Terms") govern your booking and participation in tours and services offered by Namgail Tours ("Company"). By booking with us, you agree to abide by these terms. Please read them carefully.
                        </p>
                    </div>

                    {/* Booking & Reservations */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Booking & Reservations</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li><strong>Booking Process:</strong> Bookings are confirmed upon receipt of 30% advance payment. A booking confirmation email will be sent immediately.</li>
                            <li><strong>Balance Payment:</strong> The remaining 70% must be paid 15 days before tour departure.</li>
                            <li><strong>Documentation:</strong> Provide valid identification and travel documents. We are not responsible for immigration issues.</li>
                            <li><strong>Group Size:</strong> Minimum 2 participants per tour. Groups larger than 20 require special arrangements.</li>
                        </ul>
                    </div>

                    {/* Cancellation Policy */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Cancellation Policy</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li><strong>More than 30 days:</strong> Full refund minus 5% administrative charge</li>
                            <li><strong>15-30 days:</strong> 50% refund of tour cost</li>
                            <li><strong>Less than 15 days:</strong> No refund possible</li>
                            <li><strong>No-show:</strong> 100% forfeiture of booking amount</li>
                        </ul>
                    </div>

                    {/* Tour Modifications */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Tour Modifications</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We reserve the right to modify tour itineraries due to:
                        </p>
                        <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            <li>Bad weather conditions</li>
                            <li>Natural calamities</li>
                            <li>Road closures or landslides</li>
                            <li>Government restrictions</li>
                            <li>Safety concerns</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            In such cases, we will reschedule your tour or offer a full refund.
                        </p>
                    </div>

                    {/* Health & Safety */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Health & Safety</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li><strong>Medical Fitness:</strong> Participants must be in good health. Those with pre-existing conditions should consult their doctor.</li>
                            <li><strong>Altitude Sickness:</strong> We are not responsible for altitude-related illnesses. Follow guide's instructions for acclimatization.</li>
                            <li><strong>Insurance:</strong> We provide basic travel insurance. Additional insurance is recommended.</li>
                            <li><strong>Risk Assumption:</strong> Tour participation is at your own risk. You assume all risks of injury or loss.</li>
                            <li><strong>COVID-19:</strong> Follow current health guidelines and protocols applicable in Ladakh.</li>
                        </ul>
                    </div>

                    {/* Liability Limitation */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Liability Limitation</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Namgail Tours is not responsible for:
                        </p>
                        <ul className="space-y-2 text-gray-700 list-disc list-inside mt-3">
                            <li>Loss, theft, or damage to personal belongings</li>
                            <li>Flight delays or cancellations</li>
                            <li>Hotel overbooking or downgrades</li>
                            <li>Personal injuries unless caused by our negligence</li>
                            <li>Acts of God or force majeure</li>
                            <li>Third-party service providers' failures</li>
                        </ul>
                    </div>

                    {/* Guest Conduct */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Guest Conduct</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            Guests must:
                        </p>
                        <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            <li>Respect local culture and traditions</li>
                            <li>Follow guide's instructions for safety and itinerary</li>
                            <li>Not engage in illegal activities</li>
                            <li>Not consume excess alcohol during tours</li>
                            <li>Respect the environment and wildlife</li>
                            <li>Be respectful to staff and fellow travelers</li>
                        </ul>
                        <p className="text-gray-700 mt-3 font-semibold text-red-600">
                            Violation may result in immediate tour termination without refund.
                        </p>
                    </div>

                    {/* Pricing & Payments */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Pricing & Payments</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li><strong>Price Guarantee:</strong> Prices are valid at the time of booking confirmation.</li>
                            <li><strong>Price Changes:</strong> We reserve the right to adjust prices due to significant changes in fuel, permits, or government taxes.</li>
                            <li><strong>Payment Methods:</strong> We accept bank transfers, credit/debit cards, and UPI payments.</li>
                            <li><strong>Taxes:</strong> GST applicable as per current Indian tax laws.</li>
                        </ul>
                    </div>

                    {/* Intellectual Property */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Photos and videos taken during tours may be used by Namgail Tours for promotional purposes. If you object, please inform us in advance.
                        </p>
                    </div>

                    {/* Privacy Policy */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Your personal information is collected and used solely for tour arrangement and communication purposes. We do not share your data with third parties without consent. We are GDPR and DPDP Act compliant.
                        </p>
                    </div>

                    {/* Dispute Resolution */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Dispute Resolution</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li><strong>Grievance Procedure:</strong> Submit complaints within 48 hours of tour completion.</li>
                            <li><strong>Jurisdiction:</strong> These terms are governed by Indian law.</li>
                            <li><strong>Venue:</strong> All disputes shall be subject to exclusive jurisdiction of courts in Leh, Ladakh.</li>
                        </ul>
                    </div>

                    {/* Amendment */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Amendment of Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to amend these terms at any time. Continued use of our services signifies acceptance of amended terms.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                        <p className="text-gray-700 mb-2"><strong>Email:</strong> info@ladakhtrails.com</p>
                        <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91-XXXXX-XXXXX</p>
                        <p className="text-gray-700"><strong>Location:</strong> Leh, Ladakh, India</p>
                    </div>

                    {/* Acceptance */}
                    <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
                        <p className="text-gray-800">
                            <strong>Last Updated:</strong> December 2024
                        </p>
                        <p className="text-gray-700 mt-3">
                            By booking with LadakhTrails, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Book Your Adventure?</h2>
                    <p className="text-xl mb-8">By proceeding with booking, you agree to our terms and conditions</p>
                    <a
                        href="/"
                        className="inline-block bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition duration-300"
                    >
                        Browse Tours
                    </a>
                </div>
            </section>
        </div>
    )
}

export default TermsConditions
