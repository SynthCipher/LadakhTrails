import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { Mountain, Map, PawPrint, Snowflake, Feather, Info, HelpCircle } from 'lucide-react'
import ContactModal from './ContactModal'

import { assets } from '../assets/assets'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinks = [
    { path: '/general', label: 'General Tour', icon: Map },
    { path: '/wildlife', label: 'Wildlife Tour', icon: PawPrint },
    { path: '/winter-sports', label: 'Winter Sports', icon: Snowflake },
    { path: '/birding', label: 'Birding Tour', icon: Feather },
    { path: '/about', label: 'About', icon: Info },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <img src={assets.logo} alt="Ladakh Trails" className="h-10 object-contain " />
              <span className="text-xl italic">LadakhTrails</span>
            </div>
            {/* <span className="text-sm hidden sm:inline">LadakhTrails</span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition duration-300 text-sm font-medium ${location.pathname === link.path
                  ? 'text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1'
                  : 'text-white hover:text-yellow-300'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="hidden md:block bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300 cursor-pointer"
          >
            Contact
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-100 flex flex-col p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-white'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                    <Icon size={20} />
                  </div>
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsContactModalOpen(true)
                }}
                className="w-full bg-yellow-400 text-blue-900 font-bold py-4 rounded-xl shadow-md hover:bg-yellow-300 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </nav>
  )
}

export default Navbar
