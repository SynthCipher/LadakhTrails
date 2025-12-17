import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { Mountain } from 'lucide-react'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinks = [
    // { path: '/', label: 'Home' },
    { path: '/general', label: 'General Tour' },
    { path: '/wildlife', label: 'Wildlife Tour' },
    { path: '/winter-sports', label: 'Winter Sports' },
    { path: '/birding', label: 'Birding Tour' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <Mountain size={22} />
              <span className="text-2xl font-bold">LadakhTrails</span>
            </div>
            {/* <span className="text-sm hidden sm:inline">LadakhTrails</span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-yellow-300 transition duration-300 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <a
            href="#contact"
            className="hidden md:block bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300"
          >
            Contact
          </a>

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
          <div className="md:hidden bg-blue-700 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-2 hover:bg-blue-600 transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#contact"
              className="block px-4 py-2 hover:bg-blue-600 transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
