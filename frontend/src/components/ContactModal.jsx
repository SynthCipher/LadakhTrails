import React from 'react';
import { FaInstagram, FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { X } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Placeholder contact details - User can update these later
    const contactInfo = {
        phone: "+91-9682574824",
        whatsapp: "+91-9682574824",
        email: "ladakhtrails.onela@gmail.com",
        instagram: "/onela.in/?hl=en"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold">Get in Touch</h3>
                        <p className="text-blue-100 text-sm mt-1">We'd love to hear from you!</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <a
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 hover:shadow-md transition group"
                    >
                        <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <FaWhatsapp size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">WhatsApp</h4>
                            <p className="text-sm text-gray-600">Chat with us instantly</p>
                        </div>
                    </a>

                    <a
                        href={`tel:${contactInfo.phone}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 hover:shadow-md transition group"
                    >
                        <div className="bg-blue-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <FaPhone size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Call Us</h4>
                            <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                        </div>
                    </a>

                    <a
                        href={`https://instagram.com/${contactInfo.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-pink-100 bg-pink-50 hover:bg-pink-100 hover:shadow-md transition group"
                    >
                        <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <FaInstagram size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Instagram</h4>
                            <p className="text-sm text-gray-600">Follow our adventures</p>
                        </div>
                    </a>

                    <a
                        href={`mailto:${contactInfo.email}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:shadow-md transition group"
                    >
                        <div className="bg-gray-700 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <FaEnvelope size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Email</h4>
                            <p className="text-sm text-gray-600">{contactInfo.email}</p>
                        </div>
                    </a>
                </div>

                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
                    Available Mon-Sat, 9am - 6pm
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
