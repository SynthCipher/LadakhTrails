import React from 'react'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Mountain, LinkedinIcon } from 'lucide-react'
import { assets } from '../assets/assets'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">  <img src={assets.logo} alt="Ladakh Trails" className="h-20 object-contain " />LadakhTrails</h3>
            <p className="text-sm leading-relaxed">
              Experience the breathtaking beauty of Ladakh with our expertly curated tour packages. Adventure awaits!
            </p>
          </div>

          {/* Tour Types */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Our Tours</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition">General Tour</a></li>
              <li><a href="/wildlife" className="hover:text-blue-400 transition">Wildlife Tour</a></li>
              <li><a href="/winter-sports" className="hover:text-blue-400 transition">Winter Sports</a></li>
              <li><a href="/birding" className="hover:text-blue-400 transition">Birding Tour</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="/faq" className="hover:text-blue-400 transition">FAQ</a></li>
              <li><a href="/terms" className="hover:text-blue-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-400" size={18} />
                <a href="tel:+91-9682574824" className="hover:text-blue-400 transition">+91-9682574824</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-400" size={18} />
                <a href="mailto:ladakhtrails.onela@gmail.com" className="hover:text-blue-400 transition">ladakhtrails.onela@gmail.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                <p>Leh, Ladakh, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6 mb-4 md:mb-0">
            {/* <a href="#facebook" className="hover:text-blue-400 transition" aria-label="Facebook"><Facebook size={20} /></a> */}
            <a href="https://www.instagram.com/onela.in/?hl=en" className="hover:text-pink-400 transition" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://www.linkedin.com/company/onela-in/" className="hover:text-blue-300 transition" aria-label="LinkedIn"><LinkedinIcon size={20} /></a>
          </div>
          <p className="text-sm text-center">
            &copy; {currentYear} LadakhTrails. All rights reserved. | Designed & Deployed by <a href="https://onela.in" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition font-semibold">Onela</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
