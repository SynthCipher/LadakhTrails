import React from 'react'
import { Globe, Users, Award, Shield, Target, Eye, Heart, Star } from 'lucide-react'

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">About Ladakh Trails</h1>
                    <p className="text-xl">Your trusted partner for unforgettable Ladakh adventures since 2020</p>
                </div>
            </section>

            {/* Company Story */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Ladakh Trails was founded with a passion for showcasing the untouched beauty of Ladakh to the world. What started as a small venture has grown into one of the most trusted tour operators in the region.
                        </p>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Our founders, with deep roots in Ladakh and decades of experience in the travel industry, envisioned creating tours that go beyond typical sightseeing. We wanted to create transformative experiences that connect travelers with the soul of Ladakh.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Today, Ladakh Trails operates with a team of local guides, experienced drivers, and hospitality professionals who are deeply committed to making your Ladakh journey unforgettable.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-8 text-white">
                        <div className="space-y-6">
                            <div>
                                <p className="text-5xl font-bold">5000+</p>
                                <p className="text-lg">Happy Travelers</p>
                            </div>
                            <div>
                                <p className="text-5xl font-bold">50+</p>
                                <p className="text-lg">Experienced Guides</p>
                            </div>
                            <div>
                                <p className="text-5xl font-bold">4</p>
                                <p className="text-lg">Specialized Tours</p>
                            </div>
                            <div>
                                <p className="text-5xl font-bold">15+</p>
                                <p className="text-lg">Years Experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-gray-100 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Mission & Vision</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="text-blue-600" size={32} />
                                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                To provide authentic, sustainable, and transformative travel experiences in Ladakh that create lasting memories while preserving the region's natural beauty and cultural heritage for future generations.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="text-blue-600" size={32} />
                                <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                To be recognized as Ladakh's most responsible and innovative tour operator, setting industry standards for sustainable tourism while empowering local communities and protecting the Himalayan ecosystem.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Globe, title: 'Sustainability', desc: 'Committed to protecting Ladakh\'s pristine environment' },
                        { icon: Users, title: 'Community', desc: 'Supporting local communities and their livelihoods' },
                        { icon: Star, title: 'Excellence', desc: 'Delivering exceptional quality in every tour' },
                        { icon: Shield, title: 'Safety', desc: 'Prioritizing traveler safety and well-being' }
                    ].map((value, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-blue-600 flex flex-col items-center">
                            <value.icon size={48} className="text-blue-600 mb-3" />
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{value.title}</h3>
                            <p className="text-gray-600 text-sm">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-slate-50 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Why Choose Ladakh Trails?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { num: '01', title: 'Local Expertise', desc: 'Deep knowledge of Ladakh and its hidden gems' },
                            { num: '02', title: 'Sustainable Practices', desc: 'Eco-friendly tours that minimize environmental impact' },
                            { num: '03', title: 'Expert Guides', desc: 'Trained, experienced, and passionate local guides' },
                            { num: '04', title: 'Flexible Tours', desc: 'Customizable itineraries to suit your preferences' },
                            { num: '05', title: '24/7 Support', desc: 'Round-the-clock customer support during your tour' },
                            { num: '06', title: 'Best Value', desc: 'Competitive pricing with premium quality experience' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                <p className="text-5xl font-bold mb-4 text-blue-100">{item.num}</p>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Meet Our Leadership</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: 'Namgail Chosphel', role: 'Founder', bio: 'With decades of experience in Ladakh tourism, Namgail leads our vision' },
                        { name: 'Jigmet Rinchen', role: 'Co-Founder', bio: 'Dedicated to creating authentic and sustainable travel experiences' },
                        { name: 'Jigmat Dorjey', role: 'Operational Manager', bio: 'Ensures seamless operations and exceptional service standards' }
                    ].map((member, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                                {member.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                            <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                            <p className="text-gray-600 text-sm">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-100 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">Ready to Explore with Us?</h2>
                    <p className="text-xl text-gray-700 mb-8">Join thousands of happy travelers who have experienced Ladakh with Ladakh Trails</p>
                    <a
                        href="/faq"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300 mr-4"
                    >
                        Have Questions?
                    </a>
                    <a
                        href="/"
                        className="inline-block bg-gray-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-700 transition duration-300"
                    >
                        Book a Tour
                    </a>
                </div>
            </section>
        </div>
    )
}

export default AboutUs
