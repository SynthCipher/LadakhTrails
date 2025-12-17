import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            category: 'General Questions',
            items: [
                {
                    question: 'What is the best time to visit Ladakh?',
                    answer: 'The best time to visit Ladakh is from May to September for general and wildlife tours. Winter (December-February) is ideal for winter sports and snow activities. Bird watching is excellent from March to October.'
                },
                {
                    question: 'Do I need any special permits to visit Ladakh?',
                    answer: 'For Indian nationals, no special permits are required. Foreign nationals may need Inner Line Permits (ILP) for certain areas. We provide all necessary documentation and guidance.'
                },
                {
                    question: 'What is the altitude of Ladakh?',
                    answer: 'Leh city is at 11,562 feet (3,524m) above sea level. Some locations we visit are even higher. We recommend acclimatization on arrival.'
                }
            ]
        },
        {
            category: 'Tour Details',
            items: [
                {
                    question: 'What is included in the tour packages?',
                    answer: 'Our packages include accommodation, meals (breakfast & dinner), transportation, professional guides, entry fees, and travel insurance. Specific inclusions vary by tour type.'
                },
                {
                    question: 'Can I customize my tour itinerary?',
                    answer: 'Absolutely! We offer flexible and customizable itineraries based on your preferences, budget, and interests. Contact us to create your perfect tour.'
                },
                {
                    question: 'What group sizes do you operate?',
                    answer: 'We operate tours for groups ranging from 2-20 people. Private tours for smaller groups are also available with custom arrangements.'
                },
                {
                    question: 'Do you provide guides and support?',
                    answer: 'Yes, all tours include expert local guides fluent in English and Hindi. We also provide 24/7 customer support throughout your tour.'
                }
            ]
        },
        {
            category: 'Health & Safety',
            items: [
                {
                    question: 'Is it safe to visit Ladakh?',
                    answer: 'Ladakh is very safe for tourists. We follow all safety protocols, provide comprehensive travel insurance, and have experienced teams trained in first aid and emergency response.'
                },
                {
                    question: 'What about altitude sickness?',
                    answer: 'Altitude sickness is possible due to high elevation. We recommend 1-2 days acclimatization in Leh. Stay hydrated, avoid heavy meals, and inform your guide about any symptoms.'
                },
                {
                    question: 'What medical facilities are available?',
                    answer: 'Leh has a government hospital and private clinics. We have tie-ups with medical facilities and evacuation services. Emergency evacuation to Delhi is available if needed.'
                },
                {
                    question: 'What should I pack for the tour?',
                    answer: 'Pack warm clothing, sunscreen, high SPF sunglasses, comfortable trekking shoes, water bottle, medications, and camera. We provide a detailed packing list upon booking.'
                }
            ]
        },
        {
            category: 'Booking & Cancellation',
            items: [
                {
                    question: 'How do I book a tour?',
                    answer: 'You can book by contacting us via phone, email, or through our website. We\'ll guide you through the booking process and answer any questions.'
                },
                {
                    question: 'What is your cancellation policy?',
                    answer: 'Free cancellation up to 30 days before departure. 50% refund for 15-30 days cancellation. No refund for cancellations within 15 days.'
                },
                {
                    question: 'Do you accept payment plans?',
                    answer: 'Yes, we offer flexible payment plans. A 30% advance payment secures your booking, with the balance due 15 days before departure.'
                },
                {
                    question: 'What if the tour is cancelled due to bad weather?',
                    answer: 'We\'ll reschedule your tour or provide a full refund if the tour cannot proceed due to force majeure events.'
                }
            ]
        },
        {
            category: 'Accommodation & Food',
            items: [
                {
                    question: 'What type of accommodations are provided?',
                    answer: 'We arrange comfortable 3-4 star hotels in major cities and well-maintained guesthouses in remote areas. All accommodations have basic amenities and clean facilities.'
                },
                {
                    question: 'Is vegetarian food available?',
                    answer: 'Yes, we cater to all dietary preferences including vegetarian, vegan, and specific allergies. Please inform us during booking.'
                },
                {
                    question: 'Will I get good internet connectivity?',
                    answer: 'Internet is available in most towns, though connectivity can be patchy in remote areas. We have backup arrangements for emergencies.'
                }
            ]
        }
    ]

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl">Find answers to common questions about our tours and services</p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                {faqs.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-600 pb-3">
                            {section.category}
                        </h2>
                        <div className="space-y-3">
                            {section.items.map((faq, faqIdx) => {
                                const globalIndex = `${sectionIdx}-${faqIdx}`
                                const isOpen = openIndex === globalIndex

                                return (
                                    <div
                                        key={globalIndex}
                                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(globalIndex)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition duration-200"
                                        >
                                            <span className="text-lg font-semibold text-gray-800 text-left">
                                                {faq.question}
                                            </span>
                                            <ChevronDown
                                                size={24}
                                                className={`text-blue-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
                    <p className="text-xl mb-8">Our team is here to help! Reach out to us anytime.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="tel:+91-XXXXX-XXXXX" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                            Call Us
                        </a>
                        <a href="mailto:info@ladakhtrails.com" className="inline-block bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition">
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FAQ
